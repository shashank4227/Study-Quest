import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import Button from '../ui/Button';

const LevelUpModal = memo(({ show, level, xpEarned, onClose }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-text/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="relative glass-card rounded-3xl p-10 max-w-sm w-full text-center overflow-hidden"
        >
          {/* Glow rings */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-48 h-48 rounded-full border-2 border-brand/30" />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-64 h-64 rounded-full border border-brand-light/20" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-20 h-20 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 glow-brand">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 text-brand mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Level Up!</span>
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-4xl font-bold font-heading text-brand-text mb-2">Level {level}</h2>
            {xpEarned > 0 && (
              <p className="text-brand-muted mb-8">+{xpEarned} XP earned</p>
            )}
            <Button onClick={onClose} className="w-full">Continue Adventure</Button>
          </motion.div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

LevelUpModal.displayName = 'LevelUpModal';
export default LevelUpModal;
