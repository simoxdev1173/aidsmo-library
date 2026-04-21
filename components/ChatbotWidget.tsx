'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuSparkles, LuX, LuMessageSquare, LuMic, LuSend } from 'react-icons/lu';
import Image from 'next/image';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  // Strongly typed ref for the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div dir="rtl" className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Adjusted transformOrigin to 'bottom right' to match the new position
            initial={{ opacity: 0, y: 20, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            // Changed left-0 to right-0
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] overflow-hidden rounded-[2rem] shadow-2xl bg-[#F0F7FC] flex flex-col"
            style={{ height: '550px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div
              className="relative px-6 py-5 flex items-center justify-between shadow-md z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(2,42,78,1) 0%, rgba(3,69,130,1) 100%)',
              }}
            >
              {/* Gold bottom border */}
              <div
                className="absolute inset-x-0 bottom-0 h-[2px]"
                style={{
                  background: 'linear-gradient(to right, transparent, #C29C41, #e8c96a, #C29C41, transparent)',
                }}
              />
              
              <div className="flex items-center gap-3">
                
                <div>
                  <h3 className="font-bold text-white text-sm">المساعد
                     الآلي </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {/* AI Welcome Message */}
              <motion.div
                initial={{ opacity: 0, x: 10 }} // Switched to positive x for RTL entry from right
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-[#022A4E] border border-[#C29C41]/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                  <Image src="/ai.png" alt="AI" width={24} height={24} className="object-contain" />
                </div>
                <div 
                  className="bg-white px-4 py-3 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed"
                  style={{ color: '#022A4E' }}
                >
                  أهلاً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟
                </div>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#0369A1]/10 rounded-b-[2rem]">
              <div 
                className="flex items-end gap-2 p-2 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: '#F0F7FC',
                  border: message.trim() ? '1px solid #C29C41' : '1px solid transparent' 
                }}
              >
                {/* Audio Button */}
                <button 
                  className="p-2.5 text-[#0369A1] hover:text-[#C29C41] hover:bg-[#0369A1]/5 rounded-xl transition-colors shrink-0"
                  aria-label="Voice Input"
                >
                  <LuMic size={20} />
                </button>

                {/* Multi-line Textarea */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm py-2.5 px-1 max-h-[120px]"
                  style={{ color: '#022A4E', minHeight: '44px' }}
                  rows={1}
                />

                {/* Send Button */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl shrink-0 transition-colors flex items-center justify-center"
                  style={{
                    backgroundColor: message.trim() ? '#C29C41' : '#e2e8f0',
                    color: message.trim() ? '#0a1628' : '#94a3b8',
                    cursor: message.trim() ? 'pointer' : 'default'
                  }}
                  aria-label="Send Message"
                >
                  <LuSend size={18} className="rtl:-scale-x-100" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #022A4E 0%, #034582 100%)',
          border: '2px solid #C29C41',
        }}
        aria-label="Toggle Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <LuX size={28} className="text-[#C29C41]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
               
                  <Image src="/ai.png" alt="AI" width={44} height={44} className="object-fill" />
                
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C29C41] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e8c96a]"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;