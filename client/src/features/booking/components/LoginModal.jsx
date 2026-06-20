import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

export function LoginModal({
  isOpen,
  authLoading,
  authError,
  onGoogleSignIn,
  onClose
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-vintage-card rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 border border-white/10"
          >
            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-vintage-tan/20"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-vintage-tan/20"></div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors z-[10] cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="space-y-5">
              <div className="text-center space-y-1.5 pb-2">
                <div className="text-vintage-tan text-[9px] font-bold uppercase tracking-[0.4em] font-slab italic">Secure Booking</div>
                <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight leading-none pt-1">
                  Welcome Back
                </h2>
                <p className="text-white/40 text-[10px] italic font-slab px-2">
                  Sign in with Google to complete your booking
                </p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-3 px-4 rounded-xl flex items-start gap-2.5 font-bold leading-normal">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Google Button */}
              <div className="flex justify-center" style={{ pointerEvents: authLoading ? 'none' : 'auto', opacity: authLoading ? 0.7 : 1 }}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={onGoogleSignIn}
                    onError={() => {
                      console.error('Google login error');
                    }}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                    shape="rectangular"
                  />
                </GoogleOAuthProvider>
              </div>

              {/* Loading State */}
              {authLoading && (
                <div className="flex items-center justify-center gap-3 text-white/60">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-[10px] font-slab italic">Signing you in...</span>
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-white/30 text-[9px] font-slab italic">
                Your booking info will be saved to your Google account
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
