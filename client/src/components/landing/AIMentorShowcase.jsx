import { motion } from 'framer-motion';
import { Bot, Sparkles, Code, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const AIMentorShowcase = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "I see what's happening! You're trying to use `const` for a variable that changes later in the loop. Remember, `const` cannot be reassigned. Try using `let` instead!";

  useEffect(() => {
    // Basic typing effect simulator
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-[#050505] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Chat UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#050505] border-b border-white/5 p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">QuestMaster AI</h3>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#1591DC]/10 border border-[#1591DC]/30 text-slate-200 p-3 rounded-2xl rounded-tr-sm max-w-[85%]">
                    <p className="text-xs">Why is my code throwing a TypeError? I just want to sum the array!</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-slate-300 p-3 rounded-2xl rounded-tl-sm max-w-[85%] font-mono text-xs leading-relaxed shadow-lg">
                    <Sparkles className="w-3 h-3 text-violet-400 mb-2 inline-block mr-2" />
                    {typedText}
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1.5 h-4 bg-violet-400 ml-1 align-middle"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Stuck? Ask your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Personal AI Mentor
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mb-6 leading-relaxed">
              QuestMaster is integrated directly into the editor. It reads your current code and error logs to provide hyper-contextual hints without giving away the final solution.
            </p>

            <ul className="space-y-3">
              {[
                "Explains complex concepts simply",
                "Debugs Syntax and Type errors",
                "Suggests best practices and clean code",
                "Never gives the raw answer—it teaches you."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-violet-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AIMentorShowcase;
