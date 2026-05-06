/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Cpu, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Echo({ windowId }: { windowId?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "System online. I am Echo, your integrated intelligence for geminiOS. How can I assist your workflow today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
            { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
            systemInstruction: "You are Echo, the built-in AI assistant for geminiOS (codename: New York). Your tone is technical, professional, yet helpful. You are integrated into the OS. You know about metropolis themes, industrial design, and productivity. Keep responses concise and insightful."
        }
      });

      const aiContent = response.text || "I was unable to process that command. System integrity is prioritized.";
      setMessages(prev => [...prev, { role: 'model', content: aiContent }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Critical Error: Connection to neural core lost." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'model' ? 'bg-os-accent/20 text-os-accent' : 'bg-white/10 text-white/50'
            }`}>
              {msg.role === 'model' ? <Cpu size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'model' ? 'bg-white/5 text-white/90' : 'bg-os-accent/10 border border-os-accent/20 text-white'
            }`}>
               <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-lg bg-os-accent/20 text-os-accent flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
             </div>
             <div className="bg-white/5 rounded-2xl px-4 py-3 flex gap-1 items-center">
                <span className="w-1 h-1 bg-os-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-os-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-os-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2 p-2 glass rounded-xl bg-white/5">
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-white placeholder:text-white/20"
            placeholder="Ask Echo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
             onClick={handleSend}
             disabled={isLoading || !input.trim()}
             className="p-2 hover:bg-os-accent rounded-lg transition-all text-white/50 hover:text-white disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
