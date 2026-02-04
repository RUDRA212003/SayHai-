import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { isDarkMode, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme(); 
    checkAuth();
  }, []);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-950 selection:bg-yellow-500/30 selection:text-yellow-200' : 'bg-white selection:bg-blue-100 selection:text-blue-900'}`}>
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        
        <Route 
          path="/admin" 
          element={authUser?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} 
        />
        
        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: isDarkMode ? '#09090b' : '#ffffff',
            color: isDarkMode ? '#f4f4f5' : '#1f2937',
            border: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: isDarkMode ? '0 20px 40px -10px rgba(0,0,0,0.7)' : '0 20px 40px -10px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#eab308',
              secondary: isDarkMode ? '#09090b' : '#ffffff',
            },
            style: {
              border: isDarkMode ? '1px solid rgba(234, 179, 8, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDarkMode ? '#09090b' : '#ffffff',
            },
            style: {
              border: isDarkMode ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
            },
          },
        }}
      />
    </div>
  );
}

export default App;