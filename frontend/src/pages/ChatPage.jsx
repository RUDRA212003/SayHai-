import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  
  // Resizable state
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);

  // Start Resizing
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  // Stop Resizing
  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Handle Mouse Move
  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        // Clamp width between 260px and 480px for best UX
        const newWidth = Math.min(Math.max(260, mouseMoveEvent.clientX), 480);
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className={`w-full h-screen bg-zinc-950 flex overflow-hidden ${isResizing ? "select-none cursor-col-resize" : ""}`}>
      
      {/* LEFT SIDEBAR - Hidden on mobile when chat is selected */}
      <div 
        style={{ width: `${sidebarWidth}px` }} 
        className={`${
          selectedUser ? "hidden md:flex" : "flex"
        } relative bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0`}
      >
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>

        {/* DRAG HANDLE (The Divider) - Only visible on desktop */}
        <div
          onMouseDown={startResizing}
          className={`hidden md:block absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 transition-colors group
            ${isResizing ? "bg-yellow-500/50" : "hover:bg-yellow-500/20"}`}
        >
          {/* Animated Glow Line on Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-8 bg-zinc-700 rounded-full group-hover:bg-yellow-500 group-hover:h-12 transition-all" />
        </div>
      </div>

      {/* MAIN CHAT AREA - Full screen on mobile when chat selected, side-by-side on desktop */}
      <div className={`${
        selectedUser ? "w-full" : "hidden md:flex md:flex-1"
      } flex flex-col bg-zinc-950/50 relative`}>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;