export const getLevelFromXP = (xp) => {
  // Simple exponential curve: Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 500, Level 5: 1000...
  // A simplistic approximation: level = Math.floor(Math.sqrt(xp / 50)) + 1
  // Let's define manual thresholds for the first few to be precise to the prompt
  const thresholds = [
    { level: 1, minXP: 0 },
    { level: 2, minXP: 100 },
    { level: 3, minXP: 250 },
    { level: 4, minXP: 500 },
    { level: 5, minXP: 1000 },
    { level: 6, minXP: 2000 },
    { level: 7, minXP: 4000 },
    { level: 8, minXP: 8000 },
    { level: 9, minXP: 16000 },
    { level: 10, minXP: 32000 },
  ];

  let currentLevel = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i].minXP) {
      currentLevel = thresholds[i].level;
    } else {
      break;
    }
  }

  // If beyond level 10, use a generic formula
  if (xp >= 32000) {
     currentLevel = 10 + Math.floor((xp - 32000) / 20000);
  }

  return currentLevel;
};

export const getNextLevelXP = (currentLevel) => {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  if (currentLevel < thresholds.length) {
    return thresholds[currentLevel]; // currentLevel is 1-indexed, so thresholds[1] is 100 (Level 2 req)
  }
  return 32000 + ((currentLevel - 9) * 20000);
};
