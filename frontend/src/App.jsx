import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
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
    // Initialize theme first so there's no "white flash"
    initTheme(); 
    // Verify session with the backend
    checkAuth();
  }, [checkAuth, initTheme]);

  /** * CRITICAL: If the app is verifying the user's session, 
   * we stop everything and show the loader. 
   * This prevents child components (ChatPage) from making API calls 
   * before we know if the user is actually authorized.
   */
  if (isCheckingAuth && !authUser) return <PageLoader />;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-zinc-950 selection:bg-yellow-500/30 selection:text-yellow-200' 
        : 'bg-white selection:bg-blue-100 selection:text-blue-900'
    }`}>
      
      <Routes>
        {/* Main Chat Route: Only accessible if authUser exists */}
        <Route 
          path="/" 
          element={authUser ? <ChatPage /> : <Navigate to="/login" />} 
        />

        {/* Auth Routes: Only accessible if NOT logged in */}
        <Route 
          path="/login" 
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />} 
        />
        
        {/* Verification Route: Accessible to anyone with a token link */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Admin Route: Requires authUser AND admin role */}
        <Route 
          path="/admin" 
          element={
            authUser?.role === "admin" 
              ? <AdminPanel /> 
              : <Navigate to="/" />
          } 
        />

        {/* Catch-all: Redirect to home */}
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
            boxShadow: isDarkMode 
              ? '0 20px 40px -10px rgba(0,0,0,0.7)' 
              : '0 20px 40px -10px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#eab308',
              secondary: isDarkMode ? '#09090b' : '#ffffff',
            },
            style: {
              border: isDarkMode 
                ? '1px solid rgba(234, 179, 8, 0.2)' 
                : '1px solid rgba(34, 197, 94, 0.2)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDarkMode ? '#09090b' : '#ffffff',
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