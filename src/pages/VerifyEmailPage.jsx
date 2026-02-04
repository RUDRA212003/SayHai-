import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { verifyEmail, isVerifying } = useAuthStore();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      const success = await verifyEmail(token);
      if (success) {
        setStatus("success");
        // Automatically redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus("error");
      }
    };

    handleVerification();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-xl">
        
        {/* ICON SECTION */}
        <div className="mb-6 flex justify-center">
          {status === "verifying" && <Loader2 className="size-16 text-yellow-500 animate-spin" />}
          {status === "success" && <CheckCircle2 className="size-16 text-green-500 animate-in zoom-in" />}
          {status === "error" && <XCircle className="size-16 text-red-500 animate-in zoom-in" />}
        </div>

        {/* TEXT SECTION */}
        <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-2">
          {status === "verifying" && "Authorizing Node..."}
          {status === "success" && "Identity Verified"}
          {status === "error" && "Protocol Failed"}
        </h2>

        <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
          {status === "verifying" && "Checking security tokens against the SayHi network database."}
          {status === "success" && "Your secure channel is now active. Redirecting to login terminal..."}
          {status === "error" && "The verification link is invalid or has expired. Please request a new one."}
        </p>

        {/* ACTION BUTTON (Only on Error) */}
        {status === "error" && (
          <Link 
            to="/signup" 
            className="inline-block px-8 py-3 bg-yellow-500 text-black font-black uppercase text-xs rounded-xl hover:bg-yellow-400 transition-all active:scale-95"
          >
            Return to Signup
          </Link>
        )}

        {/* SYSTEM DECORATION */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
          <ShieldCheck className="size-4 text-yellow-500" />
          <span className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase">Secure Protocol v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;