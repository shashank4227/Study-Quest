import { cn } from '../../lib/utils';

const Logo = ({ size = 'md', showTagline = false, className, light = false }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8 text-sm', title: 'text-lg', tagline: 'text-xs' },
    md: { icon: 'w-10 h-10 text-base', title: 'text-xl', tagline: 'text-sm' },
    lg: { icon: 'w-12 h-12 text-lg', title: 'text-3xl', tagline: 'text-base' },
  };
  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('rounded-xl gradient-brand flex items-center justify-center font-bold text-white shadow-md shadow-brand/25', s.icon)}>
        SQ
      </div>
      <div>
        <h1 className={cn(
          'font-heading font-bold tracking-tight',
          light ? 'text-white' : 'text-brand-text',
          s.title
        )}>
          Study<span className="text-brand">Quest</span>
        </h1>
        {showTagline && (
          <p className={cn('font-medium', light ? 'text-white/70' : 'text-brand-muted', s.tagline)}>
            Level up your learning
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
