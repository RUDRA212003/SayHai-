import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, Smile } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSoundEnabled, repliedMessage, clearRepliedMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 3000);
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    
    if (socket && selectedUser) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    if (isSoundEnabled) playRandomKeyStrokeSound();

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
      replyTo: repliedMessage?._id,
    });

    clearRepliedMessage();
    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`w-full border-t p-4 sticky bottom-0 z-50 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
      {showEmojiPicker && (
        <div 
          className="absolute bottom-20 left-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-bottom-2" 
          ref={pickerRef}
        >
          <EmojiPicker 
            theme={isDarkMode ? Theme.DARK : Theme.LIGHT} 
            onEmojiClick={onEmojiClick}
            width={300}
            height={400}
          />
        </div>
      )}

      {imagePreview && (
        <div className="mb-4 flex items-center gap-4 animate-in slide-in-from-bottom-2">
          <div className="relative group">
            <img src={imagePreview} alt="Preview" className={`size-20 object-cover rounded-xl border-2 shadow-lg ${isDarkMode ? 'border-yellow-500 shadow-yellow-500/10' : 'border-blue-500 shadow-blue-500/10'}`} />
            <button 
              onClick={() => setImagePreview(null)}
              className={`absolute -top-2 -right-2 size-6 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-900 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' : 'bg-gray-100 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
            >
              <XIcon className="size-3" />
            </button>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest italic ${isDarkMode ? 'text-yellow-500/50' : 'text-blue-500/50'}`}>Image attached</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          {/* EMOJI BUTTON WITH TOOLTIP */}
          <div className="relative group/tooltip">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2.5 rounded-xl transition-all ${showEmojiPicker ? (isDarkMode ? 'text-yellow-500 bg-yellow-500/10' : 'text-blue-600 bg-blue-500/10') : (isDarkMode ? 'text-zinc-500 hover:text-yellow-500' : 'text-gray-500 hover:text-blue-600')}`}
            >
              <Smile className="size-6" />
            </button>
            <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded border opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-[110] ${isDarkMode ? 'bg-zinc-800 text-yellow-500 border-zinc-700' : 'bg-gray-100 text-blue-600 border-gray-300'}`}>
              Emojis
            </span>
          </div>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          
          {/* IMAGE BUTTON WITH TOOLTIP */}
          <div className="relative group/tooltip">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2.5 rounded-xl transition-all ${imagePreview ? (isDarkMode ? 'text-yellow-500 bg-yellow-500/10' : 'text-blue-600 bg-blue-500/10') : (isDarkMode ? 'text-zinc-500 hover:text-yellow-500' : 'text-gray-500 hover:text-blue-600')}`}
            >
              <ImageIcon className="size-6" />
            </button>
            <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded border opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-[110] ${isDarkMode ? 'bg-zinc-800 text-yellow-500 border-zinc-700' : 'bg-gray-100 text-blue-600 border-gray-300'}`}>
              Insert Image
            </span>
          </div>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            className={`w-full rounded-xl py-3 px-5 focus:outline-none transition-all shadow-inner ${isDarkMode ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50'}`}
            placeholder="Type your message here.."
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`relative p-3 rounded-xl text-white disabled:opacity-20 disabled:grayscale transition-all active:scale-95 ${isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.2)]'}`}
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;