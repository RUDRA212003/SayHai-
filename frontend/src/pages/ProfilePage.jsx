import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router";
import Cropper from "react-easy-crop";

import ProfileHeader from "../components/ProfileHeader";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

function ProfilePage() {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { authUser, updateProfile } = useAuthStore();

  // ---- Name & Password ----
  const [fullName, setFullName] = useState(authUser.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ---- Image Crop ----
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageToCrop(reader.result);
  };

  const handleImageUpload = async () => {
    const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
    await updateProfile({ profilePic: croppedImage });
    setImageToCrop(null);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const payload = { fullName };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    await updateProfile(payload);

    setCurrentPassword("");
    setNewPassword("");
    setIsSaving(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-white text-gray-900"
      }`}
    >
      {/* ---- TOP BAR ---- */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest">
          Edit Profile
        </h2>
      </div>

      {/* ---- PROFILE HEADER ---- */}
      <ProfileHeader />

      {/* ---- PROFILE CONTENT ---- */}
      <div className="max-w-xl mx-auto p-6 space-y-8">
        {/* ---- PROFILE PIC ---- */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={authUser.profilePic || "/avatar.png"}
            className="size-24 rounded-full object-cover ring-2 ring-zinc-800"
            alt="Profile"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest
              ${
                isDarkMode
                  ? "bg-zinc-900 border border-zinc-800 hover:border-yellow-500"
                  : "bg-gray-100 border border-gray-300 hover:border-blue-500"
              }
            `}
          >
            <Camera className="size-4" />
            Change Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ---- NAME ---- */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest opacity-60">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border outline-none
              ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-yellow-500"
                  : "bg-gray-100 border-gray-300 focus:border-blue-500"
              }
            `}
          />
        </div>

        {/* ---- PASSWORD ---- */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-60">
            Change Password
          </p>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border outline-none
              ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-yellow-500"
                  : "bg-gray-100 border-gray-300 focus:border-blue-500"
              }
            `}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border outline-none
              ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-yellow-500"
                  : "bg-gray-100 border-gray-300 focus:border-blue-500"
              }
            `}
          />
        </div>

        {/* ---- SAVE ---- */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs
            ${
              isSaving
                ? "opacity-50"
                : isDarkMode
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }
          `}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ---- CROP MODAL ---- */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-xl w-full max-w-md overflow-hidden">
            <div className="h-80 relative">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4 space-y-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full accent-yellow-500"
              />

              <button
                onClick={handleImageUpload}
                className="w-full py-3 bg-yellow-500 text-black rounded-xl font-black uppercase"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

// ---- IMAGE CROP HELPER ----
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
