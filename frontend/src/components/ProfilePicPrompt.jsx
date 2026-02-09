import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useState } from "react";
import { useNavigate } from "react-router";


function ProfilePicPrompt() {
  const { needsProfileUpdate } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();


  const [dismissed, setDismissed] = useState(
    sessionStorage.getItem("profilePicPromptDismissed")==="true"
  );

  if (!needsProfileUpdate || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("profilePicPromptDismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`w-[90%] max-w-sm p-6 rounded-2xl border text-center transition-colors
        ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-gray-200 text-gray-900"}`}
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-yellow-500/20 animate-pulse">
            <Camera className="size-8 text-yellow-500" />
          </div>
        </div>

        <h2 className="text-sm font-black uppercase tracking-widest mb-2">
          Update Profile Picture
        </h2>

        <p className="text-xs opacity-70 mb-6">
          Please upload a profile picture to complete your account.
        </p>

        <button
  onClick={() => {
    handleDismiss();
    navigate("/profile");
  }}
  className="w-full py-3 rounded-xl bg-yellow-500 text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
>
  Upload Now
</button>

      </div>
    </div>
  );
}

export default ProfilePicPrompt;
