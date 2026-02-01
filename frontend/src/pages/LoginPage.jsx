import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import PrivacyModal from "../components/PrivacyModal"; // Import your new Modal
import { MailIcon, LoaderIcon, LockIcon, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPrivacy, setShowPrivacy] = useState(false); // State to control modal
  const { login, isLoggingIn } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} transition-colors`}>
      <div className="relative w-full max-w-6xl md:h-[700px] h-auto">
        <BorderAnimatedContainer>
          <div className={`w-full h-full flex flex-col md:flex-row ${isDarkMode ? 'bg-zinc-900/50' : 'bg-white'} backdrop-blur-xl transition-colors`}>
            
            {/* FORM COLUMN - LEFT SIDE */}
            <div className={`md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r ${isDarkMode ? 'border-zinc-800/50' : 'border-gray-200/50'}`}>
              <div className="w-full max-w-md">
                <div className="text-center mb-10">
                  <div className="size-20 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="SayHi" 
                      className={`size-16 object-contain filter ${isDarkMode ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}
                    />
                  </div>

                  <h2 className={`text-3xl font-light tracking-tight mb-2 ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                    Access <span className={`font-semibold ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>Secure</span>
                  </h2>
                  
                  <p className={`text-[10px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                    Authentication Required
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>Email Address</label>
                    <div className="relative group">
                      <MailIcon className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full rounded-xl py-3.5 pl-12 pr-4 placeholder-opacity-70 focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'}`}
                        placeholder="operator@sayhi.net"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>Password</label>
                    <div className="relative group">
                      <LockIcon className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full rounded-xl py-3.5 pl-12 pr-4 placeholder-opacity-70 focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_4px_20px_rgba(234,179,8,0.2)]' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.2)]'}`}
                    type="submit" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="size-5 animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center flex flex-col gap-2">
                  <Link to="/signup" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-yellow-500 transition-colors">
                    No account? Create new profile
                  </Link>
                  
                  {/* Privacy Policy Trigger */}
                  <button 
                    onClick={() => setShowPrivacy(true)}
                    className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-yellow-500/50 transition-all"
                  >
                    System Protocol / Privacy Policy
                  </button>
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

      {/* Global Privacy Modal */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}

export default LoginPage;