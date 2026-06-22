import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Lock, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { ACHIEVEMENTS, RARITY_STYLES, RARITY_GLOW } from '../lib/achievements';
import { cn } from '../lib/utils';
import GlassCard from '../components/ui/GlassCard';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const Achievements = () => {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress')
      .then(({ data }) => setUnlocked(data.achievements || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4 p-4 md:p-6 max-w-5xl mx-auto mt-8">
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold font-heading text-brand-text">Achievements</h1>
        </div>
        <p className="text-brand-muted">
          {unlockedCount} of {ACHIEVEMENTS.length} badges unlocked
        </p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassCard className="p-4" hover={false}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-brand-muted">Collection Progress</span>
            <span className="text-brand font-semibold">{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-brand-accent rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-brand rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id);
          return (
            <motion.div key={achievement.id} variants={staggerItem}>
              <motion.div
                whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
                className={cn(
                  'relative rounded-xl p-4 border transition-all duration-300',
                  isUnlocked
                    ? cn(RARITY_STYLES[achievement.rarity], RARITY_GLOW[achievement.rarity])
                    : 'glass opacity-60'
                )}
              >
                {/* Shine animation for unlocked */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] animate-shimmer" />
                  </motion.div>
                )}

                <div className="flex items-start gap-4 relative">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-xl border',
                    isUnlocked ? 'bg-brand-accent border-brand/20' : 'bg-brand-bg border-brand-border'
                  )}>
                    {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-brand-muted" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold font-heading text-brand-text text-sm">{achievement.name}</h3>
                      <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-brand-accent text-brand-muted">
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">{achievement.description}</p>
                  </div>
                </div>

                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-green-400"
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <div className="text-center">
          <Link to="/map" className="text-brand font-medium hover:underline">
            Start your first quest →
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default Achievements;
