import { Loader2, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

function PageLoader() {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // Show the professional "slow" message after 3 seconds
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
      {/* Animated Chat Icon & Spinner Wrapper */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping" />
        
        {/* Background bubble shape */}
        <div className="relative bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
          <MessageSquare className="size-12 text-yellow-500 fill-yellow-500/10" />
          
          {/* Overlay spinner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="size-6 text-yellow-400 animate-spin" />
          </div>
        </div>
      </div>

      {/* Primary Loading Text */}
      <h2 className="text-lg font-semibold tracking-wider uppercase text-zinc-300 mb-2">
        Initializing Secure Session
      </h2>

      {/* Delayed Status Message */}
      <div className={`transition-all duration-700 transform ${
        showSlowMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="max-w-xs text-center px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <p className="text-xs text-zinc-500 leading-relaxed italic">
            "Connecting to our community node. We're on a free-tier server, so wake-up might take a moment. Thanks for your patience!"
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;