import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageContextMenu from "./MessageContextMenu";
import { X, Maximize2, Download, Smile } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    replyToMessage,
    repliedMessage,
    clearRepliedMessage,
    handleReaction,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const messageEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // Haptic Feedback Logic
  const triggerHaptic = (pattern = 60) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Trigger vibration for new incoming messages
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderId !== authUser._id) {
      triggerHaptic();
    }
  }, [messages, authUser._id]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setContextMenu(null);
        setSelectedImg(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleRightClick = (e, message) => {
    e.preventDefault();
    if (message.senderId === authUser._id) {
      setContextMenu({ x: e.clientX, y: e.clientY, message });
    }
  };

  const REACTION_OPTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

  return (
    <div className={`flex flex-col h-full min-h-0 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-gray-900'}`}>
      <div className="flex-none">
        <ChatHeader />
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto p-4 space-y-8 custom-scrollbar ${isDarkMode ? 'bg-[url(\'/grid.svg\')] bg-fixed' : 'bg-gray-50'}`}>
        {messages.length > 0 && !isMessagesLoading ? (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderId === authUser._id;
              const hasReactions = msg.reactions && msg.reactions.length > 0;

              return (
                <div 
                  key={msg._id} 
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} group/row relative mb-2`}
                  onMouseEnter={() => setHoveredMessage(msg._id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {/* REACTION TRAY - Visible on hover */}
                  {!isMe && hoveredMessage === msg._id && (
                    <div className={`absolute -top-8 left-0 flex gap-1 p-1 rounded-full shadow-2xl z-30 animate-in slide-in-from-bottom-2 duration-200 border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-300'}`}>
                      {REACTION_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            handleReaction(msg._id, emoji);
                            triggerHaptic(40); // Subtle tap on reacting
                          }}
                          className="hover:scale-125 transition-transform px-1.5 py-0.5 text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      onContextMenu={(e) => handleRightClick(e, msg)}
                      className={`relative max-w-[80%] md:max-w-md p-3 rounded-2xl transition-all group ${
                        isMe
                          ? isDarkMode
                            ? "bg-yellow-500 text-black rounded-tr-none shadow-[0_4px_20px_rgba(234,179,8,0.15)]"
                            : "bg-blue-600 text-white rounded-tr-none shadow-[0_4px_20px_rgba(37,99,235,0.15)]"
                          : isDarkMode
                            ? "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none shadow-xl"
                            : "bg-gray-200 border border-gray-300 text-gray-900 rounded-tl-none shadow-lg"
                      }`}
                    >
                      {msg.image && (
                        <div 
                          className="relative mb-2 rounded-lg overflow-hidden cursor-zoom-in group/img"
                          onClick={() => setSelectedImg(msg.image)}
                        >
                          <img src={msg.image} alt="Shared content" className="max-h-72 w-full object-cover transition-transform group-hover/img:scale-105" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <Maximize2 className="size-6 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {msg.text && <p className="text-sm font-medium leading-relaxed break-words">{msg.text}</p>}
                      
                      <div className={`flex items-center gap-1 mt-1 justify-end opacity-60 text-[10px] font-bold uppercase tracking-tighter ${isMe ? (isDarkMode ? 'text-black/80' : 'text-blue-700/80') : (isDarkMode ? 'text-zinc-500' : 'text-gray-600')}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {/* WHATSAPP STYLE REACTION BADGE - Floating on border */}
                      {hasReactions && (
                        <div className={`absolute -bottom-3 ${isMe ? "right-2" : "left-2"} flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-lg border z-20 scale-95 origin-center animate-in zoom-in-50 duration-200 ${
                          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                        }`}>
                          <div className="flex -space-x-1">
                            {msg.reactions.slice(0, 3).map((reaction, index) => (
                              <span key={index} className="text-xs drop-shadow-sm">{reaction.emoji}</span>
                            ))}
                          </div>
                          {msg.reactions.length > 1 && (
                            <span className={`text-[10px] font-bold ml-0.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                              {msg.reactions.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop Reaction Trigger */}
                    {hoveredMessage === msg._id && !isMe && (
                       <button 
                         onClick={() => handleReaction(msg._id, "❤️")}
                         className={`p-1 transition-colors ${isDarkMode ? 'text-zinc-600 hover:text-yellow-500' : 'text-gray-500 hover:text-blue-600'}`}
                       >
                         <Smile className="size-4" />
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Reply UI */}
      {repliedMessage && (
        <div className={`px-4 py-2 backdrop-blur-sm border-t ${isDarkMode ? 'bg-zinc-900/90 border-yellow-500/20' : 'bg-gray-50/90 border-blue-500/20'}`}>
          <div className={`flex items-center justify-between p-2 rounded-lg border-l-4 ${isDarkMode ? 'bg-zinc-800 border-yellow-500' : 'bg-gray-100 border-blue-600'}`}>
            <div className="truncate pr-4">
              <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>Replying to</span>
              <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{repliedMessage.text || "Image"}</p>
            </div>
            <button onClick={clearRepliedMessage} className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Overlay */}
      {selectedImg && (
        <div 
          className={`fixed inset-0 z-[999] backdrop-blur-md flex flex-col animate-in fade-in duration-300 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'}`}
          onClick={() => setSelectedImg(null)}
        >
          <div className="flex justify-between p-6">
            <button className={`size-10 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'}`}>
               <X className="size-6" />
            </button>
            <a 
              href={selectedImg} 
              download 
              onClick={(e) => e.stopPropagation()}
              className={`size-10 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <Download className="size-6" />
            </a>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={selectedImg} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <MessageInput />

      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => { deleteMessage(contextMenu.message._id); setContextMenu(null); }}
          onReply={() => { replyToMessage(contextMenu.message); setContextMenu(null); }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default ChatContainer;