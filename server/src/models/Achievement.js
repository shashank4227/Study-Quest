import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    badgeUrl: {
      type: String,
      default: '', // URL to a cool icon
    },
    type: {
      type: String,
      enum: ['streak', 'hours', 'sessions', 'special'],
      required: true,
    },
    conditionValue: {
      type: Number, // e.g. 7 for 7-day streak, 100 for 100 sessions
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    dateUnlocked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
