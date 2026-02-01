import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import PrivacyModal from "./PrivacyModal";

const NoConversationPlaceholder = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-950 select-none relative overflow-hidden">
      
      {/* CENTRAL LOGO AREA */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] rounded-full" />
        
        <div className="relative size-32 md:size-40 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="SayHi" 
            className="size-full object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* MINIMALIST TEXT */}
      <div className="max-w-sm space-y-3">
        <h2 className="text-2xl font-black uppercase tracking-[0.25em] text-zinc-100">
          SayHai
        </h2>
        
        <div className="h-[1px] w-12 bg-yellow-500/50 mx-auto" />

        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose">
          Select a contact to begin <br /> 
          a secure conversation
        </p>
      </div>

      {/* SECURITY & PRIVACY STACK */}
      <div className="mt-16 flex flex-col items-center gap-4">
        {/* Shield Badge */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-900/30 border border-zinc-800/50 rounded-xl transition-colors hover:border-yellow-500/20">
          <ShieldCheck className="size-3.5 text-yellow-500" />
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">
            End-to-End Encrypted
          </span>
        </div>

        {/* Privacy Policy Trigger - Placed directly below */}
        <button 
          onClick={() => setShowPrivacy(true)}
          className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-yellow-500/50 transition-all duration-300"
        >
          // View Privacy Protocol
        </button>
      </div>

      {/* SYSTEM DECORATION (VERSION) */}
      <div className="absolute bottom-6 right-6 opacity-10">
        <div className="text-[10px] font-mono text-yellow-500 text-right uppercase">
          v1.0.0 // 2026<br />
          SAYHAI_STATION
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default NoConversationPlaceholder;