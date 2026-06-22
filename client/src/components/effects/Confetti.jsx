import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = memo(({ active, onComplete }) => {
  const [pieces] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#1591DC', '#4FB3F6', '#0D6FB0', '#E8F6FF', '#F59E0B'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.3,
    }))
  );

  useEffect(() => {
    if (active) {
      const t = setTimeout(onComplete, 3000);
      return () => clearTimeout(t);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${p.x}%`, backgroundColor: p.color, top: -10 }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotation + 720, opacity: 0 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
});

Confetti.displayName = 'Confetti';
export default Confetti;
