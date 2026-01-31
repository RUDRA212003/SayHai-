import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
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

  const { sendMessage, isSoundEnabled, repliedMessage, clearRepliedMessage } = useChatStore();

  // Handle clicking outside to close picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    
    if (isSoundEnabled) playRandomKeyStrokeSound();

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
      replyTo: repliedMessage?._id,
    });

    // Reset UI
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
    <div className="w-full bg-zinc-950 border-t border-zinc-800 p-4 relative z-30">
      
      {/* Emoji Picker Wrapper */}
      {showEmojiPicker && (
        <div 
          className="absolute bottom-20 left-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-bottom-2" 
          ref={pickerRef}
        >
          <EmojiPicker 
            theme={Theme.DARK} 
            onEmojiClick={onEmojiClick}
            width={300}
            height={400}
          />
        </div>
      )}

      {/* Image Preview Area */}
      {imagePreview && (
        <div className="mb-4 flex items-center gap-4 animate-in slide-in-from-bottom-2">
          <div className="relative group">
            <img src={imagePreview} alt="Preview" className="size-20 object-cover rounded-xl border-2 border-yellow-500 shadow-lg shadow-yellow-500/10" />
            <button 
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-zinc-900 border border-yellow-500 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
            >
              <XIcon className="size-3" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-yellow-500/50 uppercase tracking-widest italic">Image attached</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2.5 rounded-xl transition-all ${showEmojiPicker ? "text-yellow-500 bg-yellow-500/10" : "text-zinc-500 hover:text-yellow-500"}`}
          >
            <Smile className="size-6" />
          </button>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl transition-all ${imagePreview ? "text-yellow-500 bg-yellow-500/10" : "text-zinc-500 hover:text-yellow-500"}`}
          >
            <ImageIcon className="size-6" />
          </button>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500/50 transition-all shadow-inner"
            placeholder="Secure transmission..."
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="relative p-3 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] active:scale-95"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;