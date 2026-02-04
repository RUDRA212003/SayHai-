import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { isDarkMode } = useThemeStore();
  
  // Resizable state
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("resize", handleResize);
    };
  }, [resize, stopResizing]);

  return (
    <div className={`w-full h-screen flex overflow-hidden transition-colors ${isDarkMode ? 'bg-zinc-950' : 'bg-white'} ${isResizing ? "select-none cursor-col-resize" : ""}`}>
      
      {/* LEFT SIDEBAR */}
      <div 
        style={{ width: isMobile ? '100%' : `${sidebarWidth}px` }} 
        className={`${
          selectedUser ? "hidden md:flex" : "flex"
        } relative ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'} border-r flex flex-col shrink-0 overflow-hidden transition-all duration-300`}
      >
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>

        {/* DRAG HANDLE */}
        <div
          onMouseDown={startResizing}
          className={`hidden md:block absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 transition-colors group
            ${isDarkMode ? (isResizing ? "bg-yellow-500/50" : "hover:bg-yellow-500/20") : (isResizing ? "bg-blue-500/50" : "hover:bg-blue-500/20")}`}
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-8 rounded-full group-hover:h-12 transition-all ${isDarkMode ? 'bg-zinc-700 group-hover:bg-yellow-500' : 'bg-gray-300 group-hover:bg-blue-500'}`} />
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className={`${
        selectedUser ? "w-full md:flex-1" : "hidden md:flex md:flex-1"
      } flex flex-col ${isDarkMode ? 'bg-zinc-950/50' : 'bg-gray-100/50'} relative min-w-0`}>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;