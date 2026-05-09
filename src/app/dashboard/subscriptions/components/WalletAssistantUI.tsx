'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, User, Sparkles } from 'lucide-react';
import { walletAssistant } from '@/app/actions/wallet-assistant';

export function WalletAssistantUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await walletAssistant(userMessage);
      if (response.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${response.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || '' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An unexpected error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-card border border-border shadow-2xl rounded-3xl w-[380px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Wallet Assistant</h4>
                <p className="text-[10px] opacity-80">AI-Powered Insights</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Sparkles size={32} />
                </div>
                <div>
                  <p className="font-bold text-sm">How can I help you today?</p>
                  <p className="text-xs text-muted-foreground">Ask about your spending, active plans, or app details.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  {['Total spend?', 'My active apps', 'What is Khalti?'].map(q => (
                    <button 
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-[10px] font-bold py-1.5 px-3 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                    m.role === 'user' ? 'bg-muted border border-border' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-primary" />
                    <span className="text-[10px] font-medium">Analyzing ecosystem...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-muted/20">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-4 pr-12 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative bg-primary text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-background animate-pulse" />
          <div className="absolute right-full mr-4 bg-card border border-border px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <p className="text-[10px] font-bold text-foreground">Need help with billing?</p>
          </div>
        </button>
      )}
    </div>
  );
}
