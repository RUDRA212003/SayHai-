import { Trash2, Reply } from "lucide-react";
import { useRef } from "react";

function MessageContextMenu({ x, y, onDelete, onReply, onClose }) {
  const menuRef = useRef(null);

  // Dynamic positioning to prevent screen clipping
  const menuWidth = 160;
  const menuHeight = 90;
  const leftPos = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const topPos = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      ref={menuRef}
      className="fixed bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[100] overflow-hidden min-w-[160px] animate-in fade-in zoom-in-95 duration-150"
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
        className="w-full px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-3 transition-all text-left"
      >
        <Reply className="size-4 flex-shrink-0" />
        Reply
      </button>

      {/* Decorative Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Delete Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-all text-left"
      >
        <Trash2 className="size-4 flex-shrink-0" />
        Delete
      </button>
      
      {/* Bottom Glow Accent */}
      <div className="h-[2px] w-full bg-yellow-500/20" />
    </div>
  );
}

export default MessageContextMenu;