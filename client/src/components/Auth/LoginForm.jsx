import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/logo/ginoong-barbero_LOGO.png';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

export const LoginForm = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleGoogleSuccess = async (googleResponse) => {
    setIsLoading(true);
    setErrors({});

    try {
      await loginWithGoogle(googleResponse.credential);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    setErrors({
      submit: 'Google login failed. Please try again.'
    });
  };

  return (
    <div className="min-h-screen bg-vintage-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block mb-6">
            <img 
              src={logo} 
              alt="Ginoong Barbero Logo" 
              className="h-12 w-auto object-contain hover:opacity-90 transition-opacity duration-700"
            />
          </Link>
          
          <h1 className="text-3xl font-serif font-black text-white mb-2">Admin Login</h1>
          <p className="text-white/60 text-sm">Sign in with your Google account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          {/* Global Error */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Google Login Button */}
            <div className="flex justify-center" style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.7 : 1 }}>
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </GoogleOAuthProvider>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 text-white/60">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Signing you in...</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              Only authorized staff can access the admin panel
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link 
            to="/" 
            className="text-white/40 hover:text-vintage-tan text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
