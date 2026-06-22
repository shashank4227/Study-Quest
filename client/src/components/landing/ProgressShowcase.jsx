import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 700 },
  { name: 'Wed', xp: 1200 },
  { name: 'Thu', xp: 1500 },
  { name: 'Fri', xp: 2300 },
  { name: 'Sat', xp: 3400 },
  { name: 'Sun', xp: 4800 },
];

const ProgressShowcase = () => {
  return (
    <section className="py-16 bg-[#050505] relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-[#1591DC]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Visualize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#1591DC]">
                Growth
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mb-6 leading-relaxed">
              Nothing is more motivating than seeing your progress over time. Our analytics dashboard automatically tracks your XP gains, completion rates, and learning streaks.
            </p>

            <div className="space-y-4">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                 <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">Coding Mastery</span>
                  <span className="text-[#1591DC] font-bold">Level 18</span>
                 </div>
                 <div className="h-3 bg-[#050505] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#1591DC] to-emerald-400" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 text-center">
                   <div className="text-xl font-bold text-orange-500 mb-1">14 🔥</div>
                   <div className="text-[10px] text-slate-500 font-medium">Day Streak</div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 text-center">
                   <div className="text-xl font-bold text-emerald-500 mb-1">92%</div>
                   <div className="text-[10px] text-slate-500 font-medium">Completion Rate</div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Chart Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 shadow-2xl"
          >
            <h3 className="text-base font-bold text-slate-200 mb-4">Weekly XP Gain</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#1591DC" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#1591DC', stroke: '#0f172a', strokeWidth: 2 }} 
                    activeDot={{ r: 8, fill: '#4FB3F6' }}
                  />
                  <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ProgressShowcase;
