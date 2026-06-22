import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2">
            <h1 className="text-xl font-bold text-white mb-4">StudyQuest</h1>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              The premier interactive learning engine for mastering software engineering through gamification, project-building, and AI mentorship.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-slate-400 hover:text-[#1591DC] cursor-pointer transition-colors">X</div>
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-slate-400 hover:text-[#1591DC] cursor-pointer transition-colors">GH</div>
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-slate-400 hover:text-[#1591DC] cursor-pointer transition-colors">IN</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-slate-200 font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Adventure Mode</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">AI Mentor</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Roadmap</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-slate-200 font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Documentation</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Challenges</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-xs text-slate-400 hover:text-[#1591DC] transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs">
          <p>© 2026 StudyQuest. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
