import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CX = 200;
const CY = 200;
const RADIUS = 155;

const pillars = [
  {
    id: '01',
    title: 'Core Fundamentals',
    description: 'Build a rock-solid foundation with variables, types, operators, and the building blocks every developer needs.',
    angle: -90,
    nodeAngle:-92
  },
  {
    id: '02',
    title: 'Logic & Flow',
    description: 'Master conditions, loops, and control flow to write code that makes smart decisions on its own.',
    angle: -18,
    nodeAngle:-20
  },
  {
    id: '03',
    title: 'Data Structures',
    description: 'Tame arrays, objects, and collections — the tools you need to organize and manipulate real-world data.',
    angle: 54,
  },
  {
    id: '04',
    title: 'Async & APIs',
    description: 'Learn promises, async/await, and fetch to build apps that talk to the outside world in real time.',
    angle: 126,
    nodeAngle:129
  },
  {
    id: '05',
    title: 'Architecture',
    description: 'Design reusable functions and modular patterns that scale from small scripts to full applications.',
    angle: 198,
    nodeAngle:199
  },
];

function polarToXY(angleDeg, radius = RADIUS) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function tooltipPlacement(angle) {
  // Pillars 4 & 5 (left side of the graph) -> tooltip to the left of the title
  if (angle > 90 || angle < -90) {
    return 'right-full mr-40 top-1/2 -translate-y-1/2';
  }
  // Pillars 1, 2, 3 (right/top side of the graph) -> tooltip to the right of the title
  return 'left-full ml-40 top-1/2 -translate-y-1/2';
}

const Sparkle = ({ className, delay = 0 }) => (
  <motion.span
    className={`absolute text-[#1591DC] pointer-events-none select-none ${className}`}
    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
    transition={{ duration: 3, repeat: Infinity, delay }}
  >
    ✦
  </motion.span>
);

