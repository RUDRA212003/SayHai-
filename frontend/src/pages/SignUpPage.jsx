import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import PrivacyModal from "../components/PrivacyModal"; // Import your Modal
import { Mail, Lock, Loader2, User, ShieldCheck, Check } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [isAgreed, setIsAgreed] = useState(false); // Checkbox state
  const [showPrivacy, setShowPrivacy] = useState(false); // Modal state
  
  const { signup, isSigningUp } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAgreed) return; // Prevent submission if not agreed
    signup(formData);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} transition-colors`}>
      <div className="relative w-full max-w-6xl md:h-[750px] h-auto">
        <BorderAnimatedContainer>
          <div className={`w-full h-full flex flex-col md:flex-row ${isDarkMode ? 'bg-zinc-900/50' : 'bg-white'} backdrop-blur-xl transition-colors`}>
            
            {/* LEFT SIDE: THE FORM */}
            <div className={`md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r ${isDarkMode ? 'border-zinc-800/50' : 'border-gray-200/50'}`}>
              <div className="w-full max-w-md">
                
                {/* BRAND HEADER */}
                <div className="text-center mb-10">
                  <div className="size-20 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="SayHi" 
                      className={`size-16 object-contain filter ${isDarkMode ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}
                    />
                  </div>
                  <h2 className={`text-3xl font-light tracking-tight mb-2 ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                    Create <span className={`font-semibold ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>Profile</span>
                  </h2>
                  <p className={`text-[10px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                    New Node Registration
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>Full Identity</label>
                    <div className="relative group">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isDarkMode ? 'text-zinc-600 group-focus-within:text-yellow-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full rounded-xl py-3.5 pl-12 pr-4 transition-all text-sm ${isDarkMode ? 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50' : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'}`}
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50 transition-all text-sm"
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-700 focus:border-yellow-500/50 transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* PRIVACY CHECKBOX SECTION */}
                  <div className="flex items-center gap-3 px-1">
                    <div 
                      className="relative flex items-center justify-center cursor-pointer"
                      onClick={() => setIsAgreed(!isAgreed)}
                    >
                      <div className={`size-5 rounded-md border-2 transition-all flex items-center justify-center ${
                        isAgreed ? 'bg-yellow-500 border-yellow-500' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                      }`}>
                        {isAgreed && <Check className="size-3.5 text-black font-bold" />}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                      I accept the{" "}
                      <button 
                        type="button"
                        onClick={() => setShowPrivacy(true)}
                        className="text-yellow-500 hover:underline decoration-yellow-500/50"
                      >
                        Privacy Policy & Protocol
                      </button>
                    </p>
                  </div>

                  <button 
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-400 disabled:opacity-20 disabled:grayscale shadow-[0_4px_20px_rgba(234,179,8,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    type="submit" 
                    disabled={isSigningUp || !isAgreed} // Disabled if not agreed
                  >
                    {isSigningUp ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Signup"
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

            {/* RIGHT SIDE: ILLUSTRATION */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 bg-zinc-900/30 overflow-hidden">
              <div className="relative w-full max-w-md">
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
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>

      {/* MODAL COMPONENT */}
      <PrivacyModal 
        isOpen={showPrivacy} 
        onClose={() => {
          setShowPrivacy(false);
          // Optional: automatically check the box after they close the modal
          // setIsAgreed(true); 
        }} 
      />
    </div>
  );
}

export default SignUpPage;