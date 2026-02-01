import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquarePlus } from "lucide-react"; 

function ContactList() {
  // Added unreadCounts to the store extraction
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-2 p-2">
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        
        // Retrieve the specific unread count for this contact
        const unreadCount = unreadCounts[contact._id] || 0;
        
        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className="group relative p-3 rounded-xl cursor-pointer transition-all duration-300 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/50 hover:border-yellow-500/30"
          >
            <div className="flex items-center gap-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className="size-12 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-yellow-500 transition-colors duration-300">
                  <img 
                    src={contact.profilePic || "/avatar.png"} 
                    alt={contact.fullName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {isOnline && (
                  <div className="absolute bottom-0 right-0 size-3 bg-yellow-500 border-2 border-zinc-950 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-zinc-100 font-bold truncate group-hover:text-yellow-500 transition-colors">
                  {contact.fullName}
                </h4>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 group-hover:text-zinc-400">
                  {isOnline ? (
                    <span className="text-yellow-500/80">Available</span>
                  ) : (
                    <span>Last seen recently</span>
                  )}
                </p>
              </div>

              {/* ACTION AREA: Badge or Icon */}
              <div className="flex items-center gap-3 pr-2">
                {/* UNREAD BADGE */}
                {unreadCount > 0 && (
                  <div className="size-5 flex items-center justify-center bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.4)] animate-in zoom-in duration-300">
                    <span className="text-[10px] font-black text-black">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </div>
                )}

                {/* Message Icon Hint */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-yellow-500">
                  <MessageSquarePlus className="size-5" />
                </div>
              </div>
            </div>

            {/* Subtle bottom glow effect on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-yellow-500 group-hover:w-2/3 transition-all duration-500" />
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;