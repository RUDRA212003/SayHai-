import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { 
    getMyChatPartners, 
    chats, 
    isUsersLoading, 
    setSelectedUser, 
    selectedUser, 
    unreadCounts 
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-2 p-2">
      {chats.map((chat) => {
        const isSelected = selectedUser?._id === chat._id;
        const isOnline = onlineUsers.includes(chat._id);
        
        // Retrieve the specific count for this chat
        const unreadCount = unreadCounts[chat._id] || 0;

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
              isSelected
                ? isDarkMode ? "bg-yellow-500/10 border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "bg-blue-500/10 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : isDarkMode ? "bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50" : "bg-gray-100 hover:bg-gray-200 border border-gray-300/50"
            }`}
          >
            {/* Selection Accent Line */}
            {isSelected && (
              <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
            )}

            <div className="flex items-center gap-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className={`size-12 rounded-full p-[2px] transition-transform duration-300 ${
                  isSelected ? isDarkMode ? "bg-yellow-500 scale-105" : "bg-blue-500 scale-105" : isDarkMode ? "bg-zinc-700" : "bg-gray-300"
                }`}>
                  <div className={`w-full h-full rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-zinc-950' : 'border-white'}`}>
                    <img 
                      src={chat.profilePic || "/avatar.png"} 
                      alt={chat.fullName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                {isOnline && (
                  <div className={`absolute bottom-0 right-0 size-3.5 rounded-full shadow-sm border-2 ${isDarkMode ? 'bg-yellow-500 border-zinc-950' : 'bg-blue-500 border-white'}`} />
                )}
              </div>

              {/* Text Section */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className={`font-bold truncate transition-colors ${
                    isSelected ? isDarkMode ? "text-yellow-500" : "text-blue-600" : isDarkMode ? "text-zinc-100" : "text-gray-900"
                  }`}>
                    {chat.fullName}
                  </h4>
                </div>
                
                <p className={`text-xs truncate transition-colors ${
                  isSelected ? isDarkMode ? "text-yellow-500/70" : "text-blue-600/70" : isDarkMode ? "text-zinc-500" : "text-gray-600"
                }`}>
                  {isOnline ? (
                    <span className="flex items-center gap-1 italic">
                      Active
                    </span>
                  ) : (
                    "Away"
                  )}
                </p>
              </div>
              
              {/* WHATSAPP STYLE NOTIFICATION BADGE */}
              <div className="flex flex-col items-end gap-1">
                {unreadCount > 0 && !isSelected && (
                  <div className={`size-5 flex items-center justify-center rounded-full shadow-[0_0_10px] animate-in zoom-in duration-300 ${isDarkMode ? 'bg-yellow-500 shadow-yellow-500/40' : 'bg-blue-500 shadow-blue-500/40'}`}>
                    <span className={`text-[10px] font-black ${isDarkMode ? 'text-black' : 'text-white'}`}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </div>
                )}

                {/* Status Dot / Hover Arrow */}
                <div className={`transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                  <div className={`size-1.5 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;