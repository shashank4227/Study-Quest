import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Home, Map as MapIcon, BookOpen, Trophy, Settings, LogOut, User } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'World Map', icon: MapIcon, path: '/map' },
    { name: 'History', icon: BookOpen, path: '/history' },
    { name: 'Achievements', icon: Trophy, path: '/achievements' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-[#1591DC]/30 relative overflow-hidden">
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col relative z-10 bg-[#050505]/80 backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
           <div className="border border-white/20 px-2 py-1 font-bold tracking-widest text-xs">
             STUDYQUEST<span className="text-[#1591DC]">.</span>
           </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1591DC]/10 text-[#1591DC] border border-[#1591DC]/20 shadow-[inset_0_0_20px_rgba(21,145,220,0.05)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#1591DC]' : 'opacity-70'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1591DC]/20 flex items-center justify-center border border-[#1591DC]/30">
              <User className="w-5 h-5 text-[#1591DC]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-200">{user?.name || 'Explorer'}</p>
              <p className="text-xs text-[#1591DC] truncate font-medium">Lvl {user?.level || 1} • {user?.xp || 0} XP</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
