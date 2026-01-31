import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MailIcon, LoaderIcon, LockIcon, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950">
      <div className="relative w-full max-w-6xl md:h-[700px] h-auto">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row bg-zinc-900/50 backdrop-blur-xl">
            
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r border-zinc-800/50">
              <div className="w-full max-w-md">
                {/* BRAND LOGO & HEADING */}
                <div className="text-center mb-10">
  {/* LOGO - Floating & Minimalist */}
  <div className="size-20 mx-auto mb-6 flex items-center justify-center">
    <img 
      src="/logo.png" 
      alt="SayHi" 
      className="size-16 object-contain filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" 
    />
  </div>

  {/* TEXT - High Contrast & Clean */}
  <h2 className="text-3xl font-light tracking-tight text-zinc-100 mb-2">
    Access <span className="text-yellow-500 font-semibold">Secure</span>
  </h2>
  
  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-medium">
    Authentication Required
  </p>
</div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Email Address</label>
                    <div className="relative group">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                        placeholder="operator@sayhi.net"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Password</label>
                    <div className="relative group">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(234,179,8,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    type="submit" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="size-5 animate-spin" />
                    ) : (
                      "Authorize Access"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link to="/signup" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-yellow-500 transition-colors">
                    No account? Create new profile
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION SIDE */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 bg-zinc-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] rounded-full" />
                <img
                  src="/login.png"
                  alt="SayHi Interface"
                  className="relative w-full max-w-md h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                />
              </div>
              
              <div className="mt-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full">
                  <ShieldCheck className="size-4 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">End-to-End Encrypted</span>
                </div>
                
                <div className="flex justify-center gap-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Secure Protocol</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Zero-Knowledge</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Distributed</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;