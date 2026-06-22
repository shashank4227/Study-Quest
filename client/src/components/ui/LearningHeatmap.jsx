import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const LEVELS = ['#E8F6FF', '#B8E4FA', '#7EC8F2', '#4FB3F6', '#1591DC', '#0D6FB0'];

function generateHeatmapData() {
  const weeks = 12;
  const days = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const level = Math.random() > 0.35 ? Math.floor(Math.random() * 5) + 1 : 0;
      data.push({ week: w, day: d, level, xp: level * 20 });
    }
  }
  return data;
}

const LearningHeatmap = memo(() => {
  const data = useMemo(() => generateHeatmapData(), []);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-0">
        <div className="flex flex-col gap-[3px] pt-5 text-[10px] text-brand-muted">
          {days.map((d, i) => (
            <div key={i} className="h-3 flex items-center">{d}</div>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {Array.from({ length: 12 }).map((_, week) => (
            <div key={week} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, day) => {
                const cell = data.find((c) => c.week === week && c.day === day);
                const level = cell?.level ?? 0;
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (week * 7 + day) * 0.008 }}
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    title={level ? `${cell.xp} XP` : 'No activity'}
                    className="w-3 h-3 rounded-sm cursor-pointer transition-shadow hover:ring-2 hover:ring-brand/40"
                    style={{ backgroundColor: LEVELS[level] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-brand-muted">
        <span>Less</span>
        {LEVELS.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});

LearningHeatmap.displayName = 'LearningHeatmap';
export default LearningHeatmap;
