import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, BrainCircuit, Command } from 'lucide-react';
import { ChatMessage, chatWithAI } from '../services/geminiService';
import { FileNode } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile: FileNode | null;
  allFiles: FileNode[];
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isOpen,
  onClose,
  activeFile,
  allFiles,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage], activeFile, allFiles);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + (err as Error).message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed lg:relative top-0 right-0 h-full w-[320px] bg-slate-950 border-l border-slate-800 lg:border-none z-[90] lg:z-0 flex flex-col transition-all duration-300 ease-in-out transform shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "translate-x-full lg:hidden"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Companion AI</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Active Context: {activeFile?.name || 'Full Project'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                 <BrainCircuit className="w-8 h-8 text-violet-500 opacity-50" />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">
                Ask me to write code, explain a function, or debug your project.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col space-y-2 max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-4 py-3 rounded-2xl text-xs leading-relaxed",
                msg.role === 'user' 
                  ? "bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-900/20" 
                  : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none"
              )}>
                {msg.content}
              </div>
              <span className="text-[8px] text-slate-600 font-bold uppercase">
                {msg.role === 'user' ? 'Me' : 'Flow AI'}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col space-y-2 mr-auto items-start max-w-[85%]">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can I help?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1.5 p-2 bg-violet-600 rounded-lg text-white disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-violet-900/20"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center space-x-2 text-[8px] text-slate-600 font-bold uppercase tracking-widest">
            <Command className="w-2.5 h-2.5" />
            <span>Enter to Send</span>
          </div>
        </div>
      </div>
    </>
  );
};
