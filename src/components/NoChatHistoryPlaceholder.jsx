import { MessageSquarePlus } from "lucide-react";
import { useChatStore } from "../store/useChatStore"; // 1. Import the store

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, selectedUser } = useChatStore(); // 2. Extract sendMessage

  // 3. Helper function to handle the click
  const handleQuickSend = async (text) => {
    if (!selectedUser) return;
    await sendMessage({
      text: text,
      image: null,
      replyTo: null,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-zinc-950 animate-in fade-in duration-700">
      
      {/* LOGO CONTAINER */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-10 rounded-full" />
        <div className="relative size-24 md:size-32 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="App Logo" 
            className="size-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          />
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="max-w-sm">
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-2">
          Initialize Chat / <span className="text-yellow-500">{name}</span>
        </h3>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
          You are entering a secure channel. No prior history detected. 
          Use the quick links below to transmit your first message.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        <button 
          onClick={() => handleQuickSend("👋 Say Hello!")} // 4. Added onClick
          className="flex items-center justify-between px-5 py-3 text-xs font-black uppercase tracking-widest text-black bg-yellow-500 rounded-xl hover:bg-yellow-400 hover:scale-[1.02] transition-all shadow-[0_5px_15px_rgba(234,179,8,0.2)] active:scale-95"
        >
          👋 Say Hello
          <MessageSquarePlus className="size-4" />
        </button>

        <button 
          onClick={() => handleQuickSend("🤝 How are you?")} // Added onClick
          className="flex items-center justify-between px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-500 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-yellow-500/30 transition-all"
        >
          🤝 How are you?
        </button>

        <button 
          onClick={() => handleQuickSend("📅 Meet up soon?")} // Added onClick
          className="flex items-center justify-between px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-500 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-yellow-500/30 transition-all"
        >
          📅 Meet up soon?
        </button>

        <button 
          className="flex items-center justify-between px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl hover:text-zinc-300 hover:border-zinc-600 transition-all"
        >
          ⌨️ Type Manual
        </button>
      </div>

      {/* SYSTEM DECORATION */}
      <div className="mt-12 flex items-center gap-2 opacity-20">
        <div className="h-[1px] w-8 bg-yellow-500" />
        <span className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase">System Ready</span>
        <div className="h-[1px] w-8 bg-yellow-500" />
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;