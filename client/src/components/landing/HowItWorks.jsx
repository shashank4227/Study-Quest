import { motion } from 'framer-motion';
import { BookOpen, Code2, Swords, Wrench, Trophy } from 'lucide-react';

const steps = [
  { icon: BookOpen, title: "Learn Concepts", desc: "Bite-sized, interactive explanations that teach you the core mechanics before you write code." },
  { icon: Code2, title: "Solve Challenges", desc: "Apply what you learned immediately in the sandboxed Monaco editor." },
  { icon: Swords, title: "Defeat Bosses", desc: "Combine multiple concepts into one large mini-project to unlock the next world." },
  { icon: Wrench, title: "Build Projects", desc: "Use your unlocked skills to build full-stack applications in the real world." },
  { icon: Trophy, title: "Become a Legend", desc: "Earn all achievements, reach Max Level, and prove your coding mastery." }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-[#050505] relative border-t border-b border-white/5">
      <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-sm md:text-base text-slate-400">The proven 5-step framework to mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector Line (hidden on mobile, visible on md+) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[50%] w-[calc(100%+2rem)] h-[2px] bg-white/5 -z-10">
                  <motion.div 
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: (index * 0.15) + 0.3 }}
                    className="h-full bg-[#1591DC]" 
                  />
                </div>
              )}

              <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-white/5 rounded-full flex items-center justify-center mb-6 relative z-10 group hover:border-[#1591DC] transition-colors">
                <div className="absolute inset-0 bg-[#1591DC]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <step.icon className="w-6 h-6 text-[#1591DC] relative z-10" />
                
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1591DC] text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-slate-950">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-base font-bold text-slate-100 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
