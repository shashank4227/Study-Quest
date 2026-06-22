import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CS Student @ Stanford",
    content: "StudyQuest completely changed how I learn programming. The boss battles forced me to actually understand the concepts instead of just copy-pasting.",
    avatar: "S"
  },
  {
    name: "David Chen",
    role: "Self-Taught Developer",
    content: "The AI mentor is incredible. It feels like having a senior engineer looking over my shoulder, giving me gentle nudges in the right direction.",
    avatar: "D"
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Bootcamp Grad",
    content: "I've tried every coding platform out there. This is the only one that actually feels like a premium game. The UI is simply gorgeous.",
    avatar: "E"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-[#050505] relative">
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl font-bold text-white mb-4"
          >
            Loved by Learners
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm md:text-base"
          >
            Join thousands of students leveling up their careers.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative"
            >
              <div className="text-[#1591DC] text-2xl font-serif absolute top-4 right-4 opacity-20">"</div>
              <p className="text-xs text-slate-300 mb-6 relative z-10 leading-relaxed">"{t.content}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1591DC] to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-200">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
