export const ACHIEVEMENTS = [
  {
    id: 'first_console_log',
    name: 'First Console Log',
    description: 'Complete your very first coding challenge.',
    icon: '🎯',
    rarity: 'common',
  },
  {
    id: 'variable_apprentice',
    name: 'Variable Apprentice',
    description: 'Conquer the Village of Variables.',
    icon: '🏘️',
    rarity: 'uncommon',
  },
  {
    id: 'condition_master',
    name: 'Condition Master',
    description: 'Navigate the Forest of Conditions.',
    icon: '🌲',
    rarity: 'uncommon',
  },
  {
    id: 'javascript_explorer',
    name: 'JavaScript Explorer',
    description: 'Reach Level 5 on your quest.',
    icon: '🧭',
    rarity: 'rare',
  },
];

export const RARITY_STYLES = {
  common: 'bg-[#0a0a0a] border-white/10',
  uncommon: 'bg-[#1591DC]/10 border-[#1591DC]/30',
  rare: 'bg-purple-500/10 border-purple-500/30',
  legendary: 'bg-amber-500/10 border-amber-500/40',
};

export const RARITY_GLOW = {
  common: '',
  uncommon: 'shadow-[0_0_15px_rgba(21,145,220,0.15)]',
  rare: 'shadow-[0_0_20px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/20',
  legendary: 'shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30',
};