const Pillars = memo(() => {
  const [active, setActive] = useState(null);
  const activePillar = pillars.find((p) => p.id === active);

  return (
    <section className="bg-[#050505] text-white py-28 md:py-36 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-[2.75rem] font-light leading-tight tracking-tight mb-6">
            Interactive, challenge-driven{' '}
            <span className="font-serif italic font-normal">mastery</span> learning solutions.
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Our custom data-driven, gamified learning paths have helped developers of all skill levels
            grasp complex concepts faster, regardless of their background or previous experience.
          </p>
        </motion.div>

        {/* Radar diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative w-full max-w-[520px] aspect-square mx-auto mt-50 mb-50"
        >
          {/* Central Blue Radial Glow */}
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none -z-10">
            <div className="absolute inset-[15%] rounded-full bg-[#4382DF] blur-[100px]" />
            <div className="absolute inset-[15%] rounded-full bg-[#1591DC] blur-[80px]" />
          </div> */}

          {/* Dark core circle */}
          <div className="absolute inset-[-15%] rounded-full bg-[#050505] border border-white/[0.04] shadow-[inset_0_0_80px_rgba(21,145,220,0.06)]" />

          <Sparkle className="top-[18%] left-[28%] text-lg" delay={0} />
          <Sparkle className="bottom-[22%] left-[20%] text-sm" delay={1.2} />
          <Sparkle className="top-[48%] left-[70%] text-xs opacity-60" delay={2} />

          {/* SVG radar grid + spokes */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              <radialGradient id="lineFade" cx="200" cy="200" r="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(21, 145, 220, 0)" />
                <stop offset="5%" stopColor="rgba(21, 145, 220, 0)" />
                <stop offset="100%" stopColor="rgba(21, 145, 220, 0.4)" />
              </radialGradient>
              <radialGradient id="lineFadeActive" cx="200" cy="200" r="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(21, 145, 220, 0)" />
                <stop offset="5%" stopColor="rgba(21, 145, 220, 0)" />
                <stop offset="100%" stopColor="rgba(21, 145, 220, 1)" />
              </radialGradient>
            </defs>

            {/* Dashed rings - Exactly 3 circles */}
            {[75, 115, RADIUS].map((r) => (
              <circle
                key={r}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke="rgba(21, 145, 220, 0.12)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}

            {/* Spoke lines fading from center */}
            {pillars.map((pillar) => {
              const { x: x2, y: y2 } = polarToXY(pillar.angle, RADIUS);
              const isActive = active === pillar.id;
              return (
                <line
                  key={pillar.id}
                  x1={CX}
                  y1={CY}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? 'url(#lineFadeActive)' : 'url(#lineFade)'}
                  strokeWidth={isActive ? 1.5 : 1}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <p className="text-[#1591DC] font-medium text-sm md:text-base text-center leading-snug tracking-wide max-w-[150px] px-4 py-2 drop-shadow-lg">
              The 5 Pillars
              <br />
              of Software Engineering
            </p>
          </div>

          {/* Pillar nodes */}
          {pillars.map((pillar, index) => {
            const effectiveAngle = pillar.nodeAngle !== undefined ? pillar.nodeAngle : pillar.angle;
            const { x, y } = polarToXY(effectiveAngle);
            const left = `${(x / 400) * 100}%`;
            const top = `${(y / 400) * 100}%`;
            const isActive = active === pillar.id;

            // Label offset based on quadrant
            const labelStyle = (() => {
              const a = effectiveAngle;
              if (a >= -110 && a <= -70) return 'bottom-full mb-3 left-1/2 -translate-x-1/2 text-center origin-bottom';
              if (a >= -45 && a <= 45) return 'left-full ml-4 top-1/2 -translate-y-1/2 text-left origin-left';
              if (a >= 70 && a <= 110) return 'top-full mt-3 left-1/2 -translate-x-1/2 text-center origin-top';
              if (a >= 160 || a <= -160) return 'right-full mr-4 top-1/2 -translate-y-1/2 text-right origin-right';
              return 'left-full ml-4 top-1/2 -translate-y-1/2 text-left origin-left';
            })();

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute z-20"
                style={{ left, top, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActive(pillar.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(pillar.id)}
                onBlur={() => setActive(null)}
              >
                <button
                  type="button"
                  className="group relative flex flex-col items-center outline-none"
                  aria-label={pillar.title}
                >
                  {/* Label */}
                  <motion.div 
                    animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`absolute whitespace-nowrap ${labelStyle}`}
                  >
                    <span className="block text-[10px] md:text-xs text-[#1591DC]/70 font-mono tracking-widest mb-0.5">
                      {pillar.id}
                    </span>
                    <span
                      className={`block text-xs md:text-sm font-semibold tracking-wide transition-colors duration-200 ${
                        isActive ? 'text-[#4FB3F6]' : 'text-[#1591DC]'
                      }`}
                    >
                      {pillar.title}
                    </span>
                  </motion.div>

                  {/* Node */}
                  <motion.div
                    animate={isActive ? { scale: 2 } : { scale: 1.5 }}
                    className={`relative w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 bg-[#050505] transition-shadow duration-300 ${
                      isActive
                        ? 'border-[#4FB3F6] shadow-[0_0_20px_rgba(21,145,220,0.7)]'
                        : 'border-[#1591DC] shadow-[0_0_10px_rgba(21,145,220,0.35)]'
                    }`}
                  >
                    {/* <div className={`absolute inset-0 m-auto w-1 h-1 rounded-full ${isActive ? 'bg-[#4FB3F6]' : 'bg-[#1591DC]'}`} style={{ width: 4, height: 4 }} /> */}
                  </motion.div>
                </button>
              </motion.div>
            );
          })}

          {/* Tooltip — anchored to active node */}
          <AnimatePresence mode="wait">
            {activePillar && (() => {
              const effectiveAngle = activePillar.nodeAngle !== undefined ? activePillar.nodeAngle : activePillar.angle;
              const node = polarToXY(effectiveAngle);
              const placement = tooltipPlacement(effectiveAngle);
              return (
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-30 pointer-events-none hidden md:block"
                  style={{
                    left: `${(node.x / 400) * 100}%`,
                    top: `${(node.y / 400) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className={`absolute w-56 lg:w-64 ${placement}`}>
                    <div className="relative border border-[#1591DC]/50 rounded-xl bg-[#0a0a0a]/95 backdrop-blur-sm px-4 py-3 shadow-[0_0_30px_rgba(21,145,220,0.2)] z-50">
                      <p className="text-[11px] text-white/70 leading-relaxed italic">
                        {activePillar.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>

        {/* Mobile description */}
        <AnimatePresence mode="wait">
          {activePillar && (
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="md:hidden mt-8 max-w-sm mx-auto text-center"
            >
              <p className="text-xs text-[#1591DC] font-mono tracking-widest mb-1">{activePillar.id}</p>
              <p className="text-sm font-semibold text-[#4FB3F6] mb-2">{activePillar.title}</p>
              <p className="text-sm text-white/60 leading-relaxed italic">{activePillar.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

Pillars.displayName = 'Pillars';
export default Pillars;
