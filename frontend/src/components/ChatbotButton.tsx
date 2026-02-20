
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from '@/contexts/ThemeContext';

export function ChatbotButton() {
  const { translate } = useLanguage();
  const { theme } = useTheme();
  
  const openChatbot = () => {
    // Navigate to the chatbot page
    window.location.href = '/chatbot';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className={`fixed bottom-4 right-4 rounded-full shadow-lg z-50 w-12 h-12 p-0 transition-all duration-300 hover:scale-110`}
            onClick={openChatbot}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{translate("Open Chatbot")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
