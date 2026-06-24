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
        course: 'javascript',
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
  challenges[0].expectedOutput = '__ANY_STRING__';
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
  challenges[2].description = `Some things never change. The village name is permanent!\n\nUse \`const\` to declare a constant named \`villageName\` with **any string value**.\n\n\`const\` is used for values that should never be reassigned:\n\`\`\`\nconst gravity = 9.8;\n\`\`\`\n\nReturn \`villageName\`.`;
  challenges[2].starterCode = '// Use const to declare the village name\n\n\n// Do not edit below\nreturn villageName;';
  challenges[2].expectedOutput = '__ANY_STRING__';
  challenges[2].hints = ['Use: const villageName = "MyVillage";', 'const cannot be reassigned after declaration.'];
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

    console.log('Generating 50 JS challenges...');
    const challengesToInsert = generateChallenges();

    console.log('Generating 50 real C challenges...');
    const cChallenges = [

      // ═══ WORLD 1: Village of Syntax ══════════════════════════════════════════
      {
        title: 'Hello, World!',
        slug: 'c-w1-c1', world: 1, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Every C programmer starts here.\n\nWrite a program that prints:\n```\nHello, World!\n```\n\nUse `printf` to display text to the screen.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print Hello, World!\n    \n    return 0;\n}',
        expectedOutput: 'Hello, World!\n',
        hints: ['Use: printf("Hello, World!\\n");', 'Don\'t forget the \\n at the end for a newline.'],
        solution: '#include <stdio.h>\nint main() { printf("Hello, World!\\n"); return 0; }',
      },
      {
        title: 'Declare an Integer',
        slug: 'c-w1-c2', world: 1, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare an `int` variable named `score` with the value `100` and print it.\n\nExpected output:\n```\nScore: 100\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare score and print it\n    \n    return 0;\n}',
        expectedOutput: 'Score: 100\n',
        hints: ['Declare: int score = 100;', 'Use %d in printf to print integers.'],
        solution: '#include <stdio.h>\nint main() { int score = 100; printf("Score: %d\\n", score); return 0; }',
      },
      {
        title: 'Print Your Age',
        slug: 'c-w1-c3', world: 1, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare an integer variable `age` with value `30` and print:\n```\nI am 30 years old.\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare age and print the message\n    \n    return 0;\n}',
        expectedOutput: 'I am 30 years old.\n',
        hints: ['Use printf("I am %d years old.\\n", age);'],
        solution: '#include <stdio.h>\nint main() { int age = 30; printf("I am %d years old.\\n", age); return 0; }',
      },
      {
        title: 'Float Variables',
        slug: 'c-w1-c4', world: 1, order: 4, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Declare a `float` variable `price` with value `9.99` and print it with 2 decimal places.\n\nExpected output:\n```\nPrice: 9.99\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare price and print with 2 decimal places\n    \n    return 0;\n}',
        expectedOutput: 'Price: 9.99\n',
        hints: ['Use %.2f to print a float with 2 decimal places.', 'printf("Price: %.2f\\n", price);'],
        solution: '#include <stdio.h>\nint main() { float price = 9.99; printf("Price: %.2f\\n", price); return 0; }',
      },
      {
        title: 'Character Printing',
        slug: 'c-w1-c5', world: 1, order: 5, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Declare a `char` variable `grade` with value `\'A\'` and print:\n```\nGrade: A\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare grade and print it\n    \n    return 0;\n}',
        expectedOutput: 'Grade: A\n',
        hints: ['Use %c in printf to print a character.', 'printf("Grade: %c\\n", grade);'],
        solution: '#include <stdio.h>\nint main() { char grade = \'A\'; printf("Grade: %c\\n", grade); return 0; }',
      },
      {
        title: 'Sum of Two Numbers',
        slug: 'c-w1-c6', world: 1, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare two integers `a = 15` and `b = 25`. Compute their sum and print:\n```\nSum: 40\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare a and b, calculate sum and print\n    \n    return 0;\n}',
        expectedOutput: 'Sum: 40\n',
        hints: ['int sum = a + b;', 'printf("Sum: %d\\n", sum);'],
        solution: '#include <stdio.h>\nint main() { int a=15,b=25; int sum=a+b; printf("Sum: %d\\n",sum); return 0;}',
      },
      {
        title: 'Multiple Variables',
        slug: 'c-w1-c7', world: 1, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare `int x = 5`, `int y = 3`, compute `product = x * y`, and print:\n```\nProduct: 15\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare x and y, compute and print product\n    \n    return 0;\n}',
        expectedOutput: 'Product: 15\n',
        hints: ['int product = x * y;', 'printf("Product: %d\\n", product);'],
        solution: '#include <stdio.h>\nint main(){int x=5,y=3;int p=x*y;printf("Product: %d\\n",p);return 0;}',
      },
      {
        title: 'Swap Two Values',
        slug: 'c-w1-c8', world: 1, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Start with `a = 10` and `b = 20`. Swap their values using a `temp` variable. Print:\n```\na = 20\nb = 10\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n    // Swap using temp\n    \n    printf("a = %d\\nb = %d\\n", a, b);\n    return 0;\n}',
        expectedOutput: 'a = 20\nb = 10\n',
        hints: ['int temp = a;', 'a = b; b = temp;'],
        solution: '#include <stdio.h>\nint main(){int a=10,b=20,t=a;a=b;b=t;printf("a = %d\\nb = %d\\n",a,b);return 0;}',
      },
      {
        title: 'Integer Division & Modulo',
        slug: 'c-w1-c9', world: 1, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Given `dividend = 17` and `divisor = 5`, print quotient and remainder:\n```\nQuotient: 3\nRemainder: 2\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int dividend = 17, divisor = 5;\n    // Calculate and print quotient and remainder\n    \n    return 0;\n}',
        expectedOutput: 'Quotient: 3\nRemainder: 2\n',
        hints: ['Use / for division and % for modulo.', 'int q = dividend / divisor; int r = dividend % divisor;'],
        solution: '#include <stdio.h>\nint main(){int d=17,v=5;printf("Quotient: %d\\nRemainder: %d\\n",d/v,d%v);return 0;}',
      },
      {
        title: 'Boss: Unit Converter',
        slug: 'c-w1-boss', world: 1, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nConvert `5` kilometers to meters and centimeters:\n- 1 km = 1000 m\n- 1 km = 100000 cm\n\nPrint:\n```\n5 km = 5000 m\n5 km = 500000 cm\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int km = 5;\n    // Calculate and print conversions\n    \n    return 0;\n}',
        expectedOutput: '5 km = 5000 m\n5 km = 500000 cm\n',
        hints: ['int meters = km * 1000;', 'int cm = km * 100000;'],
        solution: '#include <stdio.h>\nint main(){int k=5;printf("%d km = %d m\\n%d km = %d cm\\n",k,k*1000,k,k*100000);return 0;}',
      },

      // ═══ WORLD 2: Type Caverns ═══════════════════════════════════════════════
      {
        title: 'Print sizeof int',
        slug: 'c-w2-c1', world: 2, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Print the size of an `int` in bytes.\n\nExpected output:\n```\nSize of int: 4\n```\n\nUse `sizeof(int)`.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print size of int\n    \n    return 0;\n}',
        expectedOutput: 'Size of int: 4\n',
        hints: ['printf("Size of int: %zu\\n", sizeof(int));', 'sizeof returns size_t, use %zu.'],
        solution: '#include <stdio.h>\nint main(){printf("Size of int: %zu\\n",sizeof(int));return 0;}',
      },
      {
        title: 'Size of double',
        slug: 'c-w2-c2', world: 2, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Print the size of a `double` in bytes.\n\nExpected output:\n```\nSize of double: 8\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print size of double\n    \n    return 0;\n}',
        expectedOutput: 'Size of double: 8\n',
        hints: ['printf("Size of double: %zu\\n", sizeof(double));'],
        solution: '#include <stdio.h>\nint main(){printf("Size of double: %zu\\n",sizeof(double));return 0;}',
      },
      {
        title: 'Explicit Type Cast',
        slug: 'c-w2-c3', world: 2, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Divide `7` by `2` and store the result as a `float`. Print with 1 decimal.\n\nExpected output:\n```\nResult: 3.5\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    // Cast and divide\n    \n    return 0;\n}',
        expectedOutput: 'Result: 3.5\n',
        hints: ['float result = (float)a / b;', 'printf("Result: %.1f\\n", result);'],
        solution: '#include <stdio.h>\nint main(){int a=7,b=2;float r=(float)a/b;printf("Result: %.1f\\n",r);return 0;}',
      },
      {
        title: 'Char to ASCII',
        slug: 'c-w2-c4', world: 2, order: 4, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Print the ASCII value of the character `\'A\'`.\n\nExpected output:\n```\nASCII of A: 65\n```\n\nHint: a `char` can be printed as an integer with `%d`.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    char c = \'A\';\n    // Print ASCII value\n    \n    return 0;\n}',
        expectedOutput: 'ASCII of A: 65\n',
        hints: ['printf("ASCII of A: %d\\n", c);', 'A char is internally just an integer.'],
        solution: '#include <stdio.h>\nint main(){char c=\'A\';printf("ASCII of A: %d\\n",c);return 0;}',
      },
      {
        title: 'Implicit Promotion',
        slug: 'c-w2-c5', world: 2, order: 5, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Add `int x = 5` and `double y = 2.5`. Store in a `double result`. Print with 1 decimal:\n```\nResult: 7.5\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int x = 5;\n    double y = 2.5;\n    // Add and print\n    \n    return 0;\n}',
        expectedOutput: 'Result: 7.5\n',
        hints: ['double result = x + y;', 'printf("Result: %.1f\\n", result);'],
        solution: '#include <stdio.h>\nint main(){int x=5;double y=2.5;double r=x+y;printf("Result: %.1f\\n",r);return 0;}',
      },
      {
        title: 'Overflow Detection',
        slug: 'c-w2-c6', world: 2, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare `unsigned char x = 255`. Increment it by 1. What value does it hold?\n\nPrint:\n```\nValue: 0\n```\n\nThis demonstrates integer overflow in C!',
        starterCode: '#include <stdio.h>\n\nint main() {\n    unsigned char x = 255;\n    x++;\n    printf("Value: %d\\n", x);\n    return 0;\n}',
        expectedOutput: 'Value: 0\n',
        hints: ['unsigned char wraps around: 255 + 1 = 0', 'Just run the code as-is!'],
        solution: '#include <stdio.h>\nint main(){unsigned char x=255;x++;printf("Value: %d\\n",x);return 0;}',
      },
      {
        title: 'Min and Max of int',
        slug: 'c-w2-c7', world: 2, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Use `<limits.h>` to print the minimum and maximum values of an `int`.\n\nExpected output:\n```\nMin: -2147483648\nMax: 2147483647\n```',
        starterCode: '#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    // Print INT_MIN and INT_MAX\n    \n    return 0;\n}',
        expectedOutput: 'Min: -2147483648\nMax: 2147483647\n',
        hints: ['printf("Min: %d\\n", INT_MIN);', 'printf("Max: %d\\n", INT_MAX);'],
        solution: '#include <stdio.h>\n#include <limits.h>\nint main(){printf("Min: %d\\nMax: %d\\n",INT_MIN,INT_MAX);return 0;}',
      },
      {
        title: 'Boolean Logic',
        slug: 'c-w2-c8', world: 2, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'In C, `0` is false and any non-zero is true. Include `<stdbool.h>` and:\n1. Declare `bool flag = true;`\n2. Print its integer value.\n\nExpected output:\n```\nFlag: 1\n```',
        starterCode: '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    bool flag = true;\n    printf("Flag: %d\\n", flag);\n    return 0;\n}',
        expectedOutput: 'Flag: 1\n',
        hints: ['true equals 1 when printed as an integer.', 'Just run the starter code!'],
        solution: '#include <stdio.h>\n#include <stdbool.h>\nint main(){bool f=true;printf("Flag: %d\\n",f);return 0;}',
      },
      {
        title: 'Celsius to Fahrenheit',
        slug: 'c-w2-c9', world: 2, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Convert `100` degrees Celsius to Fahrenheit.\n\nFormula: `F = (C * 9/5) + 32`\n\nExpected output:\n```\n100 C = 212.0 F\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    float c = 100.0;\n    // Calculate Fahrenheit\n    \n    return 0;\n}',
        expectedOutput: '100 C = 212.0 F\n',
        hints: ['float f = (c * 9.0/5.0) + 32;', 'printf("100 C = %.1f F\\n", f);'],
        solution: '#include <stdio.h>\nint main(){float c=100.0,f=(c*9.0/5.0)+32;printf("100 C = %.1f F\\n",f);return 0;}',
      },
      {
        title: 'Boss: Size Explorer',
        slug: 'c-w2-boss', world: 2, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nPrint the sizes of all 4 primitive types:\n```\nchar: 1\nint: 4\nfloat: 4\ndouble: 8\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print sizes of char, int, float, double\n    \n    return 0;\n}',
        expectedOutput: 'char: 1\nint: 4\nfloat: 4\ndouble: 8\n',
        hints: ['Use sizeof() for each type.', 'Use %zu as the format specifier for sizeof.'],
        solution: '#include <stdio.h>\nint main(){printf("char: %zu\\nint: %zu\\nfloat: %zu\\ndouble: %zu\\n",sizeof(char),sizeof(int),sizeof(float),sizeof(double));return 0;}',
      },

      // ═══ WORLD 3: Pointer Peaks ══════════════════════════════════════════════
      {
        title: 'Your First Pointer',
        slug: 'c-w3-c1', world: 3, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int x = 42`. Create a pointer `ptr` that points to it. Print the value via the pointer.\n\nExpected output:\n```\nValue: 42\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int x = 42;\n    int *ptr = &x;\n    // Print value via pointer\n    \n    return 0;\n}',
        expectedOutput: 'Value: 42\n',
        hints: ['Use *ptr to dereference the pointer.', 'printf("Value: %d\\n", *ptr);'],
        solution: '#include <stdio.h>\nint main(){int x=42;int *p=&x;printf("Value: %d\\n",*p);return 0;}',
      },
      {
        title: 'Modify via Pointer',
        slug: 'c-w3-c2', world: 3, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int score = 10`. Use a pointer to change its value to `99`. Print the new value.\n\nExpected output:\n```\nNew score: 99\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int score = 10;\n    int *ptr = &score;\n    // Modify score via ptr\n    \n    printf("New score: %d\\n", score);\n    return 0;\n}',
        expectedOutput: 'New score: 99\n',
        hints: ['*ptr = 99; assigns 99 to the value ptr points to.'],
        solution: '#include <stdio.h>\nint main(){int s=10;int *p=&s;*p=99;printf("New score: %d\\n",s);return 0;}',
      },
      {
        title: 'Pointer Arithmetic',
        slug: 'c-w3-c3', world: 3, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int arr[] = {10, 20, 30}`. Use a pointer to print the second element.\n\nExpected output:\n```\nSecond: 20\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int *ptr = arr;\n    // Print second element via pointer arithmetic\n    \n    return 0;\n}',
        expectedOutput: 'Second: 20\n',
        hints: ['ptr + 1 points to the next int.', 'printf("Second: %d\\n", *(ptr + 1));'],
        solution: '#include <stdio.h>\nint main(){int a[]={10,20,30};int *p=a;printf("Second: %d\\n",*(p+1));return 0;}',
      },
      {
        title: 'Pointer to Pointer',
        slug: 'c-w3-c4', world: 3, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare `int val = 7`. Create a pointer-to-pointer `int **pp`. Use it to print the value.\n\nExpected output:\n```\nValue: 7\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int val = 7;\n    int *ptr = &val;\n    int **pp = &ptr;\n    // Print via double pointer\n    \n    return 0;\n}',
        expectedOutput: 'Value: 7\n',
        hints: ['**pp dereferences twice: pointer-to-pointer → pointer → value.', 'printf("Value: %d\\n", **pp);'],
        solution: '#include <stdio.h>\nint main(){int v=7;int *p=&v;int **pp=&p;printf("Value: %d\\n",**pp);return 0;}',
      },
      {
        title: 'NULL Pointer Check',
        slug: 'c-w3-c5', world: 3, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare a NULL pointer `int *ptr = NULL`. Check if it is NULL and print:\n```\nPointer is null\n```\n\nThis is safe programming practice!',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int *ptr = NULL;\n    // Check if ptr is NULL\n    \n    return 0;\n}',
        expectedOutput: 'Pointer is null\n',
        hints: ['if (ptr == NULL) { printf(...); }'],
        solution: '#include <stdio.h>\nint main(){int *p=NULL;if(p==NULL)printf("Pointer is null\\n");return 0;}',
      },
      {
        title: 'Array via Pointer',
        slug: 'c-w3-c6', world: 3, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Given `int nums[] = {5, 10, 15, 20}`, use a pointer loop to print all elements.\n\nExpected output:\n```\n5 10 15 20\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int nums[] = {5, 10, 15, 20};\n    int *ptr = nums;\n    // Loop and print using pointer\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '5 10 15 20\n',
        hints: ['for (int i = 0; i < 4; i++) printf("%d ", *(ptr + i));', 'Note: trailing newline comes from the printf("\\n") already in the starter code.'],
        solution: '#include <stdio.h>\nint main(){int n[]={5,10,15,20};int *p=n;for(int i=0;i<4;i++)printf("%d ",*(p+i));printf("\\n");return 0;}',
      },
      {
        title: 'Pointer Increment',
        slug: 'c-w3-c7', world: 3, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Start a pointer at `arr[0]` where `arr = {100, 200, 300}`. Increment the pointer twice and print the value it now points to.\n\nExpected output:\n```\nValue: 300\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[] = {100, 200, 300};\n    int *ptr = arr;\n    // Increment ptr twice\n    \n    printf("Value: %d\\n", *ptr);\n    return 0;\n}',
        expectedOutput: 'Value: 300\n',
        hints: ['ptr++; ptr++;', 'After two increments, ptr points to arr[2].'],
        solution: '#include <stdio.h>\nint main(){int a[]={100,200,300};int *p=a;p++;p++;printf("Value: %d\\n",*p);return 0;}',
      },
      {
        title: 'Swap via Pointers',
        slug: 'c-w3-c8', world: 3, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Write a swap using pointer dereferencing. Start with `a = 5`, `b = 9`. Swap and print:\n```\na=9 b=5\n```',
        starterCode: '#include <stdio.h>\n\nvoid swap(int *x, int *y) {\n    // Swap via pointers\n}\n\nint main() {\n    int a = 5, b = 9;\n    swap(&a, &b);\n    printf("a=%d b=%d\\n", a, b);\n    return 0;\n}',
        expectedOutput: 'a=9 b=5\n',
        hints: ['int temp = *x; *x = *y; *y = temp;'],
        solution: '#include <stdio.h>\nvoid swap(int *x,int *y){int t=*x;*x=*y;*y=t;}\nint main(){int a=5,b=9;swap(&a,&b);printf("a=%d b=%d\\n",a,b);return 0;}',
      },
      {
        title: 'Pointer Difference',
        slug: 'c-w3-c9', world: 3, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Given `int arr[5]`, print the difference between the pointer to the last and first elements.\n\nExpected output:\n```\nDiff: 4\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[5] = {1,2,3,4,5};\n    int *first = arr;\n    int *last = arr + 4;\n    // Print the difference\n    \n    return 0;\n}',
        expectedOutput: 'Diff: 4\n',
        hints: ['printf("Diff: %td\\n", last - first);', 'Pointer subtraction gives element count, not bytes.'],
        solution: '#include <stdio.h>\nint main(){int a[5]={1,2,3,4,5};int *f=a,*l=a+4;printf("Diff: %td\\n",l-f);return 0;}',
      },
      {
        title: 'Boss: Find Max via Pointer',
        slug: 'c-w3-boss', world: 3, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nGiven `int nums[] = {3, 67, 12, 89, 45}`, use a pointer to find the maximum value.\n\nExpected output:\n```\nMax: 89\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int nums[] = {3, 67, 12, 89, 45};\n    int *ptr = nums;\n    int max = *ptr;\n    // Loop to find max using pointer\n    \n    printf("Max: %d\\n", max);\n    return 0;\n}',
        expectedOutput: 'Max: 89\n',
        hints: ['for (int i = 1; i < 5; i++) if (*(ptr+i) > max) max = *(ptr+i);'],
        solution: '#include <stdio.h>\nint main(){int n[]={3,67,12,89,45};int *p=n,m=*p;for(int i=1;i<5;i++)if(*(p+i)>m)m=*(p+i);printf("Max: %d\\n",m);return 0;}',
      },

      // ═══ WORLD 4: Struct Citadel ═════════════════════════════════════════════
      {
        title: 'Your First Struct',
        slug: 'c-w4-c1', world: 4, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Define a `struct Point` with `int x` and `int y`. Create a point at `(3, 7)` and print:\n```\nPoint: (3, 7)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point {\n    int x, y;\n};\n\nint main() {\n    struct Point p;\n    p.x = 3; p.y = 7;\n    printf("Point: (%d, %d)\\n", p.x, p.y);\n    return 0;\n}',
        expectedOutput: 'Point: (3, 7)\n',
        hints: ['The starter code is almost complete — just run it!'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};int main(){struct Point p;p.x=3;p.y=7;printf("Point: (%d, %d)\\n",p.x,p.y);return 0;}',
      },
      {
        title: 'Struct Initialization',
        slug: 'c-w4-c2', world: 4, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Define `struct Student` with `name[20]` (char array) and `int age`. Initialize it and print:\n```\nName: Alice Age: 20\n```',
        starterCode: '#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[20];\n    int age;\n};\n\nint main() {\n    struct Student s;\n    strcpy(s.name, "Alice");\n    s.age = 20;\n    printf("Name: %s Age: %d\\n", s.name, s.age);\n    return 0;\n}',
        expectedOutput: 'Name: Alice Age: 20\n',
        hints: ['The starter code is complete — just run it!'],
        solution: '#include <stdio.h>\n#include <string.h>\nstruct Student{char name[20];int age;};int main(){struct Student s;strcpy(s.name,"Alice");s.age=20;printf("Name: %s Age: %d\\n",s.name,s.age);return 0;}',
      },
      {
        title: 'Struct with typedef',
        slug: 'c-w4-c3', world: 4, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Use `typedef` to create a `Rectangle` struct with `int width` and `int height`. Compute area and print:\n```\nArea: 24\n```\nUse `width = 6`, `height = 4`.',
        starterCode: '#include <stdio.h>\n\ntypedef struct {\n    int width, height;\n} Rectangle;\n\nint main() {\n    Rectangle r;\n    r.width = 6; r.height = 4;\n    // Calculate and print area\n    \n    return 0;\n}',
        expectedOutput: 'Area: 24\n',
        hints: ['int area = r.width * r.height;', 'printf("Area: %d\\n", area);'],
        solution: '#include <stdio.h>\ntypedef struct{int width,height;}Rectangle;int main(){Rectangle r;r.width=6;r.height=4;printf("Area: %d\\n",r.width*r.height);return 0;}',
      },
      {
        title: 'Pointer to Struct',
        slug: 'c-w4-c4', world: 4, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create a `struct Car` with `int speed`. Use a pointer to set speed to `120` and print:\n```\nSpeed: 120\n```\n\nUse the arrow operator `->` to access via pointer.',
        starterCode: '#include <stdio.h>\n\nstruct Car { int speed; };\n\nint main() {\n    struct Car c;\n    struct Car *ptr = &c;\n    // Set speed via pointer and print\n    \n    return 0;\n}',
        expectedOutput: 'Speed: 120\n',
        hints: ['ptr->speed = 120;', 'printf("Speed: %d\\n", ptr->speed);'],
        solution: '#include <stdio.h>\nstruct Car{int speed;};int main(){struct Car c;struct Car *p=&c;p->speed=120;printf("Speed: %d\\n",p->speed);return 0;}',
      },
      {
        title: 'Array of Structs',
        slug: 'c-w4-c5', world: 4, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create an array of 3 `struct Point`s: `(1,2)`, `(3,4)`, `(5,6)`. Print all:\n```\n(1,2) (3,4) (5,6)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\nint main() {\n    struct Point pts[3] = {{1,2},{3,4},{5,6}};\n    // Print all points\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '(1,2) (3,4) (5,6)\n',
        hints: ['for (int i = 0; i < 3; i++) printf("(%d,%d) ", pts[i].x, pts[i].y);'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};int main(){struct Point p[3]={{1,2},{3,4},{5,6}};for(int i=0;i<3;i++)printf("(%d,%d) ",p[i].x,p[i].y);printf("\\n");return 0;}',
      },
      {
        title: 'Nested Structs',
        slug: 'c-w4-c6', world: 4, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create a `struct Circle` with center `struct Point` and `int radius`. Print:\n```\nCenter: (2,3) Radius: 5\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\nstruct Circle { struct Point center; int radius; };\n\nint main() {\n    struct Circle c = {{2,3}, 5};\n    printf("Center: (%d,%d) Radius: %d\\n", c.center.x, c.center.y, c.radius);\n    return 0;\n}',
        expectedOutput: 'Center: (2,3) Radius: 5\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};struct Circle{struct Point c;int r;};int main(){struct Circle ci={{2,3},5};printf("Center: (%d,%d) Radius: %d\\n",ci.c.x,ci.c.y,ci.r);return 0;}',
      },
      {
        title: 'Struct Function Param',
        slug: 'c-w4-c7', world: 4, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Write a function `printPoint(struct Point p)` that prints a point. Call it with `(4, 9)`.\n\nExpected output:\n```\nPoint: (4, 9)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\nvoid printPoint(struct Point p) {\n    // Print the point\n}\n\nint main() {\n    struct Point p = {4, 9};\n    printPoint(p);\n    return 0;\n}',
        expectedOutput: 'Point: (4, 9)\n',
        hints: ['printf("Point: (%d, %d)\\n", p.x, p.y);'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};void printPoint(struct Point p){printf("Point: (%d, %d)\\n",p.x,p.y);}int main(){struct Point p={4,9};printPoint(p);return 0;}',
      },
      {
        title: 'Enum Basics',
        slug: 'c-w4-c8', world: 4, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Define an enum `Day` with values `MON=1, TUE, WED`. Print the integer value of `WED`.\n\nExpected output:\n```\nWednesday: 3\n```',
        starterCode: '#include <stdio.h>\n\nenum Day { MON=1, TUE, WED };\n\nint main() {\n    // Print value of WED\n    \n    return 0;\n}',
        expectedOutput: 'Wednesday: 3\n',
        hints: ['printf("Wednesday: %d\\n", WED);', 'Enums auto-increment: MON=1, TUE=2, WED=3.'],
        solution: '#include <stdio.h>\nenum Day{MON=1,TUE,WED};int main(){printf("Wednesday: %d\\n",WED);return 0;}',
      },
      {
        title: 'Struct Size',
        slug: 'c-w4-c9', world: 4, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Print the total size in bytes of this struct:\n```c\nstruct Data { char a; int b; };\n```\nExpected output:\n```\nSize: 8\n```\n(Due to struct padding, `char` is padded to align with `int`.)',
        starterCode: '#include <stdio.h>\n\nstruct Data { char a; int b; };\n\nint main() {\n    printf("Size: %zu\\n", sizeof(struct Data));\n    return 0;\n}',
        expectedOutput: 'Size: 8\n',
        hints: ['sizeof(struct Data) accounts for padding bytes.', 'Just run the starter code!'],
        solution: '#include <stdio.h>\nstruct Data{char a;int b;};int main(){printf("Size: %zu\\n",sizeof(struct Data));return 0;}',
      },
      {
        title: 'Boss: Student Records',
        slug: 'c-w4-boss', world: 4, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nDefine a `struct Student` with `name[20]` and `int marks`. Create 2 students and print the one with higher marks:\n\nUse: Alice=85, Bob=92.\n\nExpected output:\n```\nTopper: Bob\n```',
        starterCode: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct { char name[20]; int marks; } Student;\n\nint main() {\n    Student s1, s2;\n    strcpy(s1.name, "Alice"); s1.marks = 85;\n    strcpy(s2.name, "Bob"); s2.marks = 92;\n    // Print the student with higher marks\n    \n    return 0;\n}',
        expectedOutput: 'Topper: Bob\n',
        hints: ['if (s1.marks > s2.marks) printf("Topper: %s\\n", s1.name);', 'else printf("Topper: %s\\n", s2.name);'],
        solution: '#include <stdio.h>\n#include <string.h>\ntypedef struct{char name[20];int marks;}Student;int main(){Student s1,s2;strcpy(s1.name,"Alice");s1.marks=85;strcpy(s2.name,"Bob");s2.marks=92;if(s1.marks>s2.marks)printf("Topper: %s\\n",s1.name);else printf("Topper: %s\\n",s2.name);return 0;}',
      },

      // ═══ WORLD 5: Allocation Abyss ═══════════════════════════════════════════
      {
        title: 'malloc Basics',
        slug: 'c-w5-c1', world: 5, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Allocate memory for one `int` using `malloc`. Store the value `42` and print it. Free the memory.\n\nExpected output:\n```\nValue: 42\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = malloc(sizeof(int));\n    *ptr = 42;\n    printf("Value: %d\\n", *ptr);\n    free(ptr);\n    return 0;\n}',
        expectedOutput: 'Value: 42\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *p=malloc(sizeof(int));*p=42;printf("Value: %d\\n",*p);free(p);return 0;}',
      },
      {
        title: 'Dynamic Array',
        slug: 'c-w5-c2', world: 5, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Allocate a dynamic array of 3 ints with `malloc`. Fill with `{10, 20, 30}` and print each.\n\nExpected output:\n```\n10 20 30\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(3 * sizeof(int));\n    arr[0]=10; arr[1]=20; arr[2]=30;\n    // Print all elements\n    \n    free(arr);\n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '10 20 30\n',
        hints: ['for (int i = 0; i < 3; i++) printf("%d ", arr[i]);'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(3*sizeof(int));a[0]=10;a[1]=20;a[2]=30;for(int i=0;i<3;i++)printf("%d ",a[i]);free(a);printf("\\n");return 0;}',
      },
      {
        title: 'calloc vs malloc',
        slug: 'c-w5-c3', world: 5, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Use `calloc` to allocate 4 ints. Print the first element (it should be 0 because calloc zeroes memory).\n\nExpected output:\n```\nFirst element: 0\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = calloc(4, sizeof(int));\n    printf("First element: %d\\n", arr[0]);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'First element: 0\n',
        hints: ['calloc initializes all allocated memory to zero.', 'Run the starter code — it\'s already complete!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=calloc(4,sizeof(int));printf("First element: %d\\n",a[0]);free(a);return 0;}',
      },
      {
        title: 'realloc Array',
        slug: 'c-w5-c4', world: 5, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Allocate space for 2 ints. Use `realloc` to expand to 3. Add a third value and print all three.\n\nExpected output:\n```\n1 2 3\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(2 * sizeof(int));\n    arr[0] = 1; arr[1] = 2;\n    arr = realloc(arr, 3 * sizeof(int));\n    arr[2] = 3;\n    // Print all elements\n    \n    free(arr);\n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '1 2 3\n',
        hints: ['for (int i = 0; i < 3; i++) printf("%d ", arr[i]);'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(2*sizeof(int));a[0]=1;a[1]=2;a=realloc(a,3*sizeof(int));a[2]=3;for(int i=0;i<3;i++)printf("%d ",a[i]);free(a);printf("\\n");return 0;}',
      },
      {
        title: 'NULL Check after malloc',
        slug: 'c-w5-c5', world: 5, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Always check if `malloc` succeeded. If `ptr` is not NULL, print `Allocated`. Else print `Failed`.\n\nExpected output:\n```\nAllocated\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = malloc(sizeof(int));\n    if (ptr != NULL) {\n        printf("Allocated\\n");\n    } else {\n        printf("Failed\\n");\n    }\n    free(ptr);\n    return 0;\n}',
        expectedOutput: 'Allocated\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *p=malloc(sizeof(int));if(p!=NULL)printf("Allocated\\n");else printf("Failed\\n");free(p);return 0;}',
      },
      {
        title: 'Dynamic Struct Allocation',
        slug: 'c-w5-c6', world: 5, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Use `malloc` to allocate a `struct Point`. Set `x=7, y=3` via pointer and print:\n```\n(7, 3)\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct Point { int x, y; };\n\nint main() {\n    struct Point *p = malloc(sizeof(struct Point));\n    p->x = 7; p->y = 3;\n    printf("(%d, %d)\\n", p->x, p->y);\n    free(p);\n    return 0;\n}',
        expectedOutput: '(7, 3)\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nstruct Point{int x,y;};int main(){struct Point *p=malloc(sizeof(struct Point));p->x=7;p->y=3;printf("(%d, %d)\\n",p->x,p->y);free(p);return 0;}',
      },
      {
        title: 'Sum of Dynamic Array',
        slug: 'c-w5-c7', world: 5, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Dynamically allocate an array of 5 ints: `{2, 4, 6, 8, 10}`. Compute and print the sum.\n\nExpected output:\n```\nSum: 30\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    int vals[] = {2,4,6,8,10};\n    for (int i=0; i<5; i++) arr[i] = vals[i];\n    // Calculate sum\n    int sum = 0;\n    \n    printf("Sum: %d\\n", sum);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'Sum: 30\n',
        hints: ['for (int i = 0; i < 5; i++) sum += arr[i];'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(5*sizeof(int));int v[]={2,4,6,8,10};for(int i=0;i<5;i++)a[i]=v[i];int s=0;for(int i=0;i<5;i++)s+=a[i];printf("Sum: %d\\n",s);free(a);return 0;}',
      },
      {
        title: 'String on Heap',
        slug: 'c-w5-c8', world: 5, order: 8, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Dynamically allocate space for a string `"Heap"` (5 chars + null). Copy with `strcpy` and print it.\n\nExpected output:\n```\nHello: Heap\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    char *str = malloc(5 * sizeof(char));\n    strcpy(str, "Heap");\n    printf("Hello: %s\\n", str);\n    free(str);\n    return 0;\n}',
        expectedOutput: 'Hello: Heap\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\nint main(){char *s=malloc(5);strcpy(s,"Heap");printf("Hello: %s\\n",s);free(s);return 0;}',
      },
      {
        title: 'Count Positives',
        slug: 'c-w5-c9', world: 5, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Dynamically allocate `{-1, 3, -5, 7, 2}`. Count and print how many are positive.\n\nExpected output:\n```\nPositives: 3\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    int vals[] = {-1,3,-5,7,2};\n    for (int i=0;i<5;i++) arr[i]=vals[i];\n    int count = 0;\n    // Count positives\n    \n    printf("Positives: %d\\n", count);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'Positives: 3\n',
        hints: ['for (int i=0;i<5;i++) if(arr[i]>0) count++;'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(5*sizeof(int));int v[]={-1,3,-5,7,2};for(int i=0;i<5;i++)a[i]=v[i];int c=0;for(int i=0;i<5;i++)if(a[i]>0)c++;printf("Positives: %d\\n",c);free(a);return 0;}',
      },
      {
        title: 'Boss: Dynamic Gradebook',
        slug: 'c-w5-boss', world: 5, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nDynamically allocate an array of 4 scores: `{88, 73, 95, 61}`. Compute and print the average with 1 decimal.\n\nExpected output:\n```\nAverage: 79.2\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 4;\n    int *scores = malloc(n * sizeof(int));\n    scores[0]=88; scores[1]=73; scores[2]=95; scores[3]=61;\n    // Compute and print average\n    \n    free(scores);\n    return 0;\n}',
        expectedOutput: 'Average: 79.2\n',
        hints: ['float sum = 0; for (int i=0;i<n;i++) sum += scores[i];', 'printf("Average: %.1f\\n", sum/n);'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int n=4;int *s=malloc(n*sizeof(int));s[0]=88;s[1]=73;s[2]=95;s[3]=61;float sum=0;for(int i=0;i<n;i++)sum+=s[i];printf("Average: %.1f\\n",sum/n);free(s);return 0;}',
      },
    ];

    const allChallenges = [...challengesToInsert, ...cChallenges];
    const bulkOps = allChallenges.map(c => ({
      updateOne: {
        filter: { slug: c.slug },
        update: { $set: c },
        upsert: true
      }
    }));
    await Challenge.bulkWrite(bulkOps);
    
    console.log('Successfully seeded 100 challenges (50 JS + 50 real C) without wiping progress!');

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
