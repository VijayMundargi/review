
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2, X } from 'lucide-react';
import { chatWithBot, type ChatbotInput } from '@/ai/flows/restaurant-chatbot-flow';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialBotMessage: Message = {
    id: 'initial-bot-message',
    sender: 'bot',
    text: "Hi! I’m your food guide for Gadag 🍽️. Want to check out restaurants, read reviews, or leave a review?",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading) {
      setMessages([initialBotMessage]);
    }
  }, [isOpen, messages.length, isLoading]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isLoading) {
       setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, isLoading]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    const currentInputValue = inputValue; 
    setInputValue('');
    setIsLoading(true);

    try {
      const historyForFlow = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : ('model' as 'user' | 'model'),
        parts: [{ text: msg.text }],
      }));

      const inputForFlow: ChatbotInput = {
        userMessage: currentInputValue, 
        chatHistory: historyForFlow 
      };
      
      const response = await chatWithBot(inputForFlow);
      
      const newBotMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error calling chatbot flow:", error);
      const errorBotMessage: Message = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: "Sorry, I seem to be having trouble connecting. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && !isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isLoading]);


  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in"
        style={{ animationDelay: '0.5s' }}
        aria-label="Open chatbot"
      >
        <MessageCircle size={32} />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background text-foreground" data-testid="chatbot-sheet">
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-primary flex items-center">
                <Bot className="mr-2 h-6 w-6" />
                Gadag Grub Assistant
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-muted-foreground/70 hover:bg-muted/50">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-grow p-4 bg-card" ref={scrollAreaRef as any}>
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end space-x-2 max-w-[85%]",
                    msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                  )}
                >
                  {msg.sender === 'bot' && (
                    <Avatar className="h-8 w-8 self-start shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-xl shadow-sm",
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-card-foreground rounded-bl-none'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={cn(
                        "text-xs mt-1",
                        msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left'
                      )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar className="h-8 w-8 self-start shrink-0">
                       <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 mr-auto justify-start max-w-[85%]">
                   <Avatar className="h-8 w-8 self-start shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  <div className="p-3 rounded-xl shadow-sm bg-muted text-card-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <SheetFooter className="p-4 border-t border-border bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask about restaurants..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || inputValue.trim() === ''} aria-label="Send message">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
