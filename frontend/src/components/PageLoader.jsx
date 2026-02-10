import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck, Lock, Zap, Wifi, Battery, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Assuming your backend check logic is similar to your PageLoader
const HEALTH_URL = import.meta.env.VITE_API_URL + "/health";

export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing");

  // 1. Smooth Fake Progress (0 -> 90)
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 5;
      if (value >= 90) {
        value = 90;
        clearInterval(interval);
      }
      setProgress(Math.floor(value));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 2. Real Backend Wake-up Check
  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetch(HEALTH_URL, { credentials: "include" });
        setProgress(100);
        setStatus("Session Ready");
      } catch {
        setStatus("Waking Server");
      }
    };
    const poll = setInterval(checkServer, 2500);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <MessageCircle className="h-6 w-6 text-yellow-400" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">SayHai</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              <ShieldCheck className="h-3 w-3" />
              {status}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              PRIVATE <br />
              <span className="text-yellow-400">MESSAGING.</span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed mb-10">
              Your conversations are protected by end-to-end encryption. 
              Waiting for secure handshake...
            </p>

            {/* ACTION BUTTON WITH LIVE PROGRESS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                disabled={progress < 100}
                className={`relative flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all overflow-hidden ${
                  progress < 100 
                  ? "bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed" 
                  : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                }`}
              >
                {/* Visual Progress Fill inside the button background */}
                {progress < 100 && (
                   <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-yellow-500/10 z-0"
                    animate={{ width: `${progress}%` }}
                   />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  {progress < 100 ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                      SECURE SESSION: {progress}%
                    </>
                  ) : (
                    "ENTER SYSTEM"
                  )}
                </span>
              </button>
            </div>
          </motion.div>

          {/* PHONE VIEW WITH INTERNAL LOADING */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full" />
            
            <motion.div 
              className="relative w-[300px] h-[600px] bg-zinc-950 border-[12px] border-zinc-900 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col ring-1 ring-zinc-800"
            >
              {/* Internal Phone Status */}
              <div className="px-8 pt-6 pb-2 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3 w-3" />
                </div>
              </div>

              {/* Progress Bar inside Phone Screen */}
              <div className="px-6 py-4">
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-yellow-400"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4">
                <div className="h-8 w-24 bg-zinc-900 rounded-lg border border-zinc-800" />
                <div className={`p-3 rounded-2xl rounded-tl-none text-[10px] border transition-colors ${progress > 50 ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-transparent border-dashed border-zinc-800 text-zinc-600'}`}>
                  {progress > 50 ? "Handshake successful." : "Waiting for peer..."}
                </div>
                {progress === 100 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-2xl rounded-tr-none text-[10px] text-yellow-400 font-bold"
                  >
                    Encrypted tunnel active.
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}