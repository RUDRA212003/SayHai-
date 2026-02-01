import { X } from "lucide-react";
import { PRIVACY_POLICY } from "../constants/policyData";

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl max-h-[80vh] rounded-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {/* Header */}
<div className="p-6 border-b border-zinc-800 flex items-center justify-between">
  <div className="flex items-center gap-4">
    {/* LOGO - Added from public/fav.png */}
    <div className="size-10 flex-shrink-0">
      <img 
        src="/fav.png" 
        alt="SayHi Logo" 
        className="size-full object-contain drop-shadow-[0_0_5px_rgba(234,179,8,0.4)]"
      />
    </div>

    {/* TEXT CONTENT */}
    <div>
      <h2 className="text-xl font-black uppercase tracking-tighter text-yellow-500 leading-none">
        {PRIVACY_POLICY.title}
      </h2>
      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
        Last Updated: {PRIVACY_POLICY.lastUpdated}
      </p>
    </div>
  </div>

  {/* CLOSE BUTTON */}
  <button 
    onClick={onClose} 
    className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 transition-colors"
  >
    <X className="size-6" />
  </button>
</div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {PRIVACY_POLICY.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-zinc-100 font-bold mb-2 uppercase text-sm tracking-wide">{section.heading}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-yellow-500 text-black font-black uppercase text-xs rounded-lg hover:bg-yellow-400 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;