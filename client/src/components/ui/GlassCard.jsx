import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const GlassCard = memo(({ children, className, hover = true, onClick, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    onClick={onClick}
    className={cn(
      'glass-card rounded-2xl',
      hover && 'card-hover cursor-default',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
));

GlassCard.displayName = 'GlassCard';
export default GlassCard;
