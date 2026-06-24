import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currentWorld: { type: Number, default: 1 },
    currentChallenge: { type: Number, default: 1 }, // Order number of current challenge
    
    completedChallenges: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
    ],
    completedWorlds: [{ type: Number }],
    
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    
    achievements: [{ type: String }],
    learningPath: { type: String, default: 'JavaScript Basics' },
    challengeHistory: [
      {
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
        runs: [
          {
            status: { type: String, enum: ['success', 'error'] },
            code: String,
            time: String
          }
        ]
      }
    ],
    // Stores in-progress draft code per challenge, keyed by challengeId string
    codeDrafts: { type: Map, of: String, default: {} }
  },
  { timestamps: true }
);

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
