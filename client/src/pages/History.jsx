import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const worldNames = {
  1: 'Village of Variables', 2: 'Forest of Conditions', 3: 'Loop Mountains',
  4: 'Function Kingdom', 5: 'Array Dragon Cave', 6: 'Object Empire', 7: 'Async Galaxy',
};

const History = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress').then(({ data }) => setProgress(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const completed = progress?.completedChallenges || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4 p-4 md:p-6 max-w-4xl mx-auto mt-8">
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3 mb-1">
          <Clock className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold font-heading text-brand-text">Quest History</h1>
        </div>
        <p className="text-brand-muted">Every challenge you've conquered.</p>
      </motion.div>

      {completed.length === 0 ? (
        <motion.div variants={staggerItem}>
          <GlassCard className="p-8 text-center" hover={false}>
            <MapPin className="w-10 h-10 text-brand-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold font-heading text-brand-text mb-2">No quests yet</h3>
            <p className="text-brand-muted mb-6">Start your adventure on the World Map.</p>
            <Link to="/map"><Button>Go to World Map</Button></Link>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {completed.map((challenge, i) => (
            <motion.div key={challenge._id || i} variants={staggerItem}>
              <GlassCard className="p-3 sm:p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-accent flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-brand-text truncate">{challenge.title || 'Challenge'}</div>
                  <div className="text-sm text-brand-muted">{worldNames[challenge.world] || `World ${challenge.world}`}</div>
                </div>
                <div className="text-sm font-bold text-brand shrink-0">+{challenge.xpReward || 0} XP</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {progress && (
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total XP', value: progress.totalXP || 0 },
            { label: 'Worlds', value: progress.completedWorlds?.length || 0 },
            { label: 'Quests', value: completed.length },
          ].map(({ label, value }) => (
            <GlassCard key={label} className="p-3 text-center" hover={false}>
              <div className="text-xl font-bold font-heading text-brand-text">{value}</div>
              <div className="text-[10px] text-brand-muted mt-1">{label}</div>
            </GlassCard>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
