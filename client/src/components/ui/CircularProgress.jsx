import { memo } from 'react';
import { motion } from 'framer-motion';

const CircularProgress = memo(({ value, size = 120, stroke = 8, label, sublabel }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E8F6FF" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1591DC" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-heading text-brand-text">{Math.round(value)}%</span>
        {label && <span className="text-xs text-brand-muted mt-0.5">{label}</span>}
      </div>
      {sublabel && <span className="text-sm text-brand-muted mt-2">{sublabel}</span>}
    </div>
  );
});

CircularProgress.displayName = 'CircularProgress';
export default CircularProgress;
