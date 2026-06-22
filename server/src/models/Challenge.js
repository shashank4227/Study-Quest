import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    world: { type: Number, required: true, index: true },
    order: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Boss'], default: 'Easy' },
    bossBattle: { type: Boolean, default: false },
    
    description: { type: String, required: true },
    explanation: { type: String, required: true }, // The concept teaching text
    starterCode: { type: String, default: '// Write your code here\n' },
    expectedOutput: { type: String }, // For simple string match validation
    
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false }
      }
    ],
    
    hints: [{ type: String }],
    solution: { type: String },
    
    xpReward: { type: Number, default: 50 },
    unlockRequirements: {
      requiredWorld: { type: Number },
      requiredChallengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
    }
  },
  { timestamps: true }
);

export const Challenge = mongoose.model('Challenge', challengeSchema);
