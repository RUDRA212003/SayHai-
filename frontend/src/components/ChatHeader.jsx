import { XIcon, Phone, Video } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  // Added isTyping to the store extraction
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  const handleUnderConstruction = (feature) => {
    alert(`${feature} feature is currently under development. Stay tuned! 🚀`);
  };

  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex justify-between items-center shadow-lg">
      {/* Left Section: User Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Back Button for Mobile */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-yellow-500 hover:bg-zinc-800/50 rounded-lg transition-all active:scale-95"
          title="Back to chats"
        >
          <XIcon className="size-5" />
        </button>

        <div className="relative">
          <div className="size-10 md:size-11 rounded-full ring-2 ring-zinc-800 overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-all">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-3 bg-yellow-500 border-2 border-zinc-950 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
          )}
        </div>

        <div>
          <h3 className="text-zinc-100 font-bold leading-tight tracking-tight">
            {selectedUser.fullName}
          </h3>
          <div className="flex items-center gap-1.5 h-4"> {/* Fixed height prevents layout jump */}
              {isTyping ? (
                <div className="flex items-center gap-1">
                   {/* Animated Three-Dot typing indicator */}
                  <span className="flex gap-0.5">
                    <span className="size-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1 bg-yellow-500 rounded-full animate-bounce" />
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter font-black text-yellow-500 animate-pulse">
                    Typing...
                  </span>
                </div>
              ) : (
                <>
                  <span className={`size-1.5 rounded-full ${isOnline ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-600'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
                    {isOnline ? "Encrypted / Online" : "Last seen recently"}
                  </span>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <button 
          onClick={() => handleUnderConstruction("Voice Call")}
          className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
          title="Voice Call"
        >
          <Phone className="size-5" />
        </button>
        
        <button 
          onClick={() => handleUnderConstruction("Video Call")}
          className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
          title="Video Call"
        >
          <Video className="size-5" />
        </button>

        <div className="w-px h-6 bg-zinc-800 mx-2 hidden sm:block" />

        <button 
          onClick={() => setSelectedUser(null)}
          className="hidden sm:flex p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-all"
          title="Close Chat (Esc)"
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;