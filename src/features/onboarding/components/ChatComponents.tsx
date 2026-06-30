import { cn } from '@/lib';
import { Brain } from 'lucide-react';

export function ChatBubble({ message, role, animate }: { message: string, role: string, animate?: boolean }) {
  const isAssistant = role === 'assistant' || role === 'system';
  return (
    <div className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end", animate && "animate-in fade-in slide-in-from-bottom-2")}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-[#181C28]/80 border border-white/5 flex items-center justify-center shrink-0 shadow-sm mt-1">
          <Brain className="w-4 h-4 text-[#3B82F6]" />
        </div>
      )}
      <div className={cn("px-4 py-3 max-w-[85%] text-[15px] leading-relaxed shadow-sm", isAssistant ? "bg-[#1E293B]/60 text-[#E2E8F0] border border-white/5 rounded-2xl rounded-tl-sm backdrop-blur-md" : "bg-[#3B82F6] text-white rounded-2xl rounded-tr-sm shadow-[0_0_20px_rgba(59,130,246,0.2)]")}>
        {message}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-in fade-in">
      <div className="w-8 h-8 rounded-full bg-[#181C28]/80 border border-white/5 flex items-center justify-center shrink-0 shadow-sm mt-1">
        <Brain className="w-4 h-4 text-[#3B82F6]" />
      </div>
      <div className="px-5 py-4 bg-[#1E293B]/60 border border-white/5 rounded-2xl rounded-tl-sm backdrop-blur-md flex items-center gap-1.5 shadow-sm">
        <div className="w-1.5 h-1.5 bg-[#A8B3CF]/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-[#A8B3CF]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-[#A8B3CF]/60 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export function ChatSuggestion({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 text-[13px] font-medium text-[#A8B3CF] bg-[#1E293B]/40 hover:bg-[#1E293B]/80 hover:text-white border border-white/5 hover:border-white/10 rounded-full transition-all shadow-sm">
      {text}
    </button>
  );
}
