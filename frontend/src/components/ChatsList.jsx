import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

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

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
              isSelected
                ? "bg-yellow-500/10 border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                : "bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50"
            }`}
          >
            {/* Selection Accent Line */}
            {isSelected && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-yellow-500 rounded-r-full" />
            )}

            <div className="flex items-center gap-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className={`size-12 rounded-full p-[2px] transition-transform duration-300 ${
                  isSelected ? "bg-yellow-500 scale-105" : "bg-zinc-700"
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-950">
                    <img 
                      src={chat.profilePic || "/avatar.png"} 
                      alt={chat.fullName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                {isOnline && (
                  <div className="absolute bottom-0 right-0 size-3.5 bg-yellow-500 border-2 border-zinc-950 rounded-full shadow-sm" />
                )}
              </div>

              {/* Text Section */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className={`font-bold truncate transition-colors ${
                    isSelected ? "text-yellow-500" : "text-zinc-100"
                  }`}>
                    {chat.fullName}
                  </h4>
                </div>
                
                <p className={`text-xs truncate transition-colors ${
                  isSelected ? "text-yellow-500/70" : "text-zinc-500"
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
              
              {/* Hover Arrow (Subtle Detail) */}
              <div className={`transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                <div className="size-1.5 rounded-full bg-yellow-500" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;