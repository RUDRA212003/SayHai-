import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // High-end PageLoader should use the Zinc-950 background
  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-yellow-500/30 selection:text-yellow-200">
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      {/* NOIR INDUSTRIAL TOASTER */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#09090b', // Zinc-950
            color: '#f4f4f5',      // Zinc-100
            border: '1px solid #27272a', // Zinc-800
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
          },
          success: {
            iconTheme: {
              primary: '#eab308', // Yellow-500
              secondary: '#09090b',
            },
            style: {
              border: '1px solid rgba(234, 179, 8, 0.2)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Red-500
              secondary: '#09090b',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.2)',
            },
          },
        }}
      />
    </div>
  );
}

export default App;