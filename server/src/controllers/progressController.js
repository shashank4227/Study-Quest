import { UserProgress } from '../models/UserProgress.js';
import { Challenge } from '../models/Challenge.js';
import User from '../models/User.js';
import { getLevelFromXP } from '../utils/xpEngine.js';
import { checkAchievements } from '../utils/achievementEngine.js';

// @desc    Submit challenge result and update progress
// @route   POST /api/progress/submit
// @access  Private
export const submitChallenge = async (req, res) => {
  const { challengeId, isSuccess } = req.body;
  const userId = req.user._id;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    let retries = 3;
    while (retries > 0) {
      try {
        let progress = await UserProgress.findOne({ userId });
        
        // Create progress if it doesn't exist
        if (!progress) {
          progress = new UserProgress({ userId });
        }

        // If failed, just return
        if (!isSuccess) {
          return res.json({ message: 'Keep trying!', success: false });
        }

        // Check if already completed to prevent double XP
        const alreadyCompleted = progress.completedChallenges.some(
          id => id.toString() === challengeId.toString()
        );
        
        let xpEarned = 0;
        let leveledUp = false;
        let newBadges = [];

        if (!alreadyCompleted) {
          progress.completedChallenges.push(challengeId);
          xpEarned = challenge.xpReward;
          progress.totalXP += xpEarned;

          // Update User global XP
          const user = await User.findById(userId);
          user.xp += xpEarned;

          // Calculate Level
          const newLevel = getLevelFromXP(user.xp);
          if (newLevel > user.level) {
            user.level = newLevel;
            progress.level = newLevel;
            leveledUp = true;
          }

          // Check for World Completion (simplified check: if it's a Boss Battle)
          if (challenge.bossBattle) {
            if (!progress.completedWorlds.includes(challenge.world)) {
              progress.completedWorlds.push(challenge.world);
              progress.currentWorld = challenge.world + 1; // Unlock next world
              progress.currentChallenge = 1;
            }
          } else {
             progress.currentChallenge = challenge.order + 1;
          }

          // Check achievements
          const { newAchievements, allAchievements } = checkAchievements(progress, user);
          progress.achievements = allAchievements;
          newBadges = newAchievements;

          // Save progress first to avoid double XP increment if VersionError occurs on progress
          await progress.save();
          await user.save();
        }

        return res.json({
          success: true,
          xpEarned,
          totalXP: progress.totalXP,
          level: progress.level,
          leveledUp,
          newBadges,
          currentWorld: progress.currentWorld,
          currentChallenge: progress.currentChallenge
        });

      } catch (err) {
        if (err.name === 'VersionError' && retries > 1) {
          retries--;
          continue; // Retry the transaction
        }
        throw err;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user progress details
// @route   GET /api/progress
// @access  Private
export const getProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id })
      .populate('completedChallenges', 'title slug world xpReward');
      
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user._id });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Save run history
// @route   POST /api/progress/history
// @access  Private
export const saveRunHistory = async (req, res) => {
  const { challengeId, status, code, time } = req.body;
  const userId = req.user._id;

  try {
    const result = await UserProgress.updateOne(
      { userId, 'challengeHistory.challengeId': challengeId },
      { $push: { 'challengeHistory.$.runs': { status, code, time } } }
    );

    if (result.matchedCount === 0) {
      await UserProgress.updateOne(
        { userId },
        {
          $push: {
            challengeHistory: {
              challengeId,
              runs: [{ status, code, time }]
            }
          }
        },
        { upsert: true }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Save in-progress draft code for a challenge (linked to account, not device)
// @route   POST /api/progress/draft
// @access  Private
export const saveDraft = async (req, res) => {
  const { challengeId, code } = req.body;
  const userId = req.user._id;

  if (!challengeId) {
    return res.status(400).json({ message: 'challengeId is required' });
  }

  try {
    const updateObj = (code === null || code === undefined || code === '')
      ? { $unset: { [`codeDrafts.${challengeId}`]: '' } }
      : { $set: { [`codeDrafts.${challengeId}`]: code } };

    await UserProgress.updateOne(
      { userId },
      updateObj,
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('saveDraft error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
