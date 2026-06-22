import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Logo from '../components/ui/Logo';
import ParticleBackground from '../components/effects/ParticleBackground';
import { motion } from 'framer-motion';
import { Map, Code2, Sparkles, Trophy } from 'lucide-react';

const features = [
  { icon: Map, text: 'Explore 7 coding worlds' },
  { icon: Code2, text: 'Interactive code challenges' },
  { icon: Sparkles, text: 'AI-powered QuestMaster' },
  { icon: Trophy, text: 'Earn XP, badges & level up' },
];

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex bg-[#050505] relative overflow-hidden">
      <ParticleBackground count={20} className="opacity-60" />

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Logo size="lg" showTagline className="mb-10" />
          <h2 className="text-4xl font-bold font-heading text-white leading-tight mb-4">
            Your coding adventure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1591DC] to-indigo-400">starts here</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
            Join StudyQuest and master coding through interactive quests and AI mentorship.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1591DC]/10 border border-[#1591DC]/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#1591DC]" />
                </div>
                <span className="font-medium text-white">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
