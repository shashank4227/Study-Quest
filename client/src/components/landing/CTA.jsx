import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Massive Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1591DC] via-blue-700 to-indigo-900" />
      
      {/* Decorative Particles */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />

      <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm mb-8 backdrop-blur-md border border-white/20">
            <Sparkles className="w-4 h-4" /> Start your journey today
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Ready To Begin Your Quest?
          </h2>
          
          <p className="text-sm md:text-base text-blue-100 mb-8 leading-relaxed">
            Join thousands of learners mastering code through adventure. Stop watching tutorials and start building.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#1591DC] rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-base transition-colors backdrop-blur-md"
            >
              Explore Worlds
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
