import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Save, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getLevelProgress } from '../lib/xp';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const Settings = () => {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const { percent } = getLevelProgress(xp, level);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4 max-w-2xl mx-auto p-4 md:p-6 mt-8">
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3 mb-1">
          <SettingsIcon className="w-6 h-6 text-brand-muted" />
          <h1 className="text-2xl font-bold font-heading text-brand-text">Settings</h1>
        </div>
        <p className="text-brand-muted">Manage your profile and preferences.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-brand-border">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-lg font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-lg font-bold font-heading text-brand-text">{user?.name}</div>
              <div className="text-xs text-brand-muted">{user?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1.5">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl py-2 pl-9 pr-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1.5">Email</label>
              <input type="email" defaultValue={user?.email || ''} disabled className="w-full bg-brand-accent/30 border border-brand-border rounded-xl py-2 px-3 text-sm text-brand-muted cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-muted mb-1.5">College</label>
                <input type="text" defaultValue={user?.college || ''} placeholder="Your college" className="w-full bg-brand-bg border border-brand-border rounded-xl py-2 px-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-muted mb-1.5">Branch</label>
                <input type="text" defaultValue={user?.branch || ''} placeholder="Computer Science" className="w-full bg-brand-bg border border-brand-border rounded-xl py-2 px-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/30" />
              </div>
            </div>
            <Button type="submit">
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
          </form>
        </GlassCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassCard className="p-5 flex flex-col sm:flex-row items-center gap-6" hover={false}>
          <CircularProgress value={percent} sublabel={`Level ${level}`} />
          <div className="flex-1 grid grid-cols-2 gap-3 w-full">
            {[
              { label: 'Level', value: level },
              { label: 'Total XP', value: xp.toLocaleString() },
              { label: 'Streak', value: `${user?.currentStreak || 0}d` },
              { label: 'Best', value: `${user?.bestStreak || 0}d` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-brand-accent/50 rounded-xl p-3 border border-brand-border">
                <div className="text-[10px] text-brand-muted">{label}</div>
                <div className="text-sm font-bold text-brand-text">{value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
