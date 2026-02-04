import { Trash2, Reply } from "lucide-react";
import { useRef, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

function MessageContextMenu({ x, y, onDelete, onReply, onClose }) {
  const menuRef = useRef(null);
  const { isDarkMode } = useThemeStore();

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = () => onClose();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  // Dynamic positioning to prevent screen clipping
  const menuWidth = 160;
  const menuHeight = 110; // Adjusted for better padding
  const leftPos = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const topPos = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      ref={menuRef}
      className={`fixed rounded-xl z-[100] overflow-hidden min-w-[160px] animate-in fade-in zoom-in-95 duration-150 ${
        isDarkMode 
          ? 'bg-zinc-950 border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-white border border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
      }`}
      style={{
        top: `${topPos}px`,
        left: `${leftPos}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Reply Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReply();
          onClose();
        }}
        className={`w-full px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all text-left ${
          isDarkMode 
            ? 'text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-500/10'
        }`}
      >
        <Reply className="size-4 flex-shrink-0" />
        Reply
      </button>

      {/* Decorative Divider */}
      <div className={`h-[1px] bg-gradient-to-r from-transparent to-transparent ${
        isDarkMode ? 'via-zinc-800' : 'via-gray-300'
      }`} />

      {/* Delete Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className={`w-full px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all text-left ${
          isDarkMode 
            ? 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10' 
            : 'text-gray-600 hover:text-red-600 hover:bg-red-500/10'
        }`}
      >
        <Trash2 className="size-4 flex-shrink-0" />
        Delete
      </button>
      
      {/* Bottom Glow Accent */}
      <div className={`h-[2px] w-full ${isDarkMode ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`} />
    </div>
  );
}

export default MessageContextMenu;