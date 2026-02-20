
import React, { useState, useEffect, useRef } from 'react';
import { Phone, Send, Calendar, Star, Award } from 'lucide-react';
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
import { apiFetch } from '@/lib/api';

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
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Messages() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isStudent = user?.role === 'student';

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/messages/${conversationId}`);
      const messagesList = (data?.messages || []).map((m: any) => ({
        id: m._id || m.id,
        conversationId,
        senderId: m.sender?._id || m.sender?.id || m.sender,
        receiverId: '',
        message: m.message,
        timestamp: m.createdAt || m.timestamp,
        read: Boolean(m.isRead ?? m.read),
      }));
      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: translate("Error"),
        description: translate("Failed to load messages."),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          issueId: activeChat,
          message: newMessage.trim()
        })
      });
      
      setNewMessage("");
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
                  const otherUserName = conversation.otherUser?.fullName || 'Unknown User';
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
                  {conversations.find(c => c.id === activeChat)?.otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">
                    {conversations.find(c => c.id === activeChat)?.otherUser?.fullName || 'Unknown User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversations.find(c => c.id === activeChat)?.otherUser?.role || ''}
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{translate("Loading messages...")}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{translate("No messages yet. Start the conversation!")}</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[75%] rounded-lg px-4 py-2",
                        isOwnMessage
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <p>{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={translate("Type your message...")}
                  className="min-h-10 flex-1 resize-none"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
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
