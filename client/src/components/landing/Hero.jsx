import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register' or 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = authMode === 'register' ? '/users' : '/users/login';
      const payload = authMode === 'register' ? { name, email, password } : { email, password };
      
      const res = await api.post(endpoint, payload);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#050505] overflow-hidden text-white flex flex-col font-sans">
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Planet Horizon Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] w-[120%] h-[500px] bg-gradient-to-t from-[#1591DC]/30 to-transparent blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] w-[150%] h-[800px] bg-[#050505] rounded-[100%] border-t border-[#1591DC]/20 pointer-events-none z-0 shadow-[0_-50px_100px_rgba(21,145,220,0.1)]" />

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6">
        
        {/* Left: Logo */}
        <div className="border-2 border-white px-3 py-1 font-bold tracking-widest text-sm">
          STUDYQUEST<span className="text-[#1591DC]">.</span>
        </div>

        {/* Center: Links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-xs font-bold tracking-widest text-white/70">
          <Link to="#" className="hover:text-white transition-colors">WORLDS</Link>
          <Link to="#" className="hover:text-white transition-colors">QUESTS</Link>
          <Link to="#" className="hover:text-white transition-colors">ABOUT</Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
            className="text-white/70 hover:text-white font-bold text-sm transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
            className="bg-[#1591DC] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#127ABD] transition-colors shadow-[0_0_20px_rgba(21,145,220,0.4)]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-32 mt-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] relative z-20 text-center"
        >
          Transform<br />
          <span className="relative inline-block mt-2 mb-2">
            <span className="font-serif italic font-light text-7xl md:text-9xl px-8">Learning</span>
            
            {/* Ellipse SVG */}
            <svg className="absolute inset-0 w-full h-full text-white/40 scale-125" viewBox="0 0 200 100" preserveAspectRatio="none" fill="none">
              <ellipse cx="100" cy="50" rx="95" ry="40" stroke="currentColor" strokeWidth="1" transform="rotate(-5 100 50)" />
            </svg>
            
            {/* Sparkles */}
            <div className="absolute -right-8 top-0 text-white/80">✨</div>
            <div className="absolute -left-4 bottom-4 text-white/80 text-sm">✨</div>
          </span><br />
          Into Adventure
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 relative z-20"
        >
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-transparent border border-white/30 rounded-full hover:bg-white hover:text-black"
          >
            Start Your Quest
            <div className="absolute inset-0 h-full w-full rounded-full group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Intro Description */}
      <div className="relative z-20 container mx-auto px-4 pb-24 pt-32 text-center flex justify-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed font-light"
        >
          STUDYQUEST <span className="font-serif italic">is a full-immersion</span> SOFTWARE ENGINEERING ENGINE <span className="font-serif italic">that helps</span> ASPIRING DEVELOPERS <span className="font-serif italic">master code</span> FASTER.
        </motion.p>
      </div>

      {/* Authentication Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#050505] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative shadow-[0_0_50px_rgba(21,145,220,0.15)]"
            >
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  {authMode === 'register' ? 'Join the Adventure' : 'Welcome Back'}
                </h2>
                <p className="text-white/50 text-xs">
                  {authMode === 'register' 
                    ? 'Create an account to save your progress and earn XP.' 
                    : 'Log in to continue your coding journey.'}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold mb-1 text-white/70">Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#1591DC] transition-colors" 
                      placeholder="Code Explorer"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold mb-1 text-white/70">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#1591DC] transition-colors" 
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-white/70">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#1591DC] transition-colors" 
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1591DC] hover:bg-[#127ABD] text-white rounded-xl py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'register' ? 'Create Account' : 'Sign In')}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white/50">
                {authMode === 'register' ? (
                  <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-[#1591DC] hover:underline font-bold">Log In</button></>
                ) : (
                  <>Need an account? <button onClick={() => setAuthMode('register')} className="text-[#1591DC] hover:underline font-bold">Sign Up</button></>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Hero;
