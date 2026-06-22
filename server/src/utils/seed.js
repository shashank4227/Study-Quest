import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Challenge } from '../models/Challenge.js';
import { UserProgress } from '../models/UserProgress.js';

dotenv.config(); // Assumes run from 'server' root

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyquest';

const worldThemes = [
  { id: 1, name: 'Village of Variables', topic: 'Variables & Data Types', boss: 'Score Tracker' },
  { id: 2, name: 'Forest of Conditions', topic: 'If/Else & Switch', boss: 'Movie Ticket Checker' },
  { id: 3, name: 'Loop Mountains', topic: 'For & While Loops', boss: 'Number Guessing Game' },
  { id: 4, name: 'Function Kingdom', topic: 'Functions & Scope', boss: 'Student Grade Manager' },
  { id: 5, name: 'Array Dragon Cave', topic: 'Arrays & Methods', boss: 'Movie Recommendation Engine' }
];

const generateChallenges = () => {
  const challenges = [];
  
  worldThemes.forEach((world) => {
    for (let i = 1; i <= 10; i++) {
      const isBoss = i === 10;
      challenges.push({
        title: isBoss ? `Boss Battle: ${world.boss}` : `${world.name} - Challenge ${i}`,
        slug: `world-${world.id}-challenge-${i}`,
        world: world.id,
        order: i,
        difficulty: isBoss ? 'Boss' : i <= 3 ? 'Easy' : i <= 7 ? 'Medium' : 'Hard',
        bossBattle: isBoss,
        description: isBoss 
          ? `Defeat the boss by building a ${world.boss} using ${world.topic}!` 
          : `Master ${world.topic} in this challenge. Complete the required task.`,
        explanation: `In this section, you are learning about ${world.topic}. Understand the syntax and logic before applying it!`,
        starterCode: isBoss 
          ? `// Build the ${world.boss}\nfunction run() {\n\n}\nreturn run();` 
          : `// Challenge ${i} starter code\nlet answer = null;\n\n// Your code here\n\nreturn answer;`,
        expectedOutput: isBoss ? 'success' : `answer_${world.id}_${i}`,
        hints: [`Think about how ${world.topic} works.`, `Check the MDN docs for syntax help.`],
        solution: `// Solution for Challenge ${i}`,
        xpReward: isBoss ? 500 : i <= 3 ? 50 : i <= 7 ? 100 : 200,
      });
    }
  });

  // Customize World 1, Challenge 1 to make it fully playable out of the box
  challenges[0].title = 'Store Your Name';
  challenges[0].description = 'Welcome, Code Explorer! To enter the village, you must learn how to store information. Create a variable named `playerName` and assign your name to it.';
  challenges[0].explanation = 'Variables act as containers for storing data values. In JavaScript, we use `let`, `const`, or `var` to declare them.';
  challenges[0].starterCode = '// Create your variable here\nlet playerName = "";\n\n// Leave this here for testing\nreturn playerName;';
  challenges[0].expectedOutput = 'Explorer';
  challenges[0].hints = ['Use the let keyword: let playerName = "Your Name";'];

  // World 2: Forest of Conditions (Indexes 10-19)
  // Challenge 1
  challenges[10].title = 'The Safe Path';
  challenges[10].description = 'The forest is dark. If it is daytime, the path is "Safe", otherwise it is "Danger". Set the `pathStatus` variable based on `isDaytime`.';
  challenges[10].starterCode = '// Variable `isDaytime` is provided\nlet pathStatus = "";\n\nif (isDaytime) {\n  // Your code here\n}\n\nreturn pathStatus;';
  challenges[10].testCases = [
    { input: '{"isDaytime": true}', expectedOutput: '"Safe"' },
    { input: '{"isDaytime": false}', expectedOutput: '"Danger"' }
  ];
  
  // Challenge 2
  challenges[11].title = "The Guard's Password";
  challenges[11].description = 'The goblin guard asks for a password. If the password is "magic", return true, else return false.';
  challenges[11].starterCode = '// Variable `password` is provided\nlet canPass = false;\n\n// Add an if/else statement here\n\nreturn canPass;';
  challenges[11].testCases = [
    { input: '{"password": "magic"}', expectedOutput: 'true' },
    { input: '{"password": "open"}', expectedOutput: 'false' },
    { input: '{"password": "MAGIC"}', expectedOutput: 'false' }
  ];

  // Challenge 3
  challenges[12].title = 'Tavern Age Check';
  challenges[12].description = 'To enter the tavern, you must be 18 or older. Return "Welcome" if age is >= 18, or "Too young" if not.';
  challenges[12].starterCode = '// Variable `age` is provided\nlet message = "";\n\n// Write if/else logic\n\nreturn message;';
  challenges[12].testCases = [
    { input: '{"age": 20}', expectedOutput: '"Welcome"' },
    { input: '{"age": 16}', expectedOutput: '"Too young"' },
    { input: '{"age": 18}', expectedOutput: '"Welcome"' }
  ];

  // Challenge 4
  challenges[13].title = 'Number Sign';
  challenges[13].description = 'Return "Positive", "Negative", or "Zero" depending on the value of `number`.';
  challenges[13].starterCode = '// Variable `number` is provided\nlet sign = "";\n\n// Use if, else if, and else\n\nreturn sign;';
  challenges[13].testCases = [
    { input: '{"number": -5}', expectedOutput: '"Negative"' },
    { input: '{"number": 10}', expectedOutput: '"Positive"' },
    { input: '{"number": 0}', expectedOutput: '"Zero"' }
  ];

  // Challenge 5
  challenges[14].title = 'The Magic Potion';
  challenges[14].description = 'You need both water and herbs to brew the potion. If both `hasWater` and `hasHerb` are true, return "Potion Brewed", else "Missing ingredients".';
  challenges[14].starterCode = '// Variables `hasWater` and `hasHerb` are provided\nlet result = "";\n\n// Use the logical AND (&&) operator\n\nreturn result;';
  challenges[14].testCases = [
    { input: '{"hasWater": true, "hasHerb": true}', expectedOutput: '"Potion Brewed"' },
    { input: '{"hasWater": true, "hasHerb": false}', expectedOutput: '"Missing ingredients"' },
    { input: '{"hasWater": false, "hasHerb": true}', expectedOutput: '"Missing ingredients"' },
    { input: '{"hasWater": false, "hasHerb": false}', expectedOutput: '"Missing ingredients"' }
  ];

  // Challenge 6
  challenges[15].title = 'The Backup Key';
  challenges[15].description = 'To open the chest, you need a key OR a magic spell. If `hasKey` or `knowsSpell` is true, return "Chest Opened", else "Chest Locked".';
  challenges[15].starterCode = '// Variables `hasKey` and `knowsSpell` are provided\nlet result = "";\n\n// Use the logical OR (||) operator\n\nreturn result;';
  challenges[15].testCases = [
    { input: '{"hasKey": false, "knowsSpell": true}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": true, "knowsSpell": false}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": true, "knowsSpell": true}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": false, "knowsSpell": false}', expectedOutput: '"Chest Locked"' }
  ];

  // Challenge 7
  challenges[16].title = 'Tavern Menu';
  challenges[16].description = 'Use a switch statement. If `drinkChoice` is 1, return "Water". If 2, "Ale". If 3, "Mead". Default should be "Unknown".';
  challenges[16].starterCode = '// Variable `drinkChoice` is provided\nlet drink = "";\n\nswitch(drinkChoice) {\n  // Add cases here\n}\n\nreturn drink;';
  challenges[16].testCases = [
    { input: '{"drinkChoice": 1}', expectedOutput: '"Water"' },
    { input: '{"drinkChoice": 2}', expectedOutput: '"Ale"' },
    { input: '{"drinkChoice": 3}', expectedOutput: '"Mead"' },
    { input: '{"drinkChoice": 5}', expectedOutput: '"Unknown"' }
  ];

  // Challenge 8
  challenges[17].title = 'Day of the Week';
  challenges[17].description = 'Use a switch statement. If `dayNumber` is 3, return "Wednesday". (Assume 1 is Monday). Default should be "Invalid".';
  challenges[17].starterCode = '// Variable `dayNumber` is provided\nlet dayName = "";\n\n// Write your switch statement here\n\nreturn dayName;';
  challenges[17].testCases = [
    { input: '{"dayNumber": 1}', expectedOutput: '"Monday"' },
    { input: '{"dayNumber": 3}', expectedOutput: '"Wednesday"' },
    { input: '{"dayNumber": 7}', expectedOutput: '"Sunday"' },
    { input: '{"dayNumber": 9}', expectedOutput: '"Invalid"' }
  ];

  // Challenge 9
  challenges[18].title = 'Discount Checker';
  challenges[18].description = 'If `isMember` is true and `total > 100`, return 20. Else if `isMember` is true, return 10. Else return 0.';
  challenges[18].starterCode = '// Variables `isMember` and `total` are provided\nlet discount = 0;\n\n// Write your nested logic here\n\nreturn discount;';
  challenges[18].testCases = [
    { input: '{"isMember": true, "total": 150}', expectedOutput: '20' },
    { input: '{"isMember": true, "total": 50}', expectedOutput: '10' },
    { input: '{"isMember": false, "total": 150}', expectedOutput: '0' },
    { input: '{"isMember": false, "total": 50}', expectedOutput: '0' }
  ];

  // Challenge 10 (Boss)
  challenges[19].title = 'Boss Battle: Movie Ticket Checker';
  challenges[19].description = 'Calculate ticket price. Base price is 15. If age < 12, price is 8. If age >= 65, price is 10. If `isMatinee` is true, subtract 2 from the final price.';
  challenges[19].starterCode = '// Variables `age` and `isMatinee` are provided\nlet price = 15;\n\n// First, calculate age-based price\n\n// Then, apply matinee discount if applicable\n\nreturn price;';
  challenges[19].testCases = [
    { input: '{"age": 10, "isMatinee": true}', expectedOutput: '6' },
    { input: '{"age": 25, "isMatinee": false}', expectedOutput: '15' },
    { input: '{"age": 65, "isMatinee": true}', expectedOutput: '8' },
    { input: '{"age": 30, "isMatinee": true}', expectedOutput: '13' }
  ];

  return challenges;
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    console.log('Clearing old challenges and progress...');
    await Challenge.deleteMany({});
    // await UserProgress.deleteMany({}); // Don't wipe progress unless needed, or wipe all? We'll wipe just in case.

    console.log('Generating 50 challenges...');
    const challengesToInsert = generateChallenges();

    await Challenge.insertMany(challengesToInsert);
    console.log('Successfully seeded 50 challenges (5 Worlds)!');

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
