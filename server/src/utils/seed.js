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
          : `// Your code here\n\n\n// Do not edit below\nreturn answer;`,
        expectedOutput: isBoss ? 'success' : `answer_${world.id}_${i}`,
        hints: [`Think about how ${world.topic} works.`, `Check the MDN docs for syntax help.`],
        solution: `// Solution for Challenge ${i}`,
        xpReward: isBoss ? 500 : i <= 3 ? 50 : i <= 7 ? 100 : 200,
      });
    }
  });

  // ─── WORLD 1: Village of Variables ───────────────────────────────────────

  // Challenge 1 - Let
  challenges[0].title = 'Store Your Name';
  challenges[0].description = `Welcome, Code Explorer! Every adventurer needs a name.\n\nCreate a variable named \`playerName\` and assign it a string.`;
  challenges[0].starterCode = '// Create your variable below\n\n\n// Do not edit below\nreturn playerName;';
  challenges[0].expectedOutput = 'Explorer';
  challenges[0].hints = ['Use: let playerName = "Explorer";', 'String values must be wrapped in quotes.'];
  challenges[0].xpReward = 50;
  challenges[0].testCases = [];
  challenges[0].validationRules = [
    { type: 'regex', condition: 'let\\s+playerName\\s*=', message: 'You must use "let" to declare playerName.' }
  ];

  // Challenge 2 - Numbers
  challenges[1].title = 'Count Your Gold';
  challenges[1].description = `The village elder needs a count of the treasure!\n\nCreate two variables:\n- \`goldCoins\` with the value \`120\`\n- \`silverCoins\` with the value \`45\`\n\nThen create a variable \`totalCoins\` that stores their **sum**, and return it.`;
  challenges[1].starterCode = '// Declare goldCoins, silverCoins, and totalCoins\n\n\n// Do not edit below\nreturn totalCoins;';
  challenges[1].expectedOutput = '165';
  challenges[1].hints = ['Use the + operator to add numbers.', 'let totalCoins = goldCoins + silverCoins;'];
  challenges[1].xpReward = 50;
  challenges[1].testCases = [];
  challenges[1].validationRules = [
    { type: 'includes', condition: 'goldCoins + silverCoins', message: 'You must calculate totalCoins by adding goldCoins and silverCoins together.' }
  ];

  // Challenge 3 - const
  challenges[2].title = 'The Village Name';
  challenges[2].description = `Some things never change. The village name is permanent!\n\nUse \`const\` to declare a constant named \`villageName\` with the value \`"Codehaven"\`.\n\n\`const\` is used for values that should never be reassigned:\n\`\`\`\nconst gravity = 9.8;\n\`\`\`\n\nReturn \`villageName\`.`;
  challenges[2].starterCode = '// Use const to declare the village name\n\n\n// Do not edit below\nreturn villageName;';
  challenges[2].expectedOutput = 'Codehaven';
  challenges[2].hints = ['Use: const villageName = "Codehaven";', 'const cannot be reassigned after declaration.'];
  challenges[2].xpReward = 50;
  challenges[2].testCases = [];
  challenges[2].validationRules = [
    { type: 'regex', condition: 'const\\s+villageName\\s*=', message: 'You must use "const" to declare villageName. "let" and "var" are not allowed!' }
  ];

  // Challenge 4 - Booleans
  challenges[3].title = 'The Gate is Open?';
  challenges[3].description = `The village gate can be either open or closed.\n\nCreate a variable \`isGateOpen\` with the boolean value \`true\`, and a variable \`isRaining\` with the value \`false\`.\n\nReturn the **string** \`"Open"\` if \`isGateOpen\` is true, or \`"Closed"\` if false.\n\nBooleans are \`true\` or \`false\` — no quotes needed!`;
  challenges[3].starterCode = '// Declare isGateOpen, isRaining, and status\n\n\n// Do not edit below\nreturn status;';
  challenges[3].expectedOutput = 'Open';
  challenges[3].hints = ['Use an if statement: if (isGateOpen) { status = "Open"; }', 'Booleans don\'t use quotes: true, not "true".'];
  challenges[3].xpReward = 50;
  challenges[3].testCases = [];
  challenges[3].validationRules = [
    { type: 'regex', condition: 'isGateOpen\\s*=\\s*true', message: 'You must set isGateOpen to true.' },
    { type: 'regex', condition: 'isRaining\\s*=\\s*false', message: 'You must set isRaining to false.' }
  ];

  // Challenge 5 - String Concatenation
  challenges[4].title = 'The Welcome Sign';
  challenges[4].description = `The village blacksmith wants to display a greeting on the sign.\n\nYou have two variables: \`greeting\` = \`"Hello"\` and \`name\` = \`"Adventurer"\`.\n\nCombine them into a variable \`message\` using **string concatenation** with a \`+\` operator.\n\nThe result should be: \`"Hello, Adventurer!"\``;
  challenges[4].starterCode = '// Declare greeting, name, and combine them into message\n\n\n// Do not edit below\nreturn message;';
  challenges[4].expectedOutput = 'Hello, Adventurer!';
  challenges[4].hints = ['Use: let message = greeting + ", " + name + "!";', 'Don\'t forget the comma and space between the words.'];
  challenges[4].xpReward = 100;
  challenges[4].testCases = [];
  challenges[4].validationRules = [
    { type: 'includes', condition: '+', message: 'You must use the + operator for string concatenation.' }
  ];

  // Challenge 6 - Template Literals
  challenges[5].title = 'Magic Scroll';
  challenges[5].description = `The mage wants a fancier scroll message using **template literals** (backticks)!\n\nGiven \`heroName = "Zara"\` and \`level = 5\`, create a \`scrollMessage\` using a template literal.\n\nExpected output: \`"Hero Zara has reached level 5!"\`\n\nTemplate literals use backticks and \`\${}\`:\n\`\`\`\nlet msg = \`Hello, \${name}!\`;\n\`\`\``;
  challenges[5].starterCode = '// Declare heroName, level, and scrollMessage using a template literal\n\n\n// Do not edit below\nreturn scrollMessage;';
  challenges[5].expectedOutput = 'Hero Zara has reached level 5!';
  challenges[5].hints = ['Use backticks: `Hero ${heroName} has reached level ${level}!`', 'Variables inside template literals use ${} syntax.'];
  challenges[5].xpReward = 100;
  challenges[5].testCases = [];
  challenges[5].validationRules = [
    { type: 'includes', condition: '`', message: 'You must use backticks (`) to create a template literal.' },
    { type: 'includes', condition: '${', message: 'You must use ${} to inject variables into the template literal.' }
  ];

  // Challenge 7 - typeof
  challenges[6].title = 'The Type Oracle';
  challenges[6].description = `The Oracle can identify what **type** a value is. Use the \`typeof\` operator.\n\nYou have a variable \`mystery = 42\`.\n\nReturn the **type** of \`mystery\` as a string.\n\nExpected output: \`"number"\`\n\nThe \`typeof\` operator returns a string like \`"number"\`, \`"string"\`, \`"boolean"\`, \`"undefined"\`.`;
  challenges[6].starterCode = '// Declare mystery and use typeof to get its type as mysteryType\n\n\n// Do not edit below\nreturn mysteryType;';
  challenges[6].expectedOutput = 'number';
  challenges[6].hints = ['Use: let mysteryType = typeof mystery;', 'typeof returns a string describing the type.'];
  challenges[6].xpReward = 100;
  challenges[6].testCases = [];
  challenges[6].validationRules = [
    { type: 'includes', condition: 'typeof', message: 'You must use the typeof operator.' }
  ];

  // Challenge 8 - Type Conversion
  challenges[7].title = 'The Alchemist\'s Conversion';
  challenges[7].description = `The alchemist can turn strings into numbers!\n\nYou have \`numStr = "42"\` (a string). Convert it to a **number** using \`Number()\`, store it in \`numValue\`, then **add 8** to it.\n\nReturn the result. Expected output: \`50\`\n\nType conversion:\n\`\`\`\nNumber("10") // → 10\nString(99)   // → "99"\n\`\`\``;
  challenges[7].starterCode = '// Declare numStr, convert it to a number, add 8, store as numValue\n\n\n// Do not edit below\nreturn numValue;';
  challenges[7].expectedOutput = '50';
  challenges[7].hints = ['Use: let numValue = Number(numStr) + 8;', 'Without Number(), "42" + 8 would give "428" (string concat)!'];
  challenges[7].xpReward = 200;
  challenges[7].testCases = [];
  challenges[7].validationRules = [
    { type: 'includes', condition: 'Number(', message: 'You must use the Number() function to convert the string.' }
  ];

  // Challenge 9 - null & undefined
  challenges[8].title = 'The Empty Chest';
  challenges[8].description = `Some chests are empty!\n\nDeclare:\n- \`emptyChest\` with the value \`null\` (intentionally empty)\n- \`unknownItem\` without assigning any value (it will be \`undefined\`)\n\nReturn a string that says \`"Chest: null, Item: undefined"\`\n\nHint:\n\`\`\`\nlet result = \`Chest: \${emptyChest}, Item: \${unknownItem}\`;\n\`\`\``;
  challenges[8].starterCode = '// Declare emptyChest, unknownItem, and build the result string\n\n\n// Do not edit below\nreturn result;';
  challenges[8].expectedOutput = 'Chest: null, Item: undefined';
  challenges[8].hints = ['Use a template literal: `Chest: ${emptyChest}, Item: ${unknownItem}`', 'null means intentionally empty; undefined means not assigned.'];
  challenges[8].xpReward = 200;
  challenges[8].testCases = [];

  // Challenge 10 - Boss Battle
  challenges[9].title = 'Boss Battle: Score Tracker';
  challenges[9].description = `You have reached the Boss Battle! 🏆\n\nBuild a mini score tracker for a game:\n\n1. Declare \`playerName\` as \`"Champion"\`\n2. Declare \`score\` as \`0\`\n3. Add \`100\` to score (first kill)\n4. Add \`250\` to score (boss kill)\n5. Declare \`message\` using a template literal: \`"\${playerName} scored \${score} points!"\`\n\nReturn \`message\`.\n\nExpected: \`"Champion scored 350 points!"\``;
  challenges[9].title = 'Boss Battle: Score Tracker';
  challenges[9].starterCode = '// Step 1: Declare playerName\n\n// Step 2: Declare score as 0\n\n// Step 3: Add 100 to score\n\n// Step 4: Add 250 to score\n\n// Step 5: Create the message using a template literal\n\n\n// Do not edit below\nreturn message;';
  challenges[9].expectedOutput = 'Champion scored 350 points!';
  challenges[9].hints = ['Use let for score so you can update it.', 'score += 100; is shorthand for score = score + 100;', 'Template literal: `${playerName} scored ${score} points!`'];
  challenges[9].xpReward = 500;
  challenges[9].bossBattle = true;
  challenges[9].testCases = [];
  challenges[9].validationRules = [
    { type: 'includes', condition: '+=', message: 'Use += to add to the score.' }
  ];

  // World 2: Forest of Conditions (Indexes 10-19)
  // Challenge 1
  challenges[10].title = 'The Safe Path';
  challenges[10].description = 'The forest is dark. If it is daytime, the path is "Safe", otherwise it is "Danger". Set the `pathStatus` variable based on `isDaytime`.';
  challenges[10].starterCode = '// Variable `isDaytime` is provided\n// Declare pathStatus and write your if/else logic\n\n\n// Do not edit below\nreturn pathStatus;';
  challenges[10].testCases = [
    { input: '{"isDaytime": true}', expectedOutput: '"Safe"' },
    { input: '{"isDaytime": false}', expectedOutput: '"Danger"' }
  ];
  
  // Challenge 2
  challenges[11].title = "The Guard's Password";
  challenges[11].description = 'The goblin guard asks for a password. If the password is "magic", return true, else return false.';
  challenges[11].starterCode = '// Variable `password` is provided\n// Declare canPass and write your if/else logic\n\n\n// Do not edit below\nreturn canPass;';
  challenges[11].testCases = [
    { input: '{"password": "magic"}', expectedOutput: 'true' },
    { input: '{"password": "open"}', expectedOutput: 'false' },
    { input: '{"password": "MAGIC"}', expectedOutput: 'false' }
  ];

  // Challenge 3
  challenges[12].title = 'Tavern Age Check';
  challenges[12].description = 'To enter the tavern, you must be 18 or older. Return "Welcome" if age is >= 18, or "Too young" if not.';
  challenges[12].starterCode = '// Variable `age` is provided\n// Declare message and write your if/else logic\n\n\n// Do not edit below\nreturn message;';
  challenges[12].testCases = [
    { input: '{"age": 20}', expectedOutput: '"Welcome"' },
    { input: '{"age": 16}', expectedOutput: '"Too young"' },
    { input: '{"age": 18}', expectedOutput: '"Welcome"' }
  ];

  // Challenge 4
  challenges[13].title = 'Number Sign';
  challenges[13].description = 'Return "Positive", "Negative", or "Zero" depending on the value of `number`.';
  challenges[13].starterCode = '// Variable `number` is provided\n// Declare sign and write your if/else if/else logic\n\n\n// Do not edit below\nreturn sign;';
  challenges[13].testCases = [
    { input: '{"number": -5}', expectedOutput: '"Negative"' },
    { input: '{"number": 10}', expectedOutput: '"Positive"' },
    { input: '{"number": 0}', expectedOutput: '"Zero"' }
  ];

  // Challenge 5
  challenges[14].title = 'The Magic Potion';
  challenges[14].description = 'You need both water and herbs to brew the potion. If both `hasWater` and `hasHerb` are true, return "Potion Brewed", else "Missing ingredients".';
  challenges[14].starterCode = '// Variables `hasWater` and `hasHerb` are provided\n// Declare result and write your logic using &&\n\n\n// Do not edit below\nreturn result;';
  challenges[14].testCases = [
    { input: '{"hasWater": true, "hasHerb": true}', expectedOutput: '"Potion Brewed"' },
    { input: '{"hasWater": true, "hasHerb": false}', expectedOutput: '"Missing ingredients"' },
    { input: '{"hasWater": false, "hasHerb": true}', expectedOutput: '"Missing ingredients"' },
    { input: '{"hasWater": false, "hasHerb": false}', expectedOutput: '"Missing ingredients"' }
  ];
  challenges[14].validationRules = [
    { type: 'includes', condition: '&&', message: 'You must use the && (AND) operator.' }
  ];

  // Challenge 6
  challenges[15].title = 'The Backup Key';
  challenges[15].description = 'To open the chest, you need a key OR a magic spell. If `hasKey` or `knowsSpell` is true, return "Chest Opened", else "Chest Locked".';
  challenges[15].starterCode = '// Variables `hasKey` and `knowsSpell` are provided\n// Declare result and write your logic using ||\n\n\n// Do not edit below\nreturn result;';
  challenges[15].testCases = [
    { input: '{"hasKey": false, "knowsSpell": true}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": true, "knowsSpell": false}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": true, "knowsSpell": true}', expectedOutput: '"Chest Opened"' },
    { input: '{"hasKey": false, "knowsSpell": false}', expectedOutput: '"Chest Locked"' }
  ];
  challenges[15].validationRules = [
    { type: 'includes', condition: '||', message: 'You must use the || (OR) operator.' }
  ];

  // Challenge 7
  challenges[16].title = 'Tavern Menu';
  challenges[16].description = 'Use a switch statement. If `drinkChoice` is 1, return "Water". If 2, "Ale". If 3, "Mead". Default should be "Unknown".';
  challenges[16].starterCode = '// Variable `drinkChoice` is provided\n// Declare drink and write your switch statement\n\n\n// Do not edit below\nreturn drink;';
  challenges[16].testCases = [
    { input: '{"drinkChoice": 1}', expectedOutput: '"Water"' },
    { input: '{"drinkChoice": 2}', expectedOutput: '"Ale"' },
    { input: '{"drinkChoice": 3}', expectedOutput: '"Mead"' },
    { input: '{"drinkChoice": 5}', expectedOutput: '"Unknown"' }
  ];
  challenges[16].validationRules = [
    { type: 'includes', condition: 'switch', message: 'You must use a switch statement.' }
  ];

  // Challenge 8
  challenges[17].title = 'Day of the Week';
  challenges[17].description = 'Use a switch statement. If `dayNumber` is 3, return "Wednesday". (Assume 1 is Monday). Default should be "Invalid".';
  challenges[17].starterCode = '// Variable `dayNumber` is provided\n// Declare dayName and write your switch statement\n\n\n// Do not edit below\nreturn dayName;';
  challenges[17].testCases = [
    { input: '{"dayNumber": 1}', expectedOutput: '"Monday"' },
    { input: '{"dayNumber": 3}', expectedOutput: '"Wednesday"' },
    { input: '{"dayNumber": 7}', expectedOutput: '"Sunday"' },
    { input: '{"dayNumber": 9}', expectedOutput: '"Invalid"' }
  ];
  challenges[17].validationRules = [
    { type: 'includes', condition: 'switch', message: 'You must use a switch statement.' }
  ];

  // Challenge 9
  challenges[18].title = 'Discount Checker';
  challenges[18].description = 'If `isMember` is true and `total > 100`, return 20. Else if `isMember` is true, return 10. Else return 0.';
  challenges[18].starterCode = '// Variables `isMember` and `total` are provided\n// Declare discount and write your nested logic\n\n\n// Do not edit below\nreturn discount;';
  challenges[18].testCases = [
    { input: '{"isMember": true, "total": 150}', expectedOutput: '20' },
    { input: '{"isMember": true, "total": 50}', expectedOutput: '10' },
    { input: '{"isMember": false, "total": 150}', expectedOutput: '0' },
    { input: '{"isMember": false, "total": 50}', expectedOutput: '0' }
  ];

  // Challenge 10 (Boss)
  challenges[19].title = 'Boss Battle: Movie Ticket Checker';
  challenges[19].description = 'Calculate ticket price. Base price is 15. If age < 12, price is 8. If age >= 65, price is 10. If `isMatinee` is true, subtract 2 from the final price.';
  challenges[19].starterCode = '// Variables `age` and `isMatinee` are provided\n// Declare price and calculate the ticket cost\n\n\n// Do not edit below\nreturn price;';;
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
