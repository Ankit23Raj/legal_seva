
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Send, Calendar, Star, Award } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { apiFetch, API_ORIGIN } from '@/lib/api';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  otherUser?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  receiverName?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

type FetchMessagesOptions = {
  showLoading?: boolean;
  showErrorToast?: boolean;
};

type SocketStatus = 'connected' | 'reconnecting' | 'disconnected';

type TypingPayload = {
  issueId: string;
  userId?: string;
  userName?: string;
  isTyping: boolean;
};

type PresencePayloadOnline = {
  userId: string;
  at?: string;
};

type PresencePayloadOffline = {
  userId: string;
  lastSeen?: string | null;
};

export default function Messages() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const { issueId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessagesSignatureRef = useRef<string>('');
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('disconnected');
  const pollIntervalRef = useRef<number | null>(null);
  const activeChatRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string>('');
  const typingEmitDebounceRef = useRef<number | null>(null);
  const typingStopTimeoutRef = useRef<number | null>(null);
  const lastTypingEmitAtRef = useRef<number>(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const typingHideTimeoutsRef = useRef<Record<string, number>>({});

  const [animatedIncomingIds, setAnimatedIncomingIds] = useState<Record<string, true>>({});
  const animatedIncomingTimeoutsRef = useRef<Record<string, number>>({});
  const lastSeenMessageIdByConversationRef = useRef<Record<string, string>>({});

  const [presenceByUserId, setPresenceByUserId] = useState<Record<string, { online: boolean; lastSeen?: string | null }>>({});
  const watchedOtherUserIdRef = useRef<string | null>(null);

  const [isNearBottom, setIsNearBottom] = useState(true);
  const isNearBottomRef = useRef(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const lastRenderedMessageIdRef = useRef<string>('');
  const forceScrollOnNextMessagesRef = useRef(false);
  const recalcNearBottomRef = useRef<(() => void) | null>(null);
  const debugLoggedMessageIdsRef = useRef<Record<string, true>>({});
  
  const isStudent = user?.role === 'student';
  const currentUserId = String(
    (user as any)?.id ??
    (user as any)?._id ??
    (user as any)?.userId ??
    (user as any)?.uid ??
    ''
  );

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    isNearBottomRef.current = isNearBottom;
  }, [isNearBottom]);

  useEffect(() => {
    currentUserIdRef.current = String(currentUserId || '');
  }, [currentUserId]);

  const activeConversation = activeChat
    ? conversations.find((c) => c.id === activeChat)
    : undefined;

  // For clients, an unassigned issue means there is no "otherUser" (student) in the conversation list.
  const isWaitingForStudent = !isStudent && !!activeChat && !activeConversation?.otherUser?.id;

  const conversationOtherUserId = activeConversation?.otherUser?.id
    ? String(activeConversation.otherUser.id)
    : '';

  const inferOtherParticipant = useCallback(() => {
    if (!currentUserId) return { id: '', name: '' };

    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const m = messages[i];
      const senderId = String((m as any)?.senderId || '');
      const receiverId = String((m as any)?.receiverId || '');

      if (senderId && senderId !== currentUserId) {
        return { id: senderId, name: String((m as any)?.senderName || '') };
      }
      if (receiverId && receiverId !== currentUserId) {
        return { id: receiverId, name: String((m as any)?.receiverName || '') };
      }
    }

    return { id: '', name: '' };
  }, [messages, currentUserId]);

  const inferredOther = inferOtherParticipant();

  // Prefer the server-provided otherUser only when it is not the logged-in user.
  const otherUserId =
    conversationOtherUserId && conversationOtherUserId !== currentUserId
      ? conversationOtherUserId
      : inferredOther.id;

  const otherUserName =
    conversationOtherUserId && conversationOtherUserId !== currentUserId
      ? String(activeConversation?.otherUser?.fullName || '')
      : inferredOther.name;

  const resolvedOtherUserName = isWaitingForStudent
    ? translate('Waiting for student...')
    : otherUserName
      ? otherUserName
      : conversationOtherUserId && conversationOtherUserId !== currentUserId
        ? String(activeConversation?.otherUser?.fullName || 'Unknown User')
        : 'Unknown User';

  const otherPresence = otherUserId ? presenceByUserId[otherUserId] : undefined;

  const formatLastSeen = useCallback((value?: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';

    const now = new Date();
    const isSameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    return isSameDay
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }, []);

  const emitTyping = useCallback((issueId: string, isTyping: boolean) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit('conversation:typing', { issueId, isTyping });
  }, []);

  const clearTypingUsers = useCallback(() => {
    const timeouts = typingHideTimeoutsRef.current;
    Object.values(timeouts).forEach((t) => window.clearTimeout(t));
    typingHideTimeoutsRef.current = {};
    setTypingUsers({});
  }, []);

  const flagIncomingAnimation = useCallback((messageId: string) => {
    if (!messageId) return;

    setAnimatedIncomingIds((prev) => (prev[messageId] ? prev : { ...prev, [messageId]: true }));

    const existing = animatedIncomingTimeoutsRef.current[messageId];
    if (existing) window.clearTimeout(existing);

    animatedIncomingTimeoutsRef.current[messageId] = window.setTimeout(() => {
      setAnimatedIncomingIds((prev) => {
        if (!prev[messageId]) return prev;
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      delete animatedIncomingTimeoutsRef.current[messageId];
    }, 260);
  }, []);

  const scheduleTypingStop = useCallback((issueId: string) => {
    if (typingStopTimeoutRef.current) {
      window.clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = null;
    }

    typingStopTimeoutRef.current = window.setTimeout(() => {
      emitTyping(issueId, false);
    }, 2200);
  }, [emitTyping]);

  const handleDraftChange = useCallback(
    (value: string) => {
      setNewMessage(value);

      const issueId = activeChatRef.current;
      if (!issueId) return;
      if (isWaitingForStudent) return;

      if (typingEmitDebounceRef.current) {
        window.clearTimeout(typingEmitDebounceRef.current);
        typingEmitDebounceRef.current = null;
      }

      typingEmitDebounceRef.current = window.setTimeout(() => {
        const now = Date.now();
        const elapsed = now - lastTypingEmitAtRef.current;

        // Throttle to at most ~1 event/sec while typing.
        if (elapsed >= 900) {
          lastTypingEmitAtRef.current = now;
          emitTyping(issueId, true);
        }

        scheduleTypingStop(issueId);
      }, 250);
    },
    [emitTyping, scheduleTypingStop, isWaitingForStudent]
  );

  // If navigated from ReplyClient (e.g. /messages/:issueId), open that chat.
  useEffect(() => {
    if (issueId) {
      setActiveChat(issueId);
    }
  }, [issueId]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);


  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      // New thread: scroll to bottom after messages load.
      forceScrollOnNextMessagesRef.current = true;
      setNewMessagesCount(0);
      setIsNearBottom(true);
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Track user scroll position within the messages container.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const thresholdPx = 48;
    const update = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const nearBottom = distanceFromBottom <= thresholdPx;
      setIsNearBottom(nearBottom);
      if (nearBottom) setNewMessagesCount(0);
    };

    update();
    recalcNearBottomRef.current = update;
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      el.removeEventListener('scroll', update);
      recalcNearBottomRef.current = null;
    };
  }, [activeChat]);

  // Recalculate near-bottom when messages change (e.g. new message appended).
  useEffect(() => {
    recalcNearBottomRef.current?.();
  }, [messages.length]);

  // Auto-scroll behavior: only when user is at bottom, or when user sends a message,
  // or right after switching conversations.
  useEffect(() => {
    const last = messages[messages.length - 1];
    const lastId = last?.id || '';
    const prevLastId = lastRenderedMessageIdRef.current;

    const isFirstRenderForThread = forceScrollOnNextMessagesRef.current;
    const hasNewLastMessage = !!lastId && lastId !== prevLastId;
    const isOwnLastMessage = last?.senderId && String(last.senderId) === String(currentUserId);

    if (isFirstRenderForThread) {
      forceScrollOnNextMessagesRef.current = false;
      lastRenderedMessageIdRef.current = lastId;
      // Use instant scroll for initial load to avoid a big smooth jump.
      scrollToBottom('auto');
      return;
    }

    if (!hasNewLastMessage) return;
    lastRenderedMessageIdRef.current = lastId;

    if (isOwnLastMessage) {
      // If user sent a message, jump to bottom even if they were scrolled up.
      setNewMessagesCount(0);
      scrollToBottom('smooth');
      return;
    }

    if (isNearBottomRef.current) {
      scrollToBottom('smooth');
    } else {
      setNewMessagesCount((c) => c + 1);
    }
  }, [messages, currentUserId, scrollToBottom]);

  const fetchConversations = async () => {
    try {
      const data = await apiFetch('/messages/conversations');
      const conversationsList = data?.conversations || [];
      setConversations(conversationsList);
      if (conversationsList.length > 0 && !activeChat) {
        setActiveChat(conversationsList[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = useCallback(async (conversationId: string, options: FetchMessagesOptions = {}) => {
    const showLoading = options.showLoading ?? true;
    const showErrorToast = options.showErrorToast ?? true;

    try {
      if (showLoading) setIsLoading(true);
      const payload: any = await apiFetch(`/messages/${conversationId}`);

      const rawMessages = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.messages)
          ? payload.messages
          : Array.isArray(payload?.data?.messages)
            ? payload.data.messages
            : [];

      const messagesList: Message[] = rawMessages.map((m: any) => ({
        id: m._id || m.id,
        conversationId,
        senderId: String(m.sender?._id || m.sender?.id || m.sender || ''),
        receiverId: String(m.receiver?._id || m.receiver?.id || m.receiver || ''),
        senderName: String(m.sender?.name || m.senderName || ''),
        receiverName: String(m.receiver?.name || m.receiverName || ''),
        message: m.message,
        timestamp: m.createdAt || m.timestamp,
        read: Boolean(m.isRead ?? m.read),
      }));

      // Animate only newly received incoming messages (works for REST fallback/polling too).
      const prevLastId = lastSeenMessageIdByConversationRef.current[conversationId];
      const lastMsg = messagesList[messagesList.length - 1];
      const lastId = lastMsg?.id;
      const lastFromOther = lastMsg?.senderId && String(lastMsg.senderId) !== String(currentUserId);
      if (prevLastId && lastId && prevLastId !== lastId && lastFromOther) {
        flagIncomingAnimation(lastId);
      }
      if (lastId) {
        lastSeenMessageIdByConversationRef.current[conversationId] = lastId;
      }

      // Avoid unnecessary re-renders: only update state when messages actually change.
      const last = messagesList[messagesList.length - 1];
      const signature = `${messagesList.length}:${last?.id || ''}:${last?.timestamp || ''}`;
      if (signature !== lastMessagesSignatureRef.current) {
        lastMessagesSignatureRef.current = signature;
        setMessages(messagesList);
      }

      // Mark unread messages as read (recipient-side only) and update the unread dot.
      const unreadFromOther = messagesList.filter(
        (m) => !m.read && m.senderId && String(m.senderId) !== String(currentUserId)
      );

      if (unreadFromOther.length > 0) {
        // Optimistically update local UI state.
        setMessages((prev) =>
          prev.map((m) =>
            unreadFromOther.some((u) => u.id === m.id) ? { ...m, read: true } : m
          )
        );

        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unread: false } : c))
        );

        // Fire-and-forget PATCH requests; failures are non-fatal for UI.
        void Promise.all(
          unreadFromOther
            .filter((m) => !!m.id)
            .map((m) =>
              apiFetch(`/messages/${m.id}/read`, {
                method: 'PATCH',
              }).catch((err) => {
                console.warn('[Messages] markAsRead failed:', err);
              })
            )
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (showErrorToast) {
        toast({
          variant: "destructive",
          title: translate("Error"),
          description: translate("Failed to load messages."),
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [currentUserId, translate, flagIncomingAnimation]);

  // Fallback polling: only when socket is not connected.
  useEffect(() => {
    if (!activeChat || socketConnected) return;

    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    pollIntervalRef.current = window.setInterval(() => {
      fetchMessages(activeChat, { showLoading: false, showErrorToast: false });
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        window.clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [activeChat, socketConnected, fetchMessages]);

  // Socket.IO: connect once (when authenticated) and listen for message events.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(API_ORIGIN, {
      transports: ['websocket', 'polling'],
      auth: { token },
    });

    socketRef.current = socket;

    // As soon as we create a socket, show reconnecting until connect.
    setSocketStatus('reconnecting');

    const onConnect = () => {
      setSocketConnected(true);
      setSocketStatus('connected');
    };

    const onDisconnect = () => {
      setSocketConnected(false);
      setSocketStatus('disconnected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Socket.IO reconnect events are emitted by the Manager.
    const onReconnectAttempt = () => {
      setSocketConnected(false);
      setSocketStatus('reconnecting');
    };

    const onReconnect = () => {
      setSocketConnected(true);
      setSocketStatus('connected');
    };

    const onReconnectFailed = () => {
      setSocketConnected(false);
      setSocketStatus('disconnected');
    };

    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);
    socket.io.on('reconnect_failed', onReconnectFailed);

    socket.on('message:created', (payload: any) => {
      const m = payload?.message;
      if (!m) return;

      const issue = String(m.issue?._id || m.issue || '');
      if (!issue) return;

      const incoming: Message = {
        id: m._id || m.id,
        conversationId: issue,
        senderId: String(m.sender?._id || m.sender?.id || m.sender || ''),
        receiverId: String(m.receiver?._id || m.receiver?.id || m.receiver || ''),
        senderName: String(m.sender?.name || m.senderName || ''),
        receiverName: String(m.receiver?.name || m.receiverName || ''),
        message: m.message,
        timestamp: m.createdAt || m.timestamp,
        read: Boolean(m.isRead ?? m.read),
      };

      const currentUserIdNow = currentUserIdRef.current;
      const activeChatNow = activeChatRef.current;

      // Update conversation list last-message and unread dot.
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== issue) return c;
          const isOwn = incoming.senderId === String(currentUserIdNow);
          return {
            ...c,
            lastMessage: incoming.message,
            lastMessageTime: incoming.timestamp,
            unread: !isOwn && activeChatNow !== issue ? true : c.unread,
          };
        })
      );

      // If the message belongs to the currently open chat, append it and mark as read.
      if (activeChatNow === issue) {
        setMessages((prev) => {
          if (prev.some((x) => x.id === incoming.id)) return prev;
          return [...prev, incoming];
        });

        if (incoming?.id) {
          lastSeenMessageIdByConversationRef.current[issue] = incoming.id;
        }

        // Mark as read for messages from the other user.
        const isOwn = incoming.senderId === String(currentUserIdNow);
        if (!isOwn && incoming.id) {
          flagIncomingAnimation(incoming.id);
          setMessages((prev) => prev.map((x) => (x.id === incoming.id ? { ...x, read: true } : x)));
          setConversations((prev) => prev.map((c) => (c.id === issue ? { ...c, unread: false } : c)));
          void apiFetch(`/messages/${incoming.id}/read`, { method: 'PATCH' }).catch((err) => {
            console.warn('[Messages] markAsRead failed:', err);
          });
        }
      }
    });

    socket.on('user:online', (payload: PresencePayloadOnline) => {
      const id = String(payload?.userId || '');
      if (!id) return;
      setPresenceByUserId((prev) => ({
        ...prev,
        [id]: { online: true, lastSeen: prev[id]?.lastSeen ?? null },
      }));
    });

    socket.on('user:offline', (payload: PresencePayloadOffline) => {
      const id = String(payload?.userId || '');
      if (!id) return;
      setPresenceByUserId((prev) => ({
        ...prev,
        [id]: { online: false, lastSeen: payload?.lastSeen ?? prev[id]?.lastSeen ?? null },
      }));
    });

    socket.on('conversation:typing', (payload: TypingPayload) => {
      const issue = String(payload?.issueId || '');
      if (!issue) return;
      if (issue !== activeChatRef.current) return;

      // Ignore own typing events (shouldn't be received, but keep safe)
      const userId = String(payload?.userId || '');
      if (userId && userId === currentUserIdRef.current) return;

      const key = userId || String(payload?.userName || 'unknown');
      const name = String(payload?.userName || 'User');

      if (payload.isTyping) {
        setTypingUsers((prev) => ({
          ...prev,
          [key]: name,
        }));

        // Auto-hide per user if no follow-up typing events arrive.
        const existing = typingHideTimeoutsRef.current[key];
        if (existing) window.clearTimeout(existing);

        typingHideTimeoutsRef.current[key] = window.setTimeout(() => {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
          delete typingHideTimeoutsRef.current[key];
        }, 2500);
      } else {
        const existing = typingHideTimeoutsRef.current[key];
        if (existing) window.clearTimeout(existing);
        delete typingHideTimeoutsRef.current[key];
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    });

    socket.on('connect_error', () => {
      // Keep REST as fallback (initial fetch already happens); we just mark socket as disconnected.
      setSocketConnected(false);
      setSocketStatus('disconnected');
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('conversation:typing');
      socket.off('user:online');
      socket.off('user:offline');
      clearTypingUsers();
      Object.values(animatedIncomingTimeoutsRef.current).forEach((t) => window.clearTimeout(t));
      animatedIncomingTimeoutsRef.current = {};
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
      socket.io.off('reconnect_failed', onReconnectFailed);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [clearTypingUsers, flagIncomingAnimation]);

  // Presence: watch only the other user in the active conversation.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const prev = watchedOtherUserIdRef.current;
    const next = otherUserId || '';

    if (prev && prev !== next) {
      socket.emit('presence:unwatch', { userIds: [prev] });
    }

    watchedOtherUserIdRef.current = next || null;
    if (next) {
      socket.emit('presence:watch', { userIds: [next] });
    }

    return () => {
      if (next) {
        socket.emit('presence:unwatch', { userIds: [next] });
      }
    };
  }, [otherUserId, socketStatus]);

  // Ensure timers are always cleaned up on unmount (even when socket never connected).
  useEffect(() => {
    return () => {
      if (typingEmitDebounceRef.current) window.clearTimeout(typingEmitDebounceRef.current);
      if (typingStopTimeoutRef.current) window.clearTimeout(typingStopTimeoutRef.current);
      Object.values(typingHideTimeoutsRef.current).forEach((t) => window.clearTimeout(t));
      typingHideTimeoutsRef.current = {};
      Object.values(animatedIncomingTimeoutsRef.current).forEach((t) => window.clearTimeout(t));
      animatedIncomingTimeoutsRef.current = {};
    };
  }, []);

  // Join/leave the active issue room.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (activeChat) {
      clearTypingUsers();
      socket.emit('conversation:join', { issueId: activeChat });
    }

    return () => {
      if (activeChat) {
        emitTyping(activeChat, false);
        clearTypingUsers();
        socket.emit('conversation:leave', { issueId: activeChat });
      }
    };
  }, [activeChat, emitTyping]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    if (isWaitingForStudent) return;
    
    try {
      emitTyping(activeChat, false);
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          issueId: activeChat,
          message: newMessage.trim()
        })
      });
      
      setNewMessage("");
      setNewMessagesCount(0);
      // Refresh messages
      await fetchMessages(activeChat);
      // Refresh conversations to update last message
      await fetchConversations();
      
      toast({
        title: translate("Message Sent"),
        description: translate("Your message has been sent successfully."),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: translate("Error"),
        description: translate("Failed to send message."),
      });
    }
  };
  
  const handleScheduleCall = () => {
    if (!date) {
      toast({
        variant: "destructive",
        title: translate("Select a Date"),
        description: translate("Please select a date for the call."),
      });
      return;
    }
    
    toast({
      title: translate("Call Scheduled"),
      description: translate("Your call has been scheduled successfully."),
    });
  };
  
  const handleSubmitRating = () => {
    if (!ratingValue) {
      toast({
        variant: "destructive",
        title: translate("Select a Rating"),
        description: translate("Please select a rating before submitting."),
      });
      return;
    }
    
    toast({
      title: translate("Rating Submitted"),
      description: translate("Thank you for rating your experience."),
    });
    setRatingValue(null);
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-end pb-2">
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs',
            socketStatus === 'connected'
              ? 'border-success/30 bg-success/10 text-success'
              : socketStatus === 'reconnecting'
                ? 'border-warning/30 bg-warning/10 text-warning'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
          )}
          aria-live="polite"
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              socketStatus === 'connected'
                ? 'bg-success'
                : socketStatus === 'reconnecting'
                  ? 'bg-warning'
                  : 'bg-destructive'
            )}
          />
          <span className="font-medium">
            {socketStatus === 'connected'
              ? translate('Connected')
              : socketStatus === 'reconnecting'
                ? translate('Reconnecting...')
                : translate('Disconnected (fallback mode)')}
          </span>
        </div>
      </div>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-md border">
        {/* Chat List */}
        <div className="w-80 border-r overflow-auto bg-card">
          <div className="p-4">
            <h2 className="font-semibold mb-4">{translate("Conversations")}</h2>
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {translate("No conversations yet")}
                </p>
              ) : (
                conversations.map((conversation) => {
                  const convOtherId = conversation.otherUser?.id ? String(conversation.otherUser.id) : '';
                  const otherUserName = !convOtherId
                    ? (!isStudent ? translate('Waiting for student...') : 'Unknown User')
                    : convOtherId === currentUserId
                      ? 'Unknown User'
                      : (conversation.otherUser?.fullName || 'Unknown User');
                  const avatar = otherUserName.charAt(0).toUpperCase();
                  
                  return (
                    <button
                      key={conversation.id}
                      className={cn(
                        "flex items-start gap-3 w-full p-3 text-left rounded-md transition-colors",
                        activeChat === conversation.id
                          ? "bg-primary/10"
                          : "hover:bg-secondary"
                      )}
                      onClick={() => setActiveChat(conversation.id)}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground bg-primary">
                        {avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {otherUserName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground bg-primary">
                  {(isWaitingForStudent ? '?' : resolvedOtherUserName).charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {resolvedOtherUserName}
                    </p>
                    {!isWaitingForStudent && otherUserId && (
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          otherPresence?.online ? 'bg-success' : 'bg-muted'
                        )}
                        aria-label={otherPresence?.online ? translate('Online') : translate('Offline')}
                        title={otherPresence?.online ? translate('Online') : translate('Offline')}
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      if (isWaitingForStudent) return translate('Waiting for student...');
                      if (!otherUserId) return activeConversation?.otherUser?.role || '';
                      if (otherPresence?.online) return translate('Online');
                      const ls = formatLastSeen(otherPresence?.lastSeen);
                      return ls ? `${translate('Last seen')} ${ls}` : translate('Offline');
                    })()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      {translate("Schedule Call")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{translate("Schedule a Call")}</DialogTitle>
                      <DialogDescription>
                        {translate("Pick a date and time for your call.")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center space-y-4">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                        disabled={(date) => date < new Date()}
                      />
                      
                      <div className="w-full">
                        <label className="text-sm font-medium">
                          {translate("Selected Date")}
                        </label>
                        <Input
                          value={date ? format(date, "PPP") : ""}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="w-full">
                        <label className="text-sm font-medium">
                          {translate("Preferred Time")}
                        </label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option value="9:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleScheduleCall}>
                        {translate("Schedule Call")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {!isStudent && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Star className="h-4 w-4 text-warning" />
                        {translate("Rate Advisor")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h3 className="font-medium">
                          {translate("Rate your experience")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {translate("How would you rate the legal advice provided?")}
                        </p>
                        <div className="flex justify-center py-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1"
                              onClick={() => setRatingValue(star)}
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6",
                                  star <= (ratingValue || 0)
                                    ? "text-warning fill-warning"
                                    : "text-muted-foreground"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder={translate("Additional feedback (optional)")}
                          className="resize-none"
                        />
                        <Button className="w-full" onClick={handleSubmitRating}>
                          {translate("Submit Rating")}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  {translate("Call")}
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{translate("Loading messages...")}</p>
                </div>
              ) : isWaitingForStudent ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    {translate("Waiting for a student to respond")}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{translate("No messages yet. Start the conversation!")}</p>
                </div>
              ) : (
                messages.map((message) => {
                  const senderId = String(
                    (message as any)?.sender?._id ??
                    (message as any)?.sender?.id ??
                    (message as any)?.senderId ??
                    (message as any)?.user?._id ??
                    (message as any)?.user?.id ??
                    (message as any)?.userId ??
                    ''
                  );

                  // If either id is missing, treat as NOT own to avoid "everything on the right".
                  const isOwnMessage = !!currentUserId && !!senderId && senderId === String(currentUserId);

                  if (import.meta.env.DEV) {
                    const key = String((message as any)?.id || (message as any)?._id || '');
                    if (key && !debugLoggedMessageIdsRef.current[key]) {
                      debugLoggedMessageIdsRef.current[key] = true;
                      // Temporary debug: verify sender detection.
                      console.log('[Messages] message/currentUserId', message, currentUserId);
                    }
                  }
                  const shouldAnimateIncoming = !!animatedIncomingIds[message.id] && !isOwnMessage;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex w-full',
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'relative flex w-fit max-w-[60%] flex-col gap-1 break-words whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed',
                          shouldAnimateIncoming && 'animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
                          isOwnMessage
                            ? 'ml-auto bg-success/15 text-foreground rounded-br-sm'
                            : 'mr-auto bg-background text-foreground border border-border rounded-bl-sm'
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        <div className="flex justify-end">
                          <span className="text-[11px] leading-none opacity-60">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </div>

                        {/* Tail */}
                        <div
                          className={cn(
                            'pointer-events-none absolute h-0 w-0 border-y-[8px] border-y-transparent top-3',
                            isOwnMessage
                              ? 'right-[-8px] border-l-[8px] border-l-[hsl(var(--success))]'
                              : 'left-[-8px] border-r-[8px] border-r-[hsl(var(--background))]'
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  );
                })
              )}

              {newMessagesCount > 0 && !isNearBottom && !isWaitingForStudent && (
                <div className="sticky bottom-3 z-10 flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-sm"
                    onClick={() => {
                      setNewMessagesCount(0);
                      scrollToBottom('smooth');
                    }}
                    aria-live="polite"
                  >
                    {newMessagesCount === 1
                      ? translate('New message')
                      : `${newMessagesCount} ${translate('New messages')}`}
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              {Object.keys(typingUsers).length > 0 && !isWaitingForStudent && (
                <p className="text-xs text-muted-foreground mb-2">
                  {(() => {
                    const names = Array.from(new Set(Object.values(typingUsers))).filter(Boolean);
                    if (names.length === 1) return `${names[0]} is typing...`;
                    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
                    return `${names[0]} and ${names.length - 1} others are typing...`;
                  })()}
                </p>
              )}
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => handleDraftChange(e.target.value)}
                  placeholder={translate("Type your message...")}
                  className="min-h-10 flex-1 resize-none"
                  disabled={isWaitingForStudent}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isWaitingForStudent}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isWaitingForStudent && (
                <p className="text-xs text-muted-foreground mt-2">
                  {translate("Waiting for a student to respond")}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {translate("Select a conversation to start chatting")}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
