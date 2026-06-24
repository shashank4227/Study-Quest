import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Terminal, ArrowRight, Zap, Cpu } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const courses = [
  {
    id: 'javascript',
    title: 'JavaScript Mastery',
    description: 'Master the language of the web. Learn variables, logic, loops, and async programming through epic adventures.',
    icon: Code2,
    color: '#f7df1e',
    glowColor: 'rgba(247, 223, 30, 0.15)',
    status: 'Available',
    features: ['Dynamic typing', 'Web development', 'Async/Await', 'DOM Manipulation'],
    path: '/map?course=javascript'
  },
  {
    id: 'c',
    title: 'C Language Fundamentals',
    description: 'Discover the roots of modern programming. Learn memory management, pointers, and blazing fast execution.',
    icon: Terminal,
    color: '#00599C',
    glowColor: 'rgba(0, 89, 156, 0.15)',
    status: 'Available',
    features: ['Static typing', 'Memory Management', 'Pointers', 'System-level access'],
    path: '/map?course=c'
  }
];

const CourseSelection = () => {
  const navigate = useNavigate();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="min-h-screen p-8 flex flex-col items-center justify-center max-w-7xl mx-auto">
      
      <motion.div variants={staggerItem} className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#1591DC]/10 blur-[100px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full mb-6">
          <Cpu className="w-4 h-4" />
          CHOOSE YOUR PATH
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight relative z-10">
          Select Your <span className="font-serif italic font-light text-[#1591DC]">Course</span>
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">Select the language you want to master. Each path offers a unique set of worlds, challenges, and epic boss battles.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        {courses.map((course) => {
          const Icon = course.icon;
          const isComingSoon = course.status === 'Coming Soon';
          
          return (
            <motion.div key={course.id} variants={staggerItem} className="h-full">
              <GlassCard 
                hover={!isComingSoon} 
                className={`p-8 h-full flex flex-col justify-between border bg-[#0a0a0a] transition-all duration-300 ${isComingSoon ? 'opacity-70 border-white/5' : 'border-white/10 hover:border-white/30 cursor-pointer group'}`}
                onClick={() => {
                  if (!isComingSoon) {
                    navigate(course.path);
                  } else {
                    // For now, allow navigation to the placeholder C map anyway so the user can see it!
                    navigate(course.path);
                  }
                }}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl"
                      style={{ 
                        backgroundColor: `${course.color}10`,
                        borderColor: `${course.color}30`,
                        color: course.color 
                      }}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest border ${
                      isComingSoon ? 'bg-white/5 text-white/40 border-white/10' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {course.status}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {course.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed mb-8">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {course.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                        <Zap className="w-4 h-4" style={{ color: course.color }} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all ${
                    isComingSoon ? 'bg-white/5 border-white/5 text-white/30' : 'bg-white/5 border-white/10 text-white group-hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold">{isComingSoon ? 'Preview Map' : 'Enter Course'}</span>
                  <ArrowRight className={`w-5 h-5 ${isComingSoon ? '' : 'group-hover:translate-x-2 transition-transform'}`} />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
};

export default CourseSelection;
