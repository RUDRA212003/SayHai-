import { useState, useRef, useCallback } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Camera, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  
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
    <div className="p-5 border-b border-zinc-800 bg-zinc-950 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              className="size-14 rounded-full overflow-hidden relative ring-2 ring-zinc-800 group-hover:ring-yellow-500 transition-all duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                <Camera className="size-4 text-yellow-500 mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-yellow-500">Edit</span>
              </div>
            </button>
            <div className="absolute bottom-0 right-0 size-3.5 bg-yellow-500 border-2 border-zinc-950 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          <div className="min-w-0">
            <h3 className="text-zinc-100 font-bold text-sm tracking-tight truncate max-w-[120px]">{authUser.fullName}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
              <span className="size-1 bg-yellow-500 rounded-full animate-pulse" /> Verified
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          <button
            className={`p-2 rounded-lg transition-all ${isSoundEnabled ? "text-yellow-500 bg-yellow-500/10 border border-yellow-500/20" : "text-zinc-500 hover:text-zinc-300 bg-zinc-900 border border-zinc-800"}`}
            onClick={() => { toggleSound(); mouseClickSound.play().catch(() => {}); }}
          >
            {isSoundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
          </button>
          <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 transition-all" onClick={logout}>
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* --- CROP MODAL --- */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Adjust Profile Picture</h4>
              <button onClick={() => setImageToCrop(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="relative h-80 w-full bg-zinc-950">
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

            <div className="p-6 space-y-6 bg-zinc-900">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Zoom Level</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-yellow-500"
                />
              </div>

              <button
                onClick={handleUpload}
                className="w-full py-3 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
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