import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Lock, Sparkles } from 'lucide-react';

const worlds = [
  { name: 'Village of Variables', status: 'completed', icon: '🌱', color: 'bg-emerald-500' },
  { name: 'Forest of Conditions', status: 'current', icon: '🌲', color: 'bg-blue-500' },
  { name: 'Loop Mountains', status: 'locked', icon: '⛰', color: 'bg-[#0a0a0a] border border-white/10' },
  { name: 'Function Kingdom', status: 'locked', icon: '🏰', color: 'bg-[#0a0a0a] border border-white/10' },
  { name: 'Array Dragon Cave', status: 'locked', icon: '🐉', color: 'bg-[#0a0a0a] border border-white/10' },
  { name: 'Object Empire', status: 'locked', icon: '👑', color: 'bg-[#0a0a0a] border border-white/10' },
  { name: 'Async Galaxy', status: 'locked', icon: '🚀', color: 'bg-[#0a0a0a] border border-white/10' },
];

const RoadmapPreview = () => {
  return (
    <section className="py-16 bg-[#050505] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1591DC]/10 border border-[#1591DC]/30 text-[#1591DC] text-xs font-semibold mb-6">
              <MapPin className="w-3 h-3" /> 7 Immersive Worlds
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              A carefully crafted <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1591DC] to-indigo-400">
                Curriculum
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mb-8 leading-relaxed">
              We've mapped out the entire coding ecosystem into 7 distinct regions. Each region introduces new concepts incrementally, ending with an epic Boss Battle that tests everything you've learned.
            </p>
            
            <div className="flex gap-4">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex-1">
                <div className="text-xl font-bold text-white mb-1">70+</div>
                <div className="text-[10px] text-slate-500 font-medium">Mini Challenges</div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex-1">
                <div className="text-xl font-bold text-[#1591DC] mb-1">7</div>
                <div className="text-[10px] text-slate-500 font-medium">Epic Boss Battles</div>
              </div>
            </div>
          </motion.div>

          {/* Map Right */}
          <div className="relative pl-8 md:pl-16">
            {/* The Line */}
            <div className="absolute left-[50px] md:left-[82px] top-8 bottom-8 w-1 bg-white/5 rounded-full " />
            
            {/* Active Line Segment */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "15%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-[50px] md:left-[82px] top-8 w-1 bg-gradient-to-b from-emerald-500 to-[#1591DC] shadow-[0_0_10px_#1591DC] rounded-full" 
            />

            <div className="space-y-4">
              {worlds.map((world, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-6 ${world.status !== 'locked' ? 'opacity-100' : 'opacity-40'}`}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg shadow-lg relative z-10 ${world.status === 'current' ? 'bg-[#0a0a0a] border-2 border-[#1591DC]' : world.color}`}>
                    {world.icon}
                    {world.status === 'current' && (
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-[#1591DC]" 
                      />
                    )}
                  </div>
                  
                  <div className={`flex-1 bg-[#0a0a0a] border ${world.status === 'current' ? 'border-[#1591DC]' : 'border-white/5'} rounded-xl p-3 flex items-center justify-between`}>
                    <span className={`font-semibold text-xs md:text-sm pb-1 leading-normal ${world.status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>
                      {world.name}
                    </span>
                    {world.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {world.status === 'current' && <Sparkles className="w-4 h-4 text-[#1591DC]" />}
                    {world.status === 'locked' && <Lock className="w-3 h-3 text-slate-600" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapPreview;
