import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Compass } from 'lucide-react';
import api from '../lib/api';
import { cn } from '../lib/utils';
import GlassCard from '../components/ui/GlassCard';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const jsWorlds = [
  { id: 1, name: 'Village of Variables', description: 'Master the basics of data storage.', emoji: '🌱', unlockLevel: 1 },
  { id: 2, name: 'Forest of Conditions', description: 'Learn to make decisions with code.', emoji: '🌲', unlockLevel: 2 },
  { id: 3, name: 'Loop Mountains', description: 'Automate repetitive tasks.', emoji: '⛰', unlockLevel: 3 },
  { id: 4, name: 'Function Kingdom', description: 'Build reusable logic blocks.', emoji: '🏰', unlockLevel: 5 },
  { id: 5, name: 'Array Dragon Cave', description: 'Tame lists of data.', emoji: '🐉', unlockLevel: 7 },
  { id: 6, name: 'Object Empire', description: 'Structure complex entities.', emoji: '👑', unlockLevel: 10 },
  { id: 7, name: 'Async Galaxy', description: 'Control time and requests.', emoji: '🚀', unlockLevel: 15 },
];

const cWorlds = [
  { id: 1, name: 'Village of Syntax', description: 'Learn basic I/O and compilation.', emoji: '⚙️', unlockLevel: 1 },
  { id: 2, name: 'Type Caverns', description: 'Understand memory-level data types.', emoji: '🗄️', unlockLevel: 2 },
  { id: 3, name: 'Forest of Control', description: 'Master loops and decision logic.', emoji: '🌲', unlockLevel: 3 },
  { id: 4, name: 'Function Fortress', description: 'Build reusable C function blocks.', emoji: '🏰', unlockLevel: 5 },
  { id: 5, name: 'Pointer Peaks', description: 'Master direct memory manipulation.', emoji: '🎯', unlockLevel: 7 },
  { id: 6, name: 'Struct Citadel', description: 'Build complex memory layouts.', emoji: '🏛️', unlockLevel: 10 },
  { id: 7, name: 'Allocation Abyss', description: 'Dynamic memory management (malloc/free).', emoji: '🕳️', unlockLevel: 12 },
];

const WorldMap = () => {
  const [searchParams] = useSearchParams();
  const course = searchParams.get('course') || 'javascript';
  const activeWorlds = course === 'c' ? cWorlds : jsWorlds;

  const [progress, setProgress] = useState(null);
  const currentWorld = progress?.currentWorld || 1;
  const completedWorlds = progress?.completedWorlds || [];

  useEffect(() => {
    api.get('/progress').then(({ data }) => setProgress(data)).catch(() => {});
  }, []);

  const progressPercent = Math.round((completedWorlds.length / activeWorlds.length) * 100);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="py-8 max-w-5xl mx-auto px-4">
      <motion.div variants={staggerItem} className="text-center mb-16 relative">
        {/* Glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#1591DC]/20 blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#1591DC] border border-[#1591DC]/30 bg-[#1591DC]/5 px-4 py-1.5 rounded-full mb-6">
          <Compass className="w-4 h-4" />
          {progressPercent}% JOURNEY COMPLETE
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight relative z-10">
          The Coding <span className="font-serif italic font-light text-[#1591DC]">Journey</span>
        </h1>
        <p className="text-white/50 text-lg">Follow the path from beginner to legend.</p>
      </motion.div>

      <div className="relative pb-24">
        {/* Animated path line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-1 -translate-x-1/2 bg-white/5 rounded-full hidden sm:block border border-white/5" />
        <motion.div
          className="absolute left-1/2 top-8 w-1 -translate-x-1/2 bg-[#1591DC] rounded-full hidden sm:block shadow-[0_0_15px_#1591DC]"
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(100, ((currentWorld - 1) / (activeWorlds.length - 1)) * 100)}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        <div className="space-y-12 sm:space-y-24">
          {activeWorlds.map((world, index) => {
            // World 1 is always unlocked. Every subsequent world requires
            // the previous world to be in the server-side completedWorlds array.
            // This is account-based and works across all devices/browsers.
            const isUnlocked = world.id === 1 || completedWorlds.includes(world.id - 1);
            const isCurrent = currentWorld === world.id;
            const isCompleted = completedWorlds.includes(world.id);
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={world.id}
                variants={staggerItem}
                className={cn('flex items-center gap-6 sm:gap-0 relative z-10', isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse')}
              >
                <div className={cn('flex-1 sm:w-5/12', isLeft ? 'sm:pr-16 sm:text-right' : 'sm:pl-16 sm:text-left')}>
                  <GlassCard
                    hover={isUnlocked}
                    className={cn(
                      'p-8 relative overflow-hidden bg-[#0a0a0a]',
                      isCurrent && 'border-[#1591DC]/50 shadow-[0_0_30px_rgba(21,145,220,0.15)]',
                      isCompleted && 'border-emerald-500/30',
                      !isUnlocked && 'opacity-40 border-white/5'
                    )}
                  >
                    {isCompleted && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full blur-xl pointer-events-none" />
                    )}
                    {isCurrent && (
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#1591DC]/10 rounded-br-full blur-xl pointer-events-none" />
                    )}
                    
                    <span className="text-4xl mb-4 block drop-shadow-2xl">{world.emoji}</span>
                    <h3 className="text-xl font-bold text-white leading-relaxed pb-2 mb-1">{world.name}</h3>
                    <p className="text-sm text-white/50 mb-6 leading-relaxed">{world.description}</p>

                    {isUnlocked ? (
                      <Link to={`/theory?world=${world.id}&course=${course}`}>
                        <motion.span
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "inline-flex w-full items-center justify-center py-3 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer",
                            isCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" :
                            isCurrent ? "bg-[#1591DC] text-white shadow-[0_0_20px_rgba(21,145,220,0.4)] hover:bg-[#127ABD]" :
                            "bg-white/5 text-white hover:bg-white/10"
                          )}
                        >
                          {isCompleted ? '📖 Replay World' : isCurrent ? '📖 Enter World' : '📖 Explore Theory'}
                        </motion.span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-white/30 text-xs font-bold tracking-widest py-3 border border-white/5 rounded-full">
                        <Lock className="w-3 h-3" /> REQUIRES LEVEL {world.unlockLevel}
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* Node */}
                <motion.div
                  className="relative z-20 shrink-0 sm:w-2/12 flex justify-center"
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative',
                    isUnlocked ? 'bg-[#0a0a0a] border-2 border-[#1591DC] text-[#1591DC]' : 'bg-[#050505] border border-white/10 text-white/20'
                  )}>
                    {isCurrent && <div className="absolute inset-0 rounded-full bg-[#1591DC]/20 blur-md" />}
                    {isCompleted ? <Trophy className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> :
                     isUnlocked ? <Star className="w-6 h-6" /> :
                     <Lock className="w-5 h-5" />}
                  </div>
                </motion.div>

                <div className="hidden sm:block sm:w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;
