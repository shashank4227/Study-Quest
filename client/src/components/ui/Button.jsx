import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = memo(({
  children, variant = 'primary', size = 'md', className, ...props
}) => {
  const variants = {
    primary: 'btn-brand text-white font-semibold shadow-md shadow-brand/20',
    secondary: 'bg-brand-accent text-brand-dark font-semibold border border-brand-border hover:bg-white',
    ghost: 'text-brand-muted hover:text-brand hover:bg-brand-accent font-medium',
    outline: 'border-2 border-brand text-brand font-semibold hover:bg-brand-accent',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
