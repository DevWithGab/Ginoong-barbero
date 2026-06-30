import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { swalError, swalSuccess } from '../../utils/swal';

export const AdminAuthScreens = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { user, isAdmin, loginWithEmail, logout } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setFormErrors({});

    try {
      const response = await loginWithEmail(email, password);
      const userData = response.data.user;
      if (userData.role !== 'admin') {
        swalError({
          title: 'Access Denied',
          text: 'This account is not authorized for admin access.',
        });
        await logout();
        return;
      }
      swalSuccess({
        title: 'Access Granted',
        text: 'Welcome to the admin panel.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      swalError({
        title: 'Login Failed',
        text: err.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fbfcfa] text-[#18181b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15rem] font-serif font-black text-black/[0.02] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none">
           Access
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-zinc-200 p-16 rounded-xl shadow-xl text-center space-y-12 relative z-10"
        >
          <div className="w-24 h-24 bg-vintage-tan rounded-xl flex items-center justify-center mx-auto rotate-3 shadow-xl relative group">
             <Shield className="text-white" size={48} />
             <div className="absolute -inset-2 border border-vintage-tan/20 rounded-xl -z-10 group-hover:rotate-6 transition-transform"></div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 text-vintage-tan font-slab italic text-[11px] font-bold uppercase tracking-[0.6em]">
               <div className="h-px w-8 bg-vintage-tan/30"></div>
               <span>Security Protocol</span>
               <div className="h-px w-8 bg-vintage-tan/30"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter leading-none text-zinc-900">Central <br/><span className="text-zinc-300 italic">Command</span></h1>
            <p className="text-zinc-500 font-slab italic text-lg leading-relaxed border-l border-zinc-200 pl-6 mx-auto max-w-xs">Authorized personnel only. Access to the management console requires valid credentials.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider font-bold">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ginoongbarbero.com"
                  className={`w-full border ${formErrors.email ? 'border-red-300' : 'border-zinc-200'} rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-zinc-300 focus:outline-none focus:border-vintage-tan/50 transition-colors`}
                  autoComplete="email"
                />
              </div>
              {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider font-bold">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full border ${formErrors.password ? 'border-red-300' : 'border-zinc-200'} rounded-xl pl-10 pr-12 py-3 text-sm placeholder:text-zinc-300 focus:outline-none focus:border-vintage-tan/50 transition-colors`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-vintage-tan hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <Link 
            to="/"
            className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 hover:text-vintage-tan transition-all hover:tracking-[0.7em]"
          >
            Return to Storefront
          </Link>
  
          {/* Ornamental details */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-zinc-100"></div>
          <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-zinc-100"></div>
        </motion.div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 flex flex-col items-center justify-center p-6">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-md w-full bg-white border border-red-100 p-12 rounded-xl shadow-xl text-center space-y-8 relative"
         >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
               <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-black uppercase tracking-tighter">Access Forbidden</h1>
              <p className="text-zinc-500 font-slab italic leading-relaxed text-sm">Your account ({user.email}) is not registered in our management whitelist. Contact the administrator to request access.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-vintage-tan hover:text-white transition-all shadow-lg cursor-pointer"
            >
              Sign Out
            </button>
         </motion.div>
      </div>
    );
  }

  return null;
};

export default AdminAuthScreens;
