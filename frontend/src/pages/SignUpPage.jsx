import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Mail, Lock, Loader2, User, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950">
      <div className="relative w-full max-w-6xl md:h-[750px] h-auto">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row bg-zinc-900/50 backdrop-blur-xl">
            
            {/* LEFT SIDE: THE FORM */}
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r border-zinc-800/50">
              <div className="w-full max-w-md">
                
                {/* BRAND HEADER */}
                <div className="text-center mb-10">
                  <div className="size-20 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="SayHi" 
                      className="size-16 object-contain filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" 
                    />
                  </div>
                  <h2 className="text-3xl font-light tracking-tight text-zinc-100 mb-2">
                    Create <span className="text-yellow-500 font-semibold">Profile</span>
                  </h2>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-medium">
                    New Node Registration
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Full Identity</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Secure Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                        placeholder="operator@sayhi.net"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Access Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(234,179,8,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    type="submit" 
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Initialize Profile"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-yellow-500 transition-colors">
                    Existing User? Terminate to Login
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: FULL COLOR ILLUSTRATION */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 bg-zinc-900/30 overflow-hidden">
              <div className="relative w-full max-w-md">
                {/* Refined Backglow to match color image */}
                <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full" />
                
                <img
                  src="/signup.png"
                  alt="Join SayHi"
                  className="relative w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              
              <div className="mt-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full shadow-lg">
                  <ShieldCheck className="size-4 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Protocols Active</span>
                </div>
                
                <div className="flex justify-center gap-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-yellow-500/50 cursor-default">Encrypted</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-yellow-500/50 cursor-default">Private</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-yellow-500/50 cursor-default">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;