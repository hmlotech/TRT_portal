import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  MessageSquare, X, Send, Sparkles, Loader2, RefreshCcw, 
  Maximize2, Minimize2, Search, Plus, MoreHorizontal, 
  Mic, Image as ImageIcon, ArrowRight, Clock, ChevronDown, FileText, Trash2
} from 'lucide-react';
import { NewsItem } from '../../types';
import { TiaAvatar } from '../visuals/TiaAvatar';

interface ChatBotProps {
  contextData: NewsItem[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface SavedChat {
  id: string;
  title: string;
  date: string; // Display date
  timestamp: number; // For sorting
  messages: Message[];
}

export const ChatBot: React.FC<ChatBotProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  
  // Active Conversation State
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Hello, John. I am TIA (TRT Intelligence Agent). Ask me anything about the TRT updates and I will provide you grounded responses.' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // History State
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fullPageInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logic: Only scroll when the NUMBER of messages changes (new message added),
  // NOT when the text of the last message updates (streaming).
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length, isOpen, isFullPage]);

  // Focus input on mode switch
  useEffect(() => {
    if (isFullPage) {
      setTimeout(() => fullPageInputRef.current?.focus(), 100);
    } else if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isFullPage, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };

    // Add user message
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'model',
      text: '' // Start empty for streaming
    }]);

    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare Context (Simulating RAG)
      const contextString = JSON.stringify(contextData.map(item => ({
          date: item.date,
          type: item.type,
          title: item.title,
          summary: item.summary,
          tumorType: item.tumorType, 
          source: item.sourceName,
          companies: item.companies,
          assets: item.assets
      })));

      const systemInstruction = `You are TIA (TRT Intelligence Agent), a world-class biopharma strategy consultant (McKinsey/BCG level) specializing in Targeted Radionuclide Therapy (TRT) and oncology.
      Your objective is to provide high-level, executive-grade insights based strictly on the provided intelligence feed.

      Context Data:
      ${contextString}

      Response Guidelines:
      1. **Consultant-Level Depth:** Provide detailed analysis, strategic implications, and "so what" insights. Do not just regurgitate facts.
      2. **Structured Formatting:**
         - Use **bolding** for key entities and metrics.
         - Use bullet points for readability.
         - **MANDATORY:** Use Markdown tables when comparing assets, companies, trial results, or financial figures.
      3. **Accuracy:** Strictly adhere to the context provided. If data is missing, state "Data not available in current intelligence feed."
      4. **Tone:** Professional, objective, and data-driven.

      If the user asks for a table, ensure it is formatted correctly in Markdown.`;

      // Prepare History for the API (excluding the last placeholder and the just added user message for context building if needed, but chats.create handles history internally usually)
      // Actually, we should pass previous history to create chat context
      const apiHistory = messages.slice(1, -1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      })); // Previous messages before the current turn

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, 
        },
        history: apiHistory
      });

      const resultStream = await chat.sendMessageStream({ message: userText });
      
      let fullResponseText = '';

      for await (const chunk of resultStream) {
          const chunkText = chunk.text || '';
          fullResponseText += chunkText;
          
          setMessages(prev => {
              // Create a new array to avoid mutating state directly
              const updatedMessages = [...prev];
              // Find the AI message we added earlier (it should be the last one)
              const lastIndex = updatedMessages.length - 1;
              if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'model') {
                  updatedMessages[lastIndex] = {
                      ...updatedMessages[lastIndex],
                      text: fullResponseText
                  };
              }
              return updatedMessages;
          });
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'model') {
              updatedMessages[lastIndex].text = "System Error: Unable to connect to intelligence node. Please check your API key configuration.";
          }
          return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Saves current chat to history and resets view
  const handleNewChat = () => {
    // Only save if there is an actual conversation (more than just the greeting)
    if (messages.length > 1) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        const title = firstUserMsg ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '') : 'New Conversation';
        
        const newHistoryItem: SavedChat = {
            id: Date.now().toString(),
            title: title,
            date: 'Today',
            timestamp: Date.now(),
            messages: [...messages]
        };
        setSavedChats(prev => [newHistoryItem, ...prev]);
    }

    // Reset
    setMessages([{ 
      id: Date.now().toString(), 
      role: 'model', 
      text: 'Hello, John. I am TIA (TRT Intelligence Agent). Ask me anything about the TRT updates and I will provide you grounded responses.' 
    }]);
    setInputValue('');
  };

  const loadChat = (chat: SavedChat) => {
      setMessages(chat.messages);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setSavedChats(prev => prev.filter(c => c.id !== id));
  };

  const openFullPage = () => {
    setIsOpen(true);
    setIsFullPage(true);
  };

  const closeFullPage = () => {
    setIsFullPage(false);
  };

  // Markdown Components Config
  const markdownComponents = {
      table: ({node, ...props}) => (
          <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm" {...props} />
          </div>
      ),
      thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
      tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-200 bg-white" {...props} />,
      tr: ({node, ...props}) => <tr {...props} />,
      th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider" {...props} />,
      td: ({node, ...props}) => <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
      li: ({node, ...props}) => <li className="pl-1" {...props} />,
      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 text-gray-800" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-2 text-gray-800" {...props} />,
      p: ({node, ...props}) => <p className="mb-3 leading-relaxed last:mb-0" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
      a: ({node, ...props}) => <a className="text-brand-cyan hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  };

  // --- FULL PAGE RENDER ---
  if (isFullPage) {
    return (
      // EXPANDED TO LEFT-0 to cover sidebar as requested
      // Main container bg-slate-900 to ensure dark theme edges
      <div className="fixed top-20 left-0 right-0 bottom-0 z-50 bg-slate-900 flex font-sans text-slate-800 animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        
        {/* Left Sidebar - History - DARK THEME */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 transition-all">
          
          {/* Header Area */}
          <div className="p-5 shrink-0 relative overflow-hidden">
              {/* Abstract Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl opacity-50"></div>
              
              <div className="relative z-10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
                      <TiaAvatar className="w-full h-full object-cover transform scale-125 translate-y-1" />
                  </div>
                  <div>
                      <h3 className="font-serif font-bold text-white text-base tracking-wide flex items-center gap-2">
                          TIA
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase tracking-wider">Beta</span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                          </span>
                          Online
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
             {/* Search - Dark Theme */}
             <div className="relative group mb-6 shrink-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all shadow-inner"
                />
             </div>

             <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pb-2">
                {savedChats.length === 0 ? (
                    <div className="text-center text-slate-600 text-xs py-10">
                        <p>No saved history yet.</p>
                        <p className="mt-1">Start a new chat to see it here.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 pl-2">Recent Chats</h3>
                        <div className="space-y-1">
                            {savedChats.map((chat) => (
                                <button 
                                    key={chat.id} 
                                    onClick={() => loadChat(chat)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium text-slate-400 hover:text-slate-100 flex items-center justify-between group"
                                >
                                    <span className="truncate pr-2">{chat.title}</span>
                                    <div 
                                        onClick={(e) => deleteChat(e, chat.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </div>
          
          {/* Bottom Action Area - Dark Theme - No Hyperlinks, just Buttons */}
          <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900">
             <button onClick={handleNewChat} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-brand-cyan hover:bg-brand-teal text-white shadow-lg shadow-brand-cyan/20 transition-all text-sm font-bold group">
                <Plus size={18} className="group-hover:scale-110 transition-transform" /> New Chat
             </button>
          </div>
        </div>

        {/* Main Content Area - Light Theme to match Popup Body */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F8FAFB]">
           {/* Top Navigation */}
           <div className="h-16 flex items-center justify-between px-8 shrink-0 z-10 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                 {/* Left side empty */}
              </div>
              <div className="flex items-center gap-4">
                 {/* Removed Three-dot menu and Profile Badge */}
                 
                 {/* Minimize Button */}
                 <button onClick={closeFullPage} className="p-2 hover:bg-gray-200/50 rounded-full text-gray-500 transition-colors" title="Minimize">
                   <Minimize2 size={20} />
                 </button>
              </div>
           </div>

           {/* Chat Content */}
           <div className="flex-1 overflow-y-auto px-4 md:px-32 pb-40 pt-10 scrollbar-thin scrollbar-thumb-gray-200">
              {/* Active Conversation (Includes Greeting) */}
              <div className="space-y-8 max-w-3xl mx-auto">
                 {messages.map((msg) => (
                   <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm overflow-hidden mt-2 ${
                         msg.role === 'user' ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-white'
                      }`}>
                         {msg.role === 'user' ? (
                             <span className="font-bold text-sm">JD</span>
                         ) : (
                             <TiaAvatar className="w-full h-full transform scale-110 translate-y-1" />
                         )}
                      </div>
                      
                      <div className={`flex-1 space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className="font-bold text-sm text-gray-400 mb-1">{msg.role === 'user' ? 'You' : 'TIA'}</div>
                          <div className={`inline-block text-left rounded-3xl px-8 py-5 shadow-sm text-[15px] leading-relaxed ${
                              msg.role === 'user' 
                              ? 'bg-[#F2F2F2] text-slate-800 rounded-tr-none' 
                              : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none w-full'
                          }`}>
                              {/* Render Markdown for Model, Plain text for User */}
                              {msg.role === 'model' ? (
                                  <div className="prose prose-sm max-w-none text-slate-700">
                                      <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        // @ts-ignore
                                        components={markdownComponents}
                                      >
                                          {msg.text}
                                      </ReactMarkdown>
                                  </div>
                              ) : (
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                              )}
                          </div>
                      </div>
                   </div>
                 ))}
                 
                 {/* Suggestions Grid - Show if only greeting is present */}
                 {messages.length === 1 && (
                    <div className="pt-8 animate-[fadeIn_0.5s_ease-out]">
                       <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-6 font-bold">Suggested Actions</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {[
                            { icon: ImageIcon, label: 'Analyze Pipeline Data', sub: 'Upload charts or tables' },
                            { icon: FileText, label: 'Summarize Trial', sub: 'Paste clinical trial ID' },
                            { icon: Clock, label: 'Recent Catalysts', sub: 'What happened this week?' },
                            { icon: Sparkles, label: 'Strategic Overview', sub: 'Generate competitor SWOT' }
                          ].map((card, i) => (
                            <button key={i} onClick={() => setInputValue(card.label + " ")} className="p-4 bg-white border border-[#EFE8E2] rounded-2xl shadow-sm hover:shadow-md hover:border-brand-cyan/30 text-left transition-all group">
                               <div className="flex items-center gap-3 mb-1">
                                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan transition-colors text-gray-500">
                                     <card.icon size={18} />
                                  </div>
                                  <span className="font-bold text-slate-800">{card.label}</span>
                               </div>
                               <p className="text-xs text-gray-400 pl-[44px]">{card.sub}</p>
                            </button>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Loading Indicator - only show if messages array hasn't updated yet with empty bot message */}
                 {isLoading && messages[messages.length - 1].role === 'user' && (
                    <div className="flex gap-6">
                       <div className="w-10 h-10 rounded-full flex-shrink-0 bg-white border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                           <TiaAvatar className="w-full h-full transform scale-110 translate-y-1" />
                       </div>
                       <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-none px-8 py-5 shadow-sm flex items-center gap-2">
                           <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></div>
                           <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                           <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                       </div>
                    </div>
                 )}
                 <div ref={messagesEndRef} />
              </div>
           </div>

           {/* Floating Input Area */}
           <div className="absolute bottom-8 left-0 right-0 px-4 md:px-0 pointer-events-none">
              <div className="max-w-3xl mx-auto pointer-events-auto">
                 {/* No border, no attachment icon */}
                 <div className="bg-white p-2 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-end gap-2 relative transition-all focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    
                    <input 
                       ref={fullPageInputRef}
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Ask anything..."
                       className="w-full bg-transparent border-none focus:ring-0 text-base text-slate-800 placeholder-slate-400 py-3.5 pl-6 max-h-32 resize-none"
                    />
                    
                    <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0 mr-1">
                       <Mic size={20} />
                    </button>
                    
                    <button 
                       onClick={handleSendMessage}
                       disabled={!inputValue.trim() || isLoading}
                       className="p-3.5 bg-gradient-to-r from-brand-cyan to-brand-teal text-white rounded-full shadow-lg shadow-brand-cyan/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                       {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} strokeWidth={3} />}
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    );
  }

  // --- WIDGET RENDER ---
  return (
    <div className="font-sans z-50">
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-8 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right z-50 ring-1 ring-black/5 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '600px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Modern Glassy Header */}
        <div className="bg-slate-900 p-4 pt-5 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
           {/* Abstract AI Background */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-cyan/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute -left-10 bottom-0 w-32 h-32 bg-brand-teal/20 rounded-full blur-3xl"></div>
           
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
                 <TiaAvatar className="w-full h-full object-cover transform scale-125 translate-y-1" />
              </div>
              <div>
                 <h3 className="font-serif font-bold text-base tracking-wide flex items-center gap-2">
                    TIA
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase tracking-wider">Beta</span>
                 </h3>
                 <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                    </span>
                    Online
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-1 relative z-10">
             <button 
               onClick={handleNewChat}
               className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
               title="New Chat"
             >
               <RefreshCcw size={16} />
             </button>
             {/* Expand Button replacing Close Button */}
             <button 
               onClick={openFullPage}
               className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
               title="Expand to Full Page"
             >
               <Maximize2 size={18} />
             </button>
           </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 scrollbar-thin scrollbar-thumb-gray-200">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm border overflow-hidden ${
                   msg.role === 'user' 
                     ? 'bg-slate-800 text-white border-slate-700' 
                     : 'bg-white text-brand-cyan border-gray-100'
                }`}>
                   {msg.role === 'user' ? (
                       <span className="font-bold">JD</span>
                   ) : (
                       <TiaAvatar className="w-full h-full object-cover transform scale-125 translate-y-0.5" />
                   )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed ${
                   msg.role === 'user' 
                     ? 'bg-slate-800 text-slate-50 rounded-tr-none' 
                     : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none w-full'
                }`}>
                   {msg.role === 'model' ? (
                        <div className="prose prose-sm max-w-none text-slate-700">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                // @ts-ignore
                                components={markdownComponents}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                   ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                   )}
                   <span className={`text-[10px] mt-1 block opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'text-slate-400 text-right' : 'text-gray-400'}`}>
                       {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                </div>
             </div>
           ))}
           
           {/* Loading Indicator - only if just sent and no AI response yet */}
           {isLoading && messages[messages.length - 1].role === 'user' && (
             <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 shadow-sm text-brand-cyan overflow-hidden">
                   <TiaAvatar className="w-full h-full object-cover transform scale-125 translate-y-0.5" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                   <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Modern Input Area - Border Removed */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
           {/* Removed border classes here */}
           <div className="relative flex items-end gap-2 bg-slate-50 rounded-2xl p-2 transition-all shadow-sm focus-within:bg-white focus-within:shadow-md">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about clinical trials..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 placeholder-slate-400 resize-none max-h-32 py-2.5 px-2 cursor-text"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="mb-1 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-brand-cyan disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 transition-all shadow-md hover:shadow-lg flex-shrink-0 group"
              >
                 {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                 ) : (
                    <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 )}
              </button>
           </div>
           
           {/* Added Cancel/Close Button */}
           <div className="flex justify-center mt-3">
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors px-4 py-1 rounded-full hover:bg-gray-50"
               >
                   <X size={10} /> Close
               </button>
           </div>
        </div>
      </div>

      {/* Enhanced Floating Action Button (FAB) - Opens Widget */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 group z-50 transition-all duration-300 ${isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="relative">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 bg-brand-cyan rounded-full opacity-20 animate-ping duration-[3000ms]"></div>
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-cyan to-brand-teal rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            
            {/* Main Button */}
            <div className="relative w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border border-white/10 group-hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full"></div>
               
               <div className="relative flex items-center justify-center w-full h-full p-2">
                  <TiaAvatar className="w-full h-full object-cover transform scale-110 translate-y-1" />
                  <Sparkles size={16} className="text-brand-cyan absolute -top-1 -left-1.5 z-10 fill-brand-cyan/20" />
               </div>
            </div>
        </div>
      </button>

      {/* Widget Close Button (Only visible in widget mode) - No Close Button as per user request to replace X with Expand. The FAB handles closing. */}
    </div>
  );
};