import { XIcon, Phone, Video } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

// Helper function to format lastSeen timestamp into human-readable format
function formatLastSeen(lastSeenDate) {
  if (!lastSeenDate) return "Last seen recently";

  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffMs = now - lastSeen;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  // For dates older than 7 days, show the date
  return lastSeen.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: lastSeen.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function ChatHeader() {
  // Added isTyping to the store extraction
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
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
    <header className={`sticky top-0 z-20 backdrop-blur-md px-4 py-3 flex justify-between items-center shadow-lg border-b ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-gray-200'}`}>
      {/* Left Section: User Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Back Button for Mobile */}
        <button 
          onClick={() => setSelectedUser(null)}
          className={`md:hidden p-2 -ml-2 rounded-lg transition-all active:scale-95 ${isDarkMode ? 'text-zinc-400 hover:text-yellow-500 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200/50'}`}
          title="Back to chats"
        >
          <XIcon className="size-5" />
        </button>

        <div className="relative">
          <div className={`size-10 md:size-11 rounded-full ring-2 overflow-hidden border-2 border-transparent group-hover:transition-all ${isDarkMode ? 'ring-zinc-800 group-hover:border-yellow-500' : 'ring-gray-300 group-hover:border-blue-500'}`}>
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          {isOnline && (
            <span className={`absolute bottom-0 right-0 size-3 border-2 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.4)] ${isDarkMode ? 'bg-yellow-500 border-zinc-950' : 'bg-blue-500 border-white'}`} />
          )}
        </div>

        <div>
          <h3 className={`font-bold leading-tight tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
            {selectedUser.fullName}
          </h3>
          <div className="flex items-center gap-1.5 h-4"> {/* Fixed height prevents layout jump */}
              {isTyping ? (
                <div className="flex items-center gap-1">
                   {/* Animated Three-Dot typing indicator */}
                  <span className="flex gap-0.5">
                    <span className={`size-1 rounded-full animate-bounce [animation-delay:-0.3s] ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <span className={`size-1 rounded-full animate-bounce [animation-delay:-0.15s] ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <span className={`size-1 rounded-full animate-bounce ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  </span>
                  <span className={`text-[10px] uppercase tracking-tighter font-black animate-pulse ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>
                    Typing...
                  </span>
                </div>
              ) : (
                <>
                  <span className={`size-1.5 rounded-full ${isOnline ? (isDarkMode ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500 animate-pulse') : (isDarkMode ? 'bg-zinc-600' : 'bg-gray-500')}`} />
                  <span className={`text-[10px] uppercase tracking-widest font-black ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                    {isOnline ? "Encrypted / Online" : `Last seen ${formatLastSeen(selectedUser.lastSeen)}`}
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
          className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30' : 'bg-gray-100/50 border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-500/30'}`}
          title="Voice Call"
        >
          <Phone className="size-5" />
        </button>
        
        <button 
          onClick={() => handleUnderConstruction("Video Call")}
          className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30' : 'bg-gray-100/50 border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-500/30'}`}
          title="Video Call"
        >
          <Video className="size-5" />
        </button>

        <div className={`w-px h-6 mx-2 hidden sm:block ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-300'}`} />

        <button 
          onClick={() => setSelectedUser(null)}
          className={`hidden sm:flex p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/30' : 'bg-gray-100/50 border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-500/30'}`}
          title="Close Chat (Esc)"
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;