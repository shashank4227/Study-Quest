import { motion } from 'framer-motion';

const badges = [
  { icon: '🏆', title: 'First Console Log', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  { icon: '⚔️', title: 'Loop Warrior', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
  { icon: '🧠', title: 'Function Master', color: 'bg-fuchsia-500/20 text-fuchsia-500 border-fuchsia-500/50' },
  { icon: '🐉', title: 'Array Slayer', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' },
  { icon: '🚀', title: 'Async Champion', color: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
];

const Achievements = () => {
  return (
    <section className="py-16 bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Collect <span className="text-yellow-400">Achievements</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Show off your hard-earned achievements on your public profile. Prove to recruiters and friends that you're a true Coding Master.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(250, 204, 21, 0.2)"
              }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-[#0a0a0a] border ${badge.color} rounded-2xl p-4 w-40 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative mb-3">
                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-slate-800">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {badge.icon}
                  </div>
                </div>
              </div>
              
              <h4 className="text-sm font-bold text-slate-200 mb-1">{badge.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
