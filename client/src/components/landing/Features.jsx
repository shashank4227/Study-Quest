import { motion } from 'framer-motion';
import { Terminal, Bot, Swords, Network, Trophy, LineChart } from 'lucide-react';

const features = [
  {
    icon: Terminal,
    title: "Interactive Coding Quests",
    description: "Write real code in a sandboxed browser environment. No setup required.",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-500/10"
  },
  {
    icon: Bot,
    title: "AI Mentor QuestMaster",
    description: "Get context-aware hints and debugging help from our integrated Gemini AI without giving away the answer.",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-500/10"
  },
  {
    icon: Swords,
    title: "Boss Battles",
    description: "Defeat World Bosses by building real-world mini projects to prove your mastery.",
    color: "from-red-400 to-red-600",
    bg: "bg-red-500/10"
  },
  {
    icon: Network,
    title: "Skill Trees",
    description: "Navigate through 7 distinct coding worlds, from Variables to Async Galaxies.",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Earn XP, level up, and unlock prestigious badges as you progress through your journey.",
    color: "from-yellow-400 to-yellow-600",
    bg: "bg-yellow-500/10"
  },
  {
    icon: LineChart,
    title: "Learning Analytics",
    description: "Track your study streaks, strongest topics, and XP history with beautiful visual charts.",
    color: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-500/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Features = () => {
  return (
    <section className="py-16 bg-[#050505] relative">
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1591DC] to-indigo-400">master Software Engineering</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Stop watching tutorials. Start building, battling, and leveling up your skills with our premium feature suite.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#1591DC]/50 transition-colors z-10 overflow-hidden"
            >
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1591DC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
                <feature.icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} style={{ color: 'white' }} />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1591DC] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
