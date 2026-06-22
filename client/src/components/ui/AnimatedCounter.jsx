import { useEffect, useState, memo } from 'react';

function AnimatedCounter({ value, duration = 1200, suffix = '', className = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = typeof value === 'number' ? value : parseFloat(value) || 0;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className={className}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export default memo(AnimatedCounter);
