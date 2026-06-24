import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    world: { type: Number, required: true, index: true },
    order: { type: Number, required: true },
    course: { type: String, enum: ['javascript', 'c'], default: 'javascript' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Boss'], default: 'Easy' },
    bossBattle: { type: Boolean, default: false },
    
    description: { type: String, required: true },
    explanation: { type: String }, // The concept teaching text
    starterCode: { type: String, default: '// Write your code here\n' },
    expectedOutput: { type: String }, // For simple string match validation
    
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false }
      }
    ],
    
    validationRules: [
      {
        type: { type: String, enum: ['includes', 'excludes', 'regex'] },
        condition: String,
        message: String
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
