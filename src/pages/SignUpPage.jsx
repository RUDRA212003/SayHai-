import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import PrivacyModal from "../components/PrivacyModal";
import { Mail, Lock, Loader2, User, ShieldCheck, Check, KeyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [isAgreed, setIsAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login({ email: formData.email, password: formData.password });
    } else {
      if (!isAgreed) return;
      signup(formData);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset agreement if switching to login
    if (isLogin) setIsAgreed(false);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} transition-colors duration-500`}>
      <div className="relative w-full max-w-6xl h-auto md:h-[750px]">
        <BorderAnimatedContainer>
          <div className={`w-full h-full flex flex-col md:flex-row ${isDarkMode ? 'bg-zinc-900/50' : 'bg-white'} backdrop-blur-xl overflow-hidden`}>
            
            {/* FORM SIDE */}
            <div className={`md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r ${isDarkMode ? 'border-zinc-800/50' : 'border-gray-200/50'}`}>
              <div className="w-full max-w-md">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="text-center mb-10">
                      <div className="size-20 mx-auto mb-6 flex items-center justify-center">
                        <img 
                          src="/logo.png" 
                          alt="SayHi" 
                          className={`size-16 object-contain filter ${isDarkMode ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}
                        />
                      </div>
                      <h2 className={`text-3xl font-light tracking-tight mb-2 ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                        {isLogin ? "Access" : "Create"}{" "}
                        <span className={`font-semibold ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>
                          {isLogin ? "Secure" : "Profile"}
                        </span>
                      </h2>
                      <p className={`text-[10px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                        {isLogin ? "Authentication Required" : "New User Registration"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Name</label>
                          <div className="relative group">
                            <User className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className={`w-full rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50'}`}
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50'}`}
                            placeholder="operator@sayhi.net"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Password</label>
                        <div className="relative group">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50'}`}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {!isLogin && (
                        <div className="flex items-center gap-3 px-1 py-2">
                          <div 
                            className="cursor-pointer"
                            onClick={() => setIsAgreed(!isAgreed)}
                          >
                            <div className={`size-5 rounded-md border-2 transition-all flex items-center justify-center ${
                              isAgreed ? 'bg-yellow-500 border-yellow-500' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                            }`}>
                              {isAgreed && <Check className="size-3.5 text-black font-bold" />}
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                            I accept the <button type="button" onClick={() => setShowPrivacy(true)} className="text-yellow-500 hover:underline">Privacy Protocol</button>
                          </p>
                        </div>
                      )}

                      <button 
                        className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg ${
                          isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50`}
                        type="submit" 
                        disabled={isLoggingIn || isSigningUp || (!isLogin && !isAgreed)}
                      >
                        {(isLoggingIn || isSigningUp) ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          isLogin ? "Login" : "Register Node"
                        )}
                      </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-3">
                      <button 
                        onClick={toggleMode}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-yellow-500 transition-colors"
                      >
                        {isLogin ? "No account? Create new profile" : "Existing User? Terminate to Login"}
                      </button>
                      
                      {isLogin && (
                        <button 
                          onClick={() => setShowPrivacy(true)}
                          className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-yellow-500/50 transition-all"
                        >
                          System Protocol / Privacy Policy
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ILLUSTRATION SIDE */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 bg-zinc-900/30 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login-img" : "signup-img"}
                  initial={{ opacity: 0, scale: 0.9, rotate: isLogin ? -2 : 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: isLogin ? 2 : -2 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full flex flex-col items-center"
                >
                  <div className={`absolute inset-0 blur-[120px] rounded-full ${isDarkMode ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`} />
                  <img
                    src={isLogin ? "/login.png" : "/signup.png"}
                    alt="Interface"
                    className="relative w-full max-w-sm h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                  
                  <div className="mt-12 text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full shadow-lg">
                      <ShieldCheck className="size-4 text-yellow-500" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        {isLogin ? "End-to-End Encrypted" : "Security Protocols Active"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}

export default AuthPage;