import { useState, useRef, useCallback } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Camera, X, Check, Moon, Sun } from "lucide-react";
import Cropper from "react-easy-crop";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { useNavigate } from "react-router";


const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile, needsProfileUpdate } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  
  // States for Image & Cropping
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((_ , pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageToCrop(reader.result);
    }
  };

  const handleUpload = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      await updateProfile({ profilePic: croppedImage });
      setImageToCrop(null); // Close modal
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`p-5 border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-white'} relative transition-colors`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {needsProfileUpdate && (
  <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 animate-ping" />
)}

            <button
              className={`size-14 rounded-full overflow-hidden relative ring-2 ${isDarkMode ? 'ring-zinc-800 group-hover:ring-yellow-500' : 'ring-gray-200 group-hover:ring-blue-500'} transition-all duration-300`}
             onClick={() => navigate("/profile")}
            >
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
              />
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-gray-900/60'} opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300`}>
                <Camera className={`size-4 ${isDarkMode ? 'text-yellow-500' : 'text-blue-400'} mb-0.5`} />
                <span className={`text-[8px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-yellow-500' : 'text-blue-400'}`}>Profile</span>
              </div>
            </button>
            <div className={`absolute bottom-0 right-0 size-3.5 ${isDarkMode ? 'bg-yellow-500 border-zinc-950' : 'bg-blue-500 border-white'} border-2 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]`} />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          <div className="min-w-0">
            <h3 className={`font-bold text-sm tracking-tight truncate max-w-[120px] ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>{authUser.fullName}</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
              <span className={`size-1 rounded-full animate-pulse ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`} /> Verified
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          <button
            className={`p-2 rounded-lg transition-all ${isDarkMode ? (isSoundEnabled ? "text-yellow-500 bg-yellow-500/10 border border-yellow-500/20" : "text-zinc-500 hover:text-zinc-300 bg-zinc-900 border border-zinc-800") : (isSoundEnabled ? "text-blue-500 bg-blue-500/10 border border-blue-500/20" : "text-gray-500 hover:text-gray-700 bg-gray-100 border border-gray-300")}`}
            onClick={() => { toggleSound(); mouseClickSound.play().catch(() => {}); }}
            title="Toggle Sound"
          >
            {isSoundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
          </button>

          <button
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-yellow-500 hover:border-yellow-500/30' : 'bg-gray-100 border border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-500/30'}`}
            onClick={() => toggleTheme()}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500' : 'bg-gray-100 border border-gray-300 text-gray-500 hover:text-red-500'}`} onClick={logout} title="Logout">
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* --- CROP MODAL --- */}
      {imageToCrop && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDarkMode ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-md p-4`}>
          <div className={`relative w-full max-w-md ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'} border rounded-2xl overflow-hidden shadow-2xl`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-gray-100'} flex justify-between items-center`}>
              <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>Adjust Profile Picture</h4>
              <button onClick={() => setImageToCrop(null)} className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <X className="size-5" />
              </button>
            </div>

            <div className={`relative h-80 w-full ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-100'}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
              <div className="space-y-2">
                <label className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-gray-600'}`}>Zoom Level</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className={`w-full ${isDarkMode ? 'accent-yellow-500' : 'accent-blue-500'}`}
                />
              </div>

              <button
                onClick={handleUpload}
                className={`w-full py-3 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                <Check className="size-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to process the crop (standard Canvas approach)
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
}

export default ProfileHeader;