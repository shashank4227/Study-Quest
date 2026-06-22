export const checkAchievements = (progress, user) => {
  const newAchievements = [];
  const currentAchievements = progress.achievements || [];

  const addAchievement = (id, name) => {
    if (!currentAchievements.includes(id)) {
      newAchievements.push(id);
      currentAchievements.push(id);
    }
  };

  // 1. First Console Log
  if (progress.completedChallenges.length >= 1) {
    addAchievement('first_console_log', 'First Console Log');
  }

  // 2. Variable Apprentice (World 1 completed)
  if (progress.completedWorlds.includes(1)) {
    addAchievement('variable_apprentice', 'Variable Apprentice');
  }

  // 3. Condition Master (World 2 completed)
  if (progress.completedWorlds.includes(2)) {
    addAchievement('condition_master', 'Condition Master');
  }

  // 4. JavaScript Explorer (Level 5)
  if (progress.level >= 5) {
    addAchievement('javascript_explorer', 'JavaScript Explorer');
  }

  // Return the newly unlocked achievements so we can notify the user
  return { newAchievements, allAchievements: currentAchievements };
};
