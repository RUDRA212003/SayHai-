import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquarePlus } from "lucide-react"; 

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  // Defensive check to ensure allContacts is an array before mapping
  if (!Array.isArray(allContacts)) {
    return (
      <div className={`space-y-2 p-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
        <p className="text-center py-4">No contacts available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {allContacts.length === 0 ? (
        <p className={`text-center py-4 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>No contacts found</p>
      ) : (
        allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        
        // Retrieve the specific unread count for this contact
        const unreadCount = unreadCounts[contact._id] || 0;
        
        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/50 hover:border-yellow-500/30' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300/50 hover:border-blue-500/30'}`}
          >
            <div className="flex items-center gap-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className={`size-12 rounded-full overflow-hidden border-2 transition-colors duration-300 ${isDarkMode ? 'border-zinc-700 group-hover:border-yellow-500' : 'border-gray-300 group-hover:border-blue-500'}`}>
                  <img 
                    src={contact.profilePic || "/avatar.png"} 
                    alt={contact.fullName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {isOnline && (
                  <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 shadow-[0_0_8px] ${isDarkMode ? 'bg-yellow-500 border-zinc-950 shadow-yellow-500/50' : 'bg-blue-500 border-white shadow-blue-500/50'}`} />
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold truncate transition-colors ${isDarkMode ? 'text-zinc-100 group-hover:text-yellow-500' : 'text-gray-900 group-hover:text-blue-600'}`}>
                  {contact.fullName}
                </h4>
                <p className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-gray-600 group-hover:text-gray-500'}`}>
                  {isOnline ? (
                    <span className={isDarkMode ? "text-yellow-500/80" : "text-blue-600/80"}>Available</span>
                  ) : (
                    <span>Last seen recently</span>
                  )}
                </p>
              </div>

              {/* ACTION AREA: Badge or Icon */}
              <div className="flex items-center gap-3 pr-2">
                {/* UNREAD BADGE */}
                {unreadCount > 0 && (
                  <div className={`size-5 flex items-center justify-center rounded-full shadow-[0_0_10px] animate-in zoom-in duration-300 ${isDarkMode ? 'bg-yellow-500 shadow-yellow-500/40' : 'bg-blue-500 shadow-blue-500/40'}`}>
                    <span className={`text-[10px] font-black ${isDarkMode ? 'text-black' : 'text-white'}`}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </div>
                )}

                {/* Message Icon Hint */}
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>
                  <MessageSquarePlus className="size-5" />
                </div>
              </div>
            </div>

            {/* Subtle bottom glow effect on hover */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] group-hover:w-2/3 transition-all duration-500 ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} />
          </div>
        );
      })
      )}
    </div>
  );
}

export default ContactList;