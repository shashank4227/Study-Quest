const THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];

export function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (xp >= THRESHOLDS[i]) level = i + 1;
    else break;
  }
  if (xp >= 32000) level = 10 + Math.floor((xp - 32000) / 20000);
  return level;
}

export function getXPForLevel(level) {
  if (level <= THRESHOLDS.length) return THRESHOLDS[level - 1] ?? 0;
  return 32000 + (level - 10) * 20000;
}

export function getNextLevelXP(level) {
  if (level < THRESHOLDS.length) return THRESHOLDS[level];
  return 32000 + (level - 9) * 20000;
}

export function getLevelProgress(xp, level) {
  const currentMin = getXPForLevel(level);
  const nextMin = getNextLevelXP(level);
  const range = nextMin - currentMin;
  const progress = range > 0 ? ((xp - currentMin) / range) * 100 : 100;
  return {
    current: xp - currentMin,
    needed: range,
    percent: Math.min(100, Math.max(0, progress)),
  };
}
