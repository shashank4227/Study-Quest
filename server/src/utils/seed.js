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

  // World 3: Loop Mountains (Indexes 20-29)
  // Challenge 1
  challenges[20].title = 'Sum from 1 to 5';
  challenges[20].description = 'Calculate the sum of numbers from 1 to 5 using a `while` loop, and store it in `sum`.';
  challenges[20].starterCode = '// Declare sum and write while loop\nlet sum = 0;\nlet i = 1;\n\n\n// Do not edit below\nreturn sum;';
  challenges[20].expectedOutput = '15';
  challenges[20].hints = ['Inside the loop, add i to sum and increment i.', 'Loop condition: while (i <= 5)'];
  challenges[20].xpReward = 50;
  challenges[20].testCases = [];
  challenges[20].validationRules = [
    { type: 'includes', condition: 'while', message: 'You must use a while loop.' }
  ];

  // Challenge 2
  challenges[21].title = 'Factorial of 5';
  challenges[21].description = 'Calculate the factorial of 5 (5 * 4 * 3 * 2 * 1) using a `for` loop, and store it in `factorial`.';
  challenges[21].starterCode = '// Declare factorial and write for loop\nlet factorial = 1;\n\n\n// Do not edit below\nreturn factorial;';
  challenges[21].expectedOutput = '120';
  challenges[21].hints = ['Loop from 1 to 5 (or 2 to 5) and multiply factorial by the loop variable.', 'Use: for (let i = 1; i <= 5; i++)'];
  challenges[21].xpReward = 50;
  challenges[21].testCases = [];
  challenges[21].validationRules = [
    { type: 'includes', condition: 'for', message: 'You must use a for loop.' }
  ];

  // Challenge 3
  challenges[22].title = 'Count Down';
  challenges[22].description = 'Write a loop that counts down from 5 to 1. Concatenate each number followed by a space into the string variable `countStr`.\n\nExpected output: `"5 4 3 2 1 "`';
  challenges[22].starterCode = '// Declare countStr and write loop\nlet countStr = "";\n\n\n// Do not edit below\nreturn countStr;';
  challenges[22].expectedOutput = '5 4 3 2 1 ';
  challenges[22].hints = ['Use a loop running from 5 down to 1: for (let i = 5; i >= 1; i--)', 'Inside: countStr += i + " ";'];
  challenges[22].xpReward = 50;
  challenges[22].testCases = [];

  // Challenge 4
  challenges[23].title = 'Sum of Evens';
  challenges[23].description = 'Given a limit `maxNum`, find the sum of all even numbers from 1 to `maxNum` (inclusive) and store it in `evenSum`.';
  challenges[23].starterCode = '// Variable `maxNum` is provided\n// Declare evenSum and write your loop\n\n\n// Do not edit below\nreturn evenSum;';
  challenges[23].testCases = [
    { input: '{"maxNum": 10}', expectedOutput: '30' },
    { input: '{"maxNum": 5}', expectedOutput: '6' }
  ];
  challenges[23].hints = ['Check if i % 2 === 0 inside your loop.', 'Add the even values to evenSum.'];
  challenges[23].xpReward = 100;

  // Challenge 5
  challenges[24].title = 'Skip Fours';
  challenges[24].description = 'Use a loop to sum numbers from 1 to 5, but use the `continue` statement to skip the number `4`. Store the result in `totalSum`.\n\nExpected output: `11`';
  challenges[24].starterCode = '// Declare totalSum and write loop with continue\n\n\n// Do not edit below\nreturn totalSum;';
  challenges[24].expectedOutput = '11';
  challenges[24].hints = ['Inside the loop: if (i === 4) continue;', 'Ensure totalSum accumulates all other values.'];
  challenges[24].xpReward = 100;
  challenges[24].validationRules = [
    { type: 'includes', condition: 'continue', message: 'You must use the continue statement.' }
  ];

  // Challenge 6
  challenges[25].title = 'Break the Loop';
  challenges[25].description = 'Write a loop from 1 to 100, but use a `break` statement to stop when the sum reaches or exceeds 50. Store the final sum in `breakSum`.\n\nExpected output: `55`';
  challenges[25].starterCode = '// Declare breakSum and write loop with break\n\n\n// Do not edit below\nreturn breakSum;';
  challenges[25].expectedOutput = '55';
  challenges[25].hints = ['Check if sum >= 50, then break.', 'Expected result is 55 (sum of 1 to 10).'];
  challenges[25].xpReward = 100;
  challenges[25].validationRules = [
    { type: 'includes', condition: 'break', message: 'You must use the break statement.' }
  ];

  // Challenge 7
  challenges[26].title = 'Count Characters';
  challenges[26].description = 'Given a string `text` and a character `charToCount`, loop through the string to count how many times that character appears. Store the result in `occurrences`.';
  challenges[26].starterCode = '// Variables `text` and `charToCount` are provided\n// Declare occurrences and count the character\n\n\n// Do not edit below\nreturn occurrences;';
  challenges[26].testCases = [
    { input: '{"text": "banana", "charToCount": "a"}', expectedOutput: '3' },
    { input: '{"text": "explorer", "charToCount": "e"}', expectedOutput: '2' }
  ];
  challenges[26].hints = ['Use a for loop: for(let i = 0; i < text.length; i++)', 'Check if text[i] === charToCount.'];
  challenges[26].xpReward = 100;

  // Challenge 8
  challenges[27].title = 'Repeat String';
  challenges[27].description = 'Given a string `str` and a number `times`, repeat the string that many times. Store the result in `repeatedText`.';
  challenges[27].starterCode = '// Variables `str` and `times` are provided\n// Declare repeatedText and loop\n\n\n// Do not edit below\nreturn repeatedText;';
  challenges[27].testCases = [
    { input: '{"str": "Hi", "times": 3}', expectedOutput: '"HiHiHi"' },
    { input: '{"str": "*", "times": 5}', expectedOutput: '"*****"' }
  ];
  challenges[27].hints = ['Initialize: let repeatedText = "";', 'Loop `times` times, adding `str` to `repeatedText` in each iteration.'];
  challenges[27].xpReward = 200;

  // Challenge 9
  challenges[28].title = 'Print Grid';
  challenges[28].description = 'Generate a grid of size `rows` by `cols` of hashes (`#`). Use nested loops to build the grid with newlines (`\\n`) at the end of each row. Store in `grid`.';
  challenges[28].starterCode = '// Variables `rows` and `cols` are provided\n// Declare grid and write nested loops\n\n\n// Do not edit below\nreturn grid;';
  challenges[28].testCases = [
    { input: '{"rows": 2, "cols": 3}', expectedOutput: '"###\\n###\\n"' },
    { input: '{"rows": 3, "cols": 1}', expectedOutput: '"#\\n#\\n#\\n"' }
  ];
  challenges[28].hints = ['Outer loop for rows, inner loop for cols.', 'Add "\\n" in the outer loop after the inner loop completes.'];
  challenges[28].xpReward = 200;

  // Challenge 10 (Boss)
  challenges[29].title = 'Boss Battle: Number Guessing Game';
  challenges[29].description = 'Write a loop simulating guesses. Given a `target` number and an array of `guesses`, loop through the guesses. If a guess matches `target`, stop the loop and return the number of attempts it took (1-indexed). If no guess matches, return -1. Store in `attempts`.';
  challenges[29].starterCode = '// Variables `target` and `guesses` (array) are provided\n// Declare attempts and write loop\n\n\n// Do not edit below\nreturn attempts;';
  challenges[29].testCases = [
    { input: '{"target": 42, "guesses": [10, 20, 42, 50]}', expectedOutput: '3' },
    { input: '{"target": 7, "guesses": [1, 2, 3]}', expectedOutput: '-1' }
  ];
  challenges[29].hints = ['Loop: for (let i = 0; i < guesses.length; i++)', 'Check if guesses[i] === target, if so set attempts to i + 1 and break.'];
  challenges[29].xpReward = 500;
  challenges[29].bossBattle = true;

  // World 4: Function Kingdom (Indexes 30-39)
  // Challenge 1
  challenges[30].title = 'Say Hello';
  challenges[30].description = 'Write a function named `sayHello` that takes a name (string) and returns a greeting string: `"Hello, " + name + "!"`.';
  challenges[30].starterCode = '// Write your sayHello function here\n\n\n// Do not edit below\nreturn sayHello(nameInput);';
  challenges[30].testCases = [
    { input: '{"nameInput": "Zara"}', expectedOutput: '"Hello, Zara!"' },
    { input: '{"nameInput": "Explorer"}', expectedOutput: '"Hello, Explorer!"' }
  ];
  challenges[30].hints = ['Use syntax: function sayHello(name) { return "Hello, " + name + "!"; }'];
  challenges[30].xpReward = 50;
  challenges[30].validationRules = [
    { type: 'regex', condition: 'function\\s+sayHello\\b', message: 'You must define a function named sayHello.' }
  ];

  // Challenge 2
  challenges[31].title = 'Square a Number';
  challenges[31].description = 'Write a function named `square` that takes a number `n` and returns its square (`n * n`).';
  challenges[31].starterCode = '// Write your square function here\n\n\n// Do not edit below\nreturn square(num);';
  challenges[31].testCases = [
    { input: '{"num": 4}', expectedOutput: '16' },
    { input: '{"num": 9}', expectedOutput: '81' }
  ];
  challenges[31].hints = ['Use syntax: function square(n) { return n * n; }'];
  challenges[31].xpReward = 50;
  challenges[31].validationRules = [
    { type: 'regex', condition: 'function\\s+square\\b', message: 'You must define a function named square.' }
  ];

  // Challenge 3
  challenges[32].title = 'Sum of Two';
  challenges[32].description = 'Write a function named `add` that takes two numbers `a` and `b` and returns their sum.';
  challenges[32].starterCode = '// Write your add function here\n\n\n// Do not edit below\nreturn add(x, y);';
  challenges[32].testCases = [
    { input: '{"x": 5, "y": 7}', expectedOutput: '12' },
    { input: '{"x": -3, "y": 10}', expectedOutput: '7' }
  ];
  challenges[32].hints = ['function add(a, b) { return a + b; }'];
  challenges[32].xpReward = 50;
  challenges[32].validationRules = [
    { type: 'regex', condition: 'function\\s+add\\b', message: 'You must define a function named add.' }
  ];

  // Challenge 4
  challenges[33].title = 'Is Even?';
  challenges[33].description = 'Write a function named `isEven` that takes a number `n` and returns `true` if it is even, and `false` if it is odd.';
  challenges[33].starterCode = '// Write your isEven function here\n\n\n// Do not edit below\nreturn isEven(num);';
  challenges[33].testCases = [
    { input: '{"num": 4}', expectedOutput: 'true' },
    { input: '{"num": 7}', expectedOutput: 'false' }
  ];
  challenges[33].hints = ['Use the modulo operator: return n % 2 === 0;'];
  challenges[33].xpReward = 100;
  challenges[33].validationRules = [
    { type: 'regex', condition: 'function\\s+isEven\\b', message: 'You must define a function named isEven.' }
  ];

  // Challenge 5
  challenges[34].title = 'Max of Two';
  challenges[34].description = 'Write a function named `findMax` that takes two numbers `a` and `b` and returns the larger of the two.';
  challenges[34].starterCode = '// Write your findMax function here\n\n\n// Do not edit below\nreturn findMax(a, b);';
  challenges[34].testCases = [
    { input: '{"a": 12, "b": 8}', expectedOutput: '12' },
    { input: '{"a": -5, "b": -2}', expectedOutput: '-2' }
  ];
  challenges[34].hints = ['Use an if/else: if (a > b) return a; else return b;'];
  challenges[34].xpReward = 100;
  challenges[34].validationRules = [
    { type: 'regex', condition: 'function\\s+findMax\\b', message: 'You must define a function named findMax.' }
  ];

  // Challenge 6
  challenges[35].title = 'Celsius to Fahrenheit';
  challenges[35].description = 'Write a function named `cToF` that takes a Celsius temperature and returns its Fahrenheit value. Formula: `(C * 9/5) + 32`.';
  challenges[35].starterCode = '// Write your cToF function here\n\n\n// Do not edit below\nreturn cToF(celsius);';
  challenges[35].testCases = [
    { input: '{"celsius": 0}', expectedOutput: '32' },
    { input: '{"celsius": 100}', expectedOutput: '212' }
  ];
  challenges[35].hints = ['function cToF(c) { return (c * 9/5) + 32; }'];
  challenges[35].xpReward = 100;
  challenges[35].validationRules = [
    { type: 'regex', condition: 'function\\s+cToF\\b', message: 'You must define a function named cToF.' }
  ];

  // Challenge 7
  challenges[36].title = 'Factorial Function';
  challenges[36].description = 'Write a function named `factorial` that calculates the factorial of a positive integer `n`.';
  challenges[36].starterCode = '// Write your factorial function here\n\n\n// Do not edit below\nreturn factorial(num);';
  challenges[36].testCases = [
    { input: '{"num": 5}', expectedOutput: '120' },
    { input: '{"num": 0}', expectedOutput: '1' }
  ];
  challenges[36].hints = ['Use a loop or recursion: if (n === 0) return 1; return n * factorial(n - 1);'];
  challenges[36].xpReward = 100;
  challenges[36].validationRules = [
    { type: 'regex', condition: 'function\\s+factorial\\b', message: 'You must define a function named factorial.' }
  ];

  // Challenge 8
  challenges[37].title = 'Circle Area';
  challenges[37].description = 'Write a function named `circleArea` that takes a radius `r` and returns the area of the circle. Use `Math.PI` and round it to 2 decimal places using `Math.round(area * 100) / 100`.';
  challenges[37].starterCode = '// Write your circleArea function here\n\n\n// Do not edit below\nreturn circleArea(radius);';
  challenges[37].testCases = [
    { input: '{"radius": 3}', expectedOutput: '28.27' },
    { input: '{"radius": 5}', expectedOutput: '78.54' }
  ];
  challenges[37].hints = ['Calculate area = Math.PI * r * r.', 'Round with: return Math.round(area * 100) / 100;'];
  challenges[37].xpReward = 100;
  challenges[37].validationRules = [
    { type: 'regex', condition: 'function\\s+circleArea\\b', message: 'You must define a function named circleArea.' }
  ];

  // Challenge 9
  challenges[38].title = 'Global vs Local Scope';
  challenges[38].description = 'Declare a global variable named `multiplier` with the value `3`. Then write a function named `multiplyBy` that takes a number `n` and returns `n * multiplier`.';
  challenges[38].starterCode = '// Declare multiplier and multiplyBy function here\n\n\n// Do not edit below\nreturn multiplyBy(num);';
  challenges[38].testCases = [
    { input: '{"num": 5}', expectedOutput: '15' },
    { input: '{"num": 10}', expectedOutput: '30' }
  ];
  challenges[38].hints = ['let multiplier = 3;', 'function multiplyBy(n) { return n * multiplier; }'];
  challenges[38].xpReward = 200;
  challenges[38].validationRules = [
    { type: 'regex', condition: 'function\\s+multiplyBy\\b', message: 'You must define a function named multiplyBy.' }
  ];

  // Challenge 10 (Boss)
  challenges[39].title = 'Boss Battle: Student Grade Manager';
  challenges[39].description = 'Build a Grade Manager. Write a function named `getGrade` that takes a score (0 to 100) and returns a letter grade string: `"A"` for 90+, `"B"` for 80-89, `"C"` for 70-79, `"D"` for 60-69, and `"F"` for below 60.';
  challenges[39].starterCode = '// Write your getGrade function here\n\n\n// Do not edit below\nreturn getGrade(score);';
  challenges[39].testCases = [
    { input: '{"score": 95}', expectedOutput: '"A"' },
    { input: '{"score": 82}', expectedOutput: '"B"' },
    { input: '{"score": 74}', expectedOutput: '"C"' },
    { input: '{"score": 60}', expectedOutput: '"D"' },
    { input: '{"score": 45}', expectedOutput: '"F"' }
  ];
  challenges[39].hints = ['Use if/else if/else logic on score values.'];
  challenges[39].xpReward = 500;
  challenges[39].bossBattle = true;
  challenges[39].validationRules = [
    { type: 'regex', condition: 'function\\s+getGrade\\b', message: 'You must define a function named getGrade.' }
  ];

  // World 5: Array Dragon Cave (Indexes 40-49)
  // Challenge 1
  challenges[40].title = 'Create an Array';
  challenges[40].description = 'Create an array named `bag` containing three strings: `"sword"`, `"shield"`, and `"potion"`. Return `bag`.\n\nExpected output: `"sword,shield,potion"`';
  challenges[40].starterCode = '// Declare bag array\n\n\n// Do not edit below\nreturn bag;';
  challenges[40].expectedOutput = 'sword,shield,potion';
  challenges[40].hints = ['let bag = ["sword", "shield", "potion"];'];
  challenges[40].xpReward = 50;

  // Challenge 2
  challenges[41].title = 'Array Length';
  challenges[41].description = 'Given an array `items`, find its length and store it in `itemCount`.';
  challenges[41].starterCode = '// Variable `items` is provided\n// Declare itemCount\n\n\n// Do not edit below\nreturn itemCount;';
  challenges[41].testCases = [
    { input: '{"items": [1, 2, 3, 4]}', expectedOutput: '4' },
    { input: '{"items": ["a", "b"]}', expectedOutput: '2' }
  ];
  challenges[41].hints = ['Use: let itemCount = items.length;'];
  challenges[41].xpReward = 50;

  // Challenge 3
  challenges[42].title = 'Access Array Element';
  challenges[42].description = 'Given an array `chestKeys`, return the third element (index 2) and store it in `key`.';
  challenges[42].starterCode = '// Variable `chestKeys` is provided\n// Declare key\n\n\n// Do not edit below\nreturn key;';
  challenges[42].testCases = [
    { input: '{"chestKeys": ["gold", "silver", "bronze", "rusty"]}', expectedOutput: '"bronze"' }
  ];
  challenges[42].hints = ['Use bracket notation: let key = chestKeys[2];'];
  challenges[42].xpReward = 50;

  // Challenge 4
  challenges[43].title = 'Push Element';
  challenges[43].description = 'Given an array `party`, add `"Mage"` to the end of the array using `.push()`. Return the updated `party` array.';
  challenges[43].starterCode = '// Variable `party` is provided\n// Modify party array\n\n\n// Do not edit below\nreturn party;';
  challenges[43].testCases = [
    { input: '{"party": ["Warrior", "Rogue"]}', expectedOutput: 'Warrior,Rogue,Mage' }
  ];
  challenges[43].hints = ['Use: party.push("Mage");'];
  challenges[43].xpReward = 100;
  challenges[43].validationRules = [
    { type: 'includes', condition: 'push(', message: 'You must use the push method.' }
  ];

  // Challenge 5
  challenges[44].title = 'Pop Element';
  challenges[44].description = 'Given an array `stack`, remove the last element using `.pop()`. Store the removed element in `removedItem`.';
  challenges[44].starterCode = '// Variable `stack` is provided\n// Declare removedItem\n\n\n// Do not edit below\nreturn removedItem;';
  challenges[44].testCases = [
    { input: '{"stack": ["A", "B", "C"]}', expectedOutput: '"C"' }
  ];
  challenges[44].hints = ['Use: let removedItem = stack.pop();'];
  challenges[44].xpReward = 100;
  challenges[44].validationRules = [
    { type: 'includes', condition: 'pop(', message: 'You must use the pop method.' }
  ];

  // Challenge 6
  challenges[45].title = 'Find Index';
  challenges[45].description = 'Given an array `inventory` and a string `target`, find the index of `target` using `.indexOf()`. Store the index in `index`.';
  challenges[45].starterCode = '// Variables `inventory` and `target` are provided\n// Declare index\n\n\n// Do not edit below\nreturn index;';
  challenges[45].testCases = [
    { input: '{"inventory": ["herb", "potion", "scroll"], "target": "potion"}', expectedOutput: '1' },
    { input: '{"inventory": ["herb", "potion", "scroll"], "target": "sword"}', expectedOutput: '-1' }
  ];
  challenges[45].hints = ['Use: let index = inventory.indexOf(target);'];
  challenges[45].xpReward = 100;
  challenges[45].validationRules = [
    { type: 'includes', condition: 'indexOf(', message: 'You must use the indexOf method.' }
  ];

  // Challenge 7
  challenges[46].title = 'Slice Array';
  challenges[46].description = 'Given an array `questList`, return a new array containing the first 2 quests using `.slice(0, 2)`. Store in `activeQuests`.';
  challenges[46].starterCode = '// Variable `questList` is provided\n// Declare activeQuests\n\n\n// Do not edit below\nreturn activeQuests;';
  challenges[46].testCases = [
    { input: '{"questList": ["Save Village", "Find Sword", "Defeat Dragon"]}', expectedOutput: 'Save Village,Find Sword' }
  ];
  challenges[46].hints = ['Use: let activeQuests = questList.slice(0, 2);'];
  challenges[46].xpReward = 100;
  challenges[46].validationRules = [
    { type: 'includes', condition: 'slice(', message: 'You must use the slice method.' }
  ];

  // Challenge 8
  challenges[47].title = 'Join Array';
  challenges[47].description = 'Given an array `words`, join them into a single string separated by hyphens (`-`) using `.join("-")`. Store in `joinedWord`.';
  challenges[47].starterCode = '// Variable `words` is provided\n// Declare joinedWord\n\n\n// Do not edit below\nreturn joinedWord;';
  challenges[47].testCases = [
    { input: '{"words": ["dragon", "slayer", "quest"]}', expectedOutput: '"dragon-slayer-quest"' }
  ];
  challenges[47].hints = ['Use: let joinedWord = words.join("-");'];
  challenges[47].xpReward = 200;
  challenges[47].validationRules = [
    { type: 'includes', condition: 'join(', message: 'You must use the join method.' }
  ];

  // Challenge 9
  challenges[48].title = 'Sum Array Elements';
  challenges[48].description = 'Given an array of numbers `prices`, calculate the sum of all elements. Store it in `totalSum`.';
  challenges[48].starterCode = '// Variable `prices` is provided\n// Declare totalSum and calculate the sum\n\n\n// Do not edit below\nreturn totalSum;';
  challenges[48].testCases = [
    { input: '{"prices": [10, 25, 5]}', expectedOutput: '40' },
    { input: '{"prices": [100, 200]}', expectedOutput: '300' }
  ];
  challenges[48].hints = ['Loop through the array or use .reduce(): let totalSum = prices.reduce((a, b) => a + b, 0);'];
  challenges[48].xpReward = 200;

  // Challenge 10 (Boss)
  challenges[49].title = 'Boss Battle: Movie Recommendation Engine';
  challenges[49].description = 'Filter movies by rating. Given an array `movies` (where each movie is an object like `{title: "Inception", rating: 8.8}`) and a `minRating` threshold, collect the titles of movies that are greater than or equal to `minRating` into an array, and join them with commas. Store in `recommendedTitles`.';
  challenges[49].starterCode = '// Variables `movies` and `minRating` are provided\n// Declare recommendedTitles as a string\n\n\n// Do not edit below\nreturn recommendedTitles;';
  challenges[49].testCases = [
    { input: '{"movies": [{"title": "Inception", "rating": 8.8}, {"title": "Avatar", "rating": 7.8}, {"title": "Interstellar", "rating": 8.6}], "minRating": 8.0}', expectedOutput: '"Inception,Interstellar"' },
    { input: '{"movies": [{"title": "Inception", "rating": 8.8}, {"title": "Avatar", "rating": 7.8}], "minRating": 9.0}', expectedOutput: '""' }
  ];
  challenges[49].hints = ['Use filter and map, or a standard loop.', 'Let filtered = movies.filter(m => m.rating >= minRating); let titles = filtered.map(m => m.title); let recommendedTitles = titles.join(",");'];
  challenges[49].xpReward = 500;
  challenges[49].bossBattle = true;

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
        description: 'Read two integers `a` and `b` and print their sum.\n\nFor example, if `a = 5` and `b = 7`:\n```\nSum: 12\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    // Calculate and print their sum\n    \n    return 0;\n}',
        testCases: [
          { input: '5 7', expectedOutput: 'Sum: 12\n' },
          { input: '10 20', expectedOutput: 'Sum: 30\n' }
        ],
        hints: ['int sum = a + b;', 'printf("Sum: %d\\n", sum);'],
        solution: '#include <stdio.h>\nint main(){int a,b;scanf("%d %d",&a,&b);printf("Sum: %d\\n",a+b);return 0;}',
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
        description: 'Read two integers `dividend` and `divisor`, print quotient and remainder.\n\nFor example, if `dividend = 17` and `divisor = 5`:\n```\nQuotient: 3\nRemainder: 2\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int dividend, divisor;\n    scanf("%d %d", &dividend, &divisor);\n    // Calculate and print quotient and remainder\n    \n    return 0;\n}',
        testCases: [
          { input: '17 5', expectedOutput: 'Quotient: 3\nRemainder: 2\n' },
          { input: '20 3', expectedOutput: 'Quotient: 6\nRemainder: 2\n' },
          { input: '100 10', expectedOutput: 'Quotient: 10\nRemainder: 0\n' }
        ],
        hints: ['Use / for division and % for modulo.', 'int q = dividend / divisor; int r = dividend % divisor;'],
        solution: '#include <stdio.h>\nint main(){int d,v;scanf("%d %d",&d,&v);printf("Quotient: %d\\nRemainder: %d\\n",d/v,d%v);return 0;}',
      },
      {
        title: 'Boss: Unit Converter',
        slug: 'c-w1-boss', world: 1, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nRead an integer `km` from standard input, convert it to meters and centimeters:\n- 1 km = 1000 m\n- 1 km = 100000 cm\n\nFor example, if `km = 5`, print:\n```\n5 km = 5000 m\n5 km = 500000 cm\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int km;\n    scanf("%d", &km);\n    // Calculate and print conversions\n    \n    return 0;\n}',
        testCases: [
          { input: '5', expectedOutput: '5 km = 5000 m\n5 km = 500000 cm\n' },
          { input: '2', expectedOutput: '2 km = 2000 m\n2 km = 200000 cm\n' },
          { input: '10', expectedOutput: '10 km = 10000 m\n10 km = 1000000 cm\n' }
        ],
        hints: ['int meters = km * 1000;', 'int cm = km * 100000;'],
        solution: '#include <stdio.h>\nint main(){int k;scanf("%d",&k);printf("%d km = %d m\\n%d km = %d cm\\n",k,k*1000,k,k*100000);return 0;}',
      },

      // ═══ WORLD 2: Type Caverns ═══════════════════════════════════════════════
      {
        title: 'Print sizeof int',
        slug: 'c-w2-c1', world: 2, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Print the size of an `int` in bytes.\n\nExpected output:\n```\nSize of int: 4\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print size of int\n    \n    return 0;\n}',
        expectedOutput: 'Size of int: 4\n',
        hints: ['Remember to use the sizeof operator.', 'The sizeof operator returns a size_t, which uses %zu as its format specifier.'],
        solution: '#include <stdio.h>\nint main(){printf("Size of int: %zu\\n",sizeof(int));return 0;}',
      },
      {
        title: 'Size of double',
        slug: 'c-w2-c2', world: 2, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Print the size of a `double` in bytes.\n\nExpected output:\n```\nSize of double: 8\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print size of double\n    \n    return 0;\n}',
        expectedOutput: 'Size of double: 8\n',
        hints: ['Use the sizeof operator on the double type.', 'Remember to use %zu as the format specifier.'],
        solution: '#include <stdio.h>\nint main(){printf("Size of double: %zu\\n",sizeof(double));return 0;}',
      },
      {
        title: 'Explicit Type Cast',
        slug: 'c-w2-c3', world: 2, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Divide `7` by `2` and store the result as a `float`. Print with 1 decimal.\n\nExpected output:\n```\nResult: 3.5\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    // Cast and divide\n    \n    return 0;\n}',
        expectedOutput: 'Result: 3.5\n',
        hints: ['Cast one of the integers to float, e.g., (float)a, so floating-point division is performed.', 'Use %.1f to print the result with exactly one decimal place.'],
        solution: '#include <stdio.h>\nint main(){int a=7,b=2;float r=(float)a/b;printf("Result: %.1f\\n",r);return 0;}',
      },
      {
        title: 'Char to ASCII',
        slug: 'c-w2-c4', world: 2, order: 4, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Print the ASCII value of the character `\'A\'`.\n\nExpected output:\n```\nASCII of A: 65\n```\n\nHint: a `char` can be printed as an integer with `%d`.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    char c = \'A\';\n    // Print ASCII value\n    \n    return 0;\n}',
        expectedOutput: 'ASCII of A: 65\n',
        hints: ['A char variable is stored as its ASCII integer code.', 'Use %d format specifier in printf to output it as a number.'],
        solution: '#include <stdio.h>\nint main(){char c=\'A\';printf("ASCII of A: %d\\n",c);return 0;}',
      },
      {
        title: 'Implicit Promotion',
        slug: 'c-w2-c5', world: 2, order: 5, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 100,
        description: 'Add `int x = 5` and `double y = 2.5`. Store in a `double result`. Print with 1 decimal:\n```\nResult: 7.5\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int x = 5;\n    double y = 2.5;\n    // Add and print\n    \n    return 0;\n}',
        expectedOutput: 'Result: 7.5\n',
        hints: ['When adding an int and a double, the int is automatically promoted to double.', 'Store the sum in a double variable and print with %.1f.'],
        solution: '#include <stdio.h>\nint main(){int x=5;double y=2.5;double r=x+y;printf("Result: %.1f\\n",r);return 0;}',
      },
      {
        title: 'Overflow Detection',
        slug: 'c-w2-c6', world: 2, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare `unsigned char x = 255`. Increment it by 1. Print the answer.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    unsigned char x = 255;\n    // Increment x by 1 and print the answer\n    \n    return 0;\n}',
        expectedOutput: '0\n',
        hints: ['Use the increment operator (x++) to add 1 to x.', 'Print the value using printf with the format: "%d\\n"'],
        solution: '#include <stdio.h>\nint main(){unsigned char x=255;x++;printf("%d\\n",x);return 0;}',
      },
      {
        title: 'Min and Max of int',
        slug: 'c-w2-c7', world: 2, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Use `<limits.h>` to print the minimum and maximum values of an `int`.\n\nExpected output:\n```\nMin: -2147483648\nMax: 2147483647\n```',
        starterCode: '#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    // Print INT_MIN and INT_MAX\n    \n    return 0;\n}',
        expectedOutput: 'Min: -2147483648\nMax: 2147483647\n',
        hints: ['Use the INT_MIN and INT_MAX constants from <limits.h>.', 'Format the print statements to display "Min: " and "Max: " on separate lines.'],
        solution: '#include <stdio.h>\n#include <limits.h>\nint main(){printf("Min: %d\\nMax: %d\\n",INT_MIN,INT_MAX);return 0;}',
      },
      {
        title: 'Boolean Logic',
        slug: 'c-w2-c8', world: 2, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'In C, `0` is false and any non-zero is true. Include `<stdbool.h>` and:\n1. Declare `bool flag = true;`\n2. Print its integer value.\n\nExpected output:\n```\nFlag: 1\n```',
        starterCode: '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    // Declare flag set to true\n    \n    // Print flag value in the format: "Flag: %d\\n"\n    \n    return 0;\n}',
        expectedOutput: 'Flag: 1\n',
        hints: ['true equals 1 when printed as an integer.', 'Use printf("Flag: %d\\n", flag); to print the value.'],
        solution: '#include <stdio.h>\n#include <stdbool.h>\nint main(){bool f=true;printf("Flag: %d\\n",f);return 0;}',
      },
      {
        title: 'Celsius to Fahrenheit',
        slug: 'c-w2-c9', world: 2, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Convert `100` degrees Celsius to Fahrenheit.\n\nFormula: `F = (C * 9/5) + 32`\n\nExpected output:\n```\n100 C = 212.0 F\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    float c = 100.0;\n    // Calculate Fahrenheit\n    \n    return 0;\n}',
        expectedOutput: '100 C = 212.0 F\n',
        hints: ['Use the formula (c * 9.0 / 5.0) + 32 to calculate the Fahrenheit temperature.', 'Format the output exactly as "100 C = [value] F" with 1 decimal place.'],
        solution: '#include <stdio.h>\nint main(){float c=100.0,f=(c*9.0/5.0)+32;printf("100 C = %.1f F\\n",f);return 0;}',
      },
      {
        title: 'Boss: Size Explorer',
        slug: 'c-w2-boss', world: 2, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nPrint the sizes of all 4 primitive types:\n```\nchar: 1\nint: 4\nfloat: 4\ndouble: 8\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print sizes of char, int, float, double\n    \n    return 0;\n}',
        expectedOutput: 'char: 1\nint: 4\nfloat: 4\ndouble: 8\n',
        hints: ['You can pass data types directly into the sizeof operator.', 'Use %zu as the format specifier for size_t.'],
        solution: '#include <stdio.h>\nint main(){printf("char: %zu\\nint: %zu\\nfloat: %zu\\ndouble: %zu\\n",sizeof(char),sizeof(int),sizeof(float),sizeof(double));return 0;}',
      },

      // ═══ WORLD 3: Forest of Control ══════════════════════════════════════════
      {
        title: 'Simple Condition',
        slug: 'c-w3-c1', world: 3, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Read an integer from the user using `scanf`. If the integer is greater than 0, print:\n```\nPositive\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int num;\n    scanf("%d", &num);\n    // Check if positive and print "Positive"\n    \n    return 0;\n}',
        expectedOutput: 'Positive\n',
        testCases: [{ input: '15', expectedOutput: 'Positive\n' }],
        hints: ['Use an if statement: if (num > 0)', 'Print "Positive\\n" if the condition is met.'],
        solution: '#include <stdio.h>\nint main(){int n;scanf("%d",&n);if(n>0)printf("Positive\\n");return 0;}',
      },
      {
        title: 'Even or Odd',
        slug: 'c-w3-c2', world: 3, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Read an integer from the user using `scanf`. Print `Even` if the number is even, and `Odd` if it is odd.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int num;\n    scanf("%d", &num);\n    // Print Even or Odd\n    \n    return 0;\n}',
        expectedOutput: 'Even\n',
        testCases: [
          { input: '4', expectedOutput: 'Even\n' },
          { input: '7', expectedOutput: 'Odd\n' }
        ],
        hints: ['Use the modulo operator %: num % 2 == 0 checks if a number is even.', 'Use an if-else statement.'],
        solution: '#include <stdio.h>\nint main(){int n;scanf("%d",&n);if(n%2==0)printf("Even\\n");else printf("Odd\\n");return 0;}',
      },
      {
        title: 'Relational Operators',
        slug: 'c-w3-c3', world: 3, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Read a student\'s test score (an integer) from the user. Print `Pass` if the score is 50 or greater, otherwise print `Fail`.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int score;\n    scanf("%d", &score);\n    // Check if pass or fail\n    \n    return 0;\n}',
        expectedOutput: 'Pass\n',
        testCases: [
          { input: '75', expectedOutput: 'Pass\n' },
          { input: '43', expectedOutput: 'Fail\n' }
        ],
        hints: ['Use the >= operator: score >= 50.', 'Print "Pass\\n" or "Fail\\n".'],
        solution: '#include <stdio.h>\nint main(){int s;scanf("%d",&s);if(s>=50)printf("Pass\\n");else printf("Fail\\n");return 0;}',
      },
      {
        title: 'Logical Operators',
        slug: 'c-w3-c4', world: 3, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Read an integer from the user. Check if the number is between 10 and 20 (inclusive). Print `In Range` if true, and `Out of Range` if false.',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int num;\n    scanf("%d", &num);\n    // Check logical range\n    \n    return 0;\n}',
        expectedOutput: 'In Range\n',
        testCases: [
          { input: '15', expectedOutput: 'In Range\n' },
          { input: '5', expectedOutput: 'Out of Range\n' },
          { input: '25', expectedOutput: 'Out of Range\n' }
        ],
        hints: ['Use the logical AND operator &&.', 'Check if num >= 10 && num <= 20.'],
        solution: '#include <stdio.h>\nint main(){int n;scanf("%d",&n);if(n>=10&&n<=20)printf("In Range\\n");else printf("Out of Range\\n");return 0;}',
      },
      {
        title: 'Switch Statement',
        slug: 'c-w3-c5', world: 3, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Read an integer from 1 to 3 representing a medal rank. Use a `switch` statement to print:\n• 1: `Gold`\n• 2: `Silver`\n• 3: `Bronze`\n• Any other value: `No Medal`',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int rank;\n    scanf("%d", &rank);\n    // Switch on rank\n    \n    return 0;\n}',
        expectedOutput: 'Gold\n',
        testCases: [
          { input: '1', expectedOutput: 'Gold\n' },
          { input: '2', expectedOutput: 'Silver\n' },
          { input: '3', expectedOutput: 'Bronze\n' },
          { input: '5', expectedOutput: 'No Medal\n' }
        ],
        hints: ['Remember to put a "break;" statement after each case in the switch.', 'Use "default:" to handle values other than 1, 2, or 3.'],
        solution: '#include <stdio.h>\nint main(){int r;scanf("%d",&r);switch(r){case 1:printf("Gold\\n");break;case 2:printf("Silver\\n");break;case 3:printf("Bronze\\n");break;default:printf("No Medal\\n");}return 0;}',
      },
      {
        title: 'Simple While Loop',
        slug: 'c-w3-c6', world: 3, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Use a `while` loop to print numbers from 1 to 5 separated by a single space.\n\nExpected output:\n```\n1 2 3 4 5 \n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int i = 1;\n    // Print 1 to 5 using while loop\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '1 2 3 4 5 \n',
        testCases: [],
        hints: ['while (i <= 5) { printf("%d ", i); i++; }'],
        solution: '#include <stdio.h>\nint main(){int i=1;while(i<=5){printf("%d ",i);i++;}printf("\\n");return 0;}',
      },
      {
        title: 'Sum via For Loop',
        slug: 'c-w3-c7', world: 3, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Read an integer `N` from the user. Use a `for` loop to calculate and print the sum of integers from 1 to N.\n\nExpected output if input is 5:\n```\nSum: 15\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Calculate sum from 1 to n\n    \n    return 0;\n}',
        expectedOutput: 'Sum: 15\n',
        testCases: [
          { input: '5', expectedOutput: 'Sum: 15\n' },
          { input: '10', expectedOutput: 'Sum: 55\n' }
        ],
        hints: ['Declare an accumulator variable: int sum = 0;', 'Loop from 1 to N, adding the loop counter to sum at each step.'],
        solution: '#include <stdio.h>\nint main(){int n,s=0;scanf("%d",&n);for(int i=1;i<=n;i++)s+=i;printf("Sum: %d\\n",s);return 0;}',
      },
      {
        title: 'Break and Continue',
        slug: 'c-w3-c8', world: 3, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Loop from 1 to 10. If the number is even, skip it using `continue`. If the number is greater than 7, stop the loop using `break`. Print the numbers.\n\nExpected output:\n```\n1 3 5 7 \n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Loop and print with break/continue\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '1 3 5 7 \n',
        testCases: [],
        hints: ['Use a for loop: for(int i = 1; i <= 10; i++)', 'Use if (i % 2 == 0) continue;', 'Use if (i > 7) break;'],
        solution: '#include <stdio.h>\nint main(){for(int i=1;i<=10;i++){if(i%2==0)continue;if(i>7)break;printf("%d ",i);}printf("\\n");return 0;}',
      },
      {
        title: 'Nested Loops Grid',
        slug: 'c-w3-c9', world: 3, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Use nested loops to print a 2-row by 3-column grid of asterisks (`*`).\n\nExpected output:\n```\n***\n***\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    // Print 2x3 asterisk grid using nested loops\n    \n    return 0;\n}',
        expectedOutput: '***\n***\n',
        testCases: [],
        hints: ['Outer loop runs 2 times (rows), inner loop runs 3 times (columns).', 'Print "*" inside inner loop, and "\\n" inside outer loop after inner loop ends.'],
        solution: '#include <stdio.h>\nint main(){for(int i=0;i<2;i++){for(int j=0;j<3;j++)printf("*");printf("\\n");}return 0;}',
      },
      {
        title: 'Boss: Factorial Calculator',
        slug: 'c-w3-boss', world: 3, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nRead an integer `N` from the user. Calculate and print its factorial. (N >= 0).\n\nExpected output if input is 5:\n```\nFactorial: 120\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Calculate and print factorial\n    \n    return 0;\n}',
        expectedOutput: 'Factorial: 120\n',
        testCases: [
          { input: '5', expectedOutput: 'Factorial: 120\n' },
          { input: '0', expectedOutput: 'Factorial: 1\n' },
          { input: '6', expectedOutput: 'Factorial: 720\n' }
        ],
        hints: ['Declare: long long fact = 1;', 'Loop from 1 to N: fact *= i;'],
        solution: '#include <stdio.h>\nint main(){int n;scanf("%d",&n);long long f=1;for(int i=1;i<=n;i++)f*=i;printf("Factorial: %lld\\n",f);return 0;}',
      },

      // ═══ WORLD 4: Pointer Peaks ══════════════════════════════════════════════
      {
        title: 'Your First Pointer',
        slug: 'c-w4-c1', world: 4, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int x = 42`. Create a pointer `ptr` that points to it. Print the value via the pointer.\n\nExpected output:\n```\nValue: 42\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int x = 42;\n    int *ptr = &x;\n    // Print value via pointer\n    \n    return 0;\n}',
        expectedOutput: 'Value: 42\n',
        hints: ['Use *ptr to dereference the pointer.', 'printf("Value: %d\\n", *ptr);'],
        solution: '#include <stdio.h>\nint main(){int x=42;int *p=&x;printf("Value: %d\\n",*p);return 0;}',
      },
      {
        title: 'Modify via Pointer',
        slug: 'c-w4-c2', world: 4, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int score = 10`. Use a pointer to change its value to `99`. Print the new value.\n\nExpected output:\n```\nNew score: 99\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int score = 10;\n    int *ptr = &score;\n    // Modify score via ptr\n    \n    printf("New score: %d\\n", score);\n    return 0;\n}',
        expectedOutput: 'New score: 99\n',
        hints: ['*ptr = 99; assigns 99 to the value ptr points to.'],
        solution: '#include <stdio.h>\nint main(){int s=10;int *p=&s;*p=99;printf("New score: %d\\n",s);return 0;}',
      },
      {
        title: 'Pointer Arithmetic',
        slug: 'c-w4-c3', world: 4, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Declare `int arr[] = {10, 20, 30}`. Use a pointer to print the second element.\n\nExpected output:\n```\nSecond: 20\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int *ptr = arr;\n    // Print second element via pointer arithmetic\n    \n    return 0;\n}',
        expectedOutput: 'Second: 20\n',
        hints: ['ptr + 1 points to the next int.', 'printf("Second: %d\\n", *(ptr + 1));'],
        solution: '#include <stdio.h>\nint main(){int a[]={10,20,30};int *p=a;printf("Second: %d\\n",*(p+1));return 0;}',
      },
      {
        title: 'Pointer to Pointer',
        slug: 'c-w4-c4', world: 4, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare `int val = 7`. Create a pointer-to-pointer `int **pp`. Use it to print the value.\n\nExpected output:\n```\nValue: 7\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int val = 7;\n    int *ptr = &val;\n    int **pp = &ptr;\n    // Print via double pointer\n    \n    return 0;\n}',
        expectedOutput: 'Value: 7\n',
        hints: ['**pp dereferences twice: pointer-to-pointer → pointer → value.', 'printf("Value: %d\\n", **pp);'],
        solution: '#include <stdio.h>\nint main(){int v=7;int *p=&v;int **pp=&p;printf("Value: %d\\n",**pp);return 0;}',
      },
      {
        title: 'NULL Pointer Check',
        slug: 'c-w4-c5', world: 4, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Declare a NULL pointer `int *ptr = NULL`. Check if it is NULL and print:\n```\nPointer is null\n```\n\nThis is safe programming practice!',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int *ptr = NULL;\n    // Check if ptr is NULL\n    \n    return 0;\n}',
        expectedOutput: 'Pointer is null\n',
        hints: ['if (ptr == NULL) { printf(...); }'],
        solution: '#include <stdio.h>\nint main(){int *p=NULL;if(p==NULL)printf("Pointer is null\\n");return 0;}',
      },
      {
        title: 'Array via Pointer',
        slug: 'c-w4-c6', world: 4, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Given `int nums[] = {5, 10, 15, 20}`, use a pointer loop to print all elements.\n\nExpected output:\n```\n5 10 15 20\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int nums[] = {5, 10, 15, 20};\n    int *ptr = nums;\n    // Loop and print using pointer\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '5 10 15 20\n',
        hints: ['for (int i = 0; i < 4; i++) printf("%d ", *(ptr + i));', 'Note: trailing newline comes from the printf("\\n") already in the starter code.'],
        solution: '#include <stdio.h>\nint main(){int n[]={5,10,15,20};int *p=n;for(int i=0;i<4;i++)printf("%d ",*(p+i));printf("\\n");return 0;}',
      },
      {
        title: 'Pointer Increment',
        slug: 'c-w4-c7', world: 4, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Start a pointer at `arr[0]` where `arr = {100, 200, 300}`. Increment the pointer twice and print the value it now points to.\n\nExpected output:\n```\nValue: 300\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[] = {100, 200, 300};\n    int *ptr = arr;\n    // Increment ptr twice\n    \n    printf("Value: %d\\n", *ptr);\n    return 0;\n}',
        expectedOutput: 'Value: 300\n',
        hints: ['ptr++; ptr++;', 'After two increments, ptr points to arr[2].'],
        solution: '#include <stdio.h>\nint main(){int a[]={100,200,300};int *p=a;p++;p++;printf("Value: %d\\n",*p);return 0;}',
      },
      {
        title: 'Swap via Pointers',
        slug: 'c-w4-c8', world: 4, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Write a swap using pointer dereferencing. Start with `a = 5`, `b = 9`. Swap and print:\n```\na=9 b=5\n```',
        starterCode: '#include <stdio.h>\n\nvoid swap(int *x, int *y) {\n    // Swap via pointers\n}\n\nint main() {\n    int a = 5, b = 9;\n    swap(&a, &b);\n    printf("a=%d b=%d\\n", a, b);\n    return 0;\n}',
        expectedOutput: 'a=9 b=5\n',
        hints: ['int temp = *x; *x = *y; *y = temp;'],
        solution: '#include <stdio.h>\nvoid swap(int *x,int *y){int t=*x;*x=*y;*y=t;}\nint main(){int a=5,b=9;swap(&a,&b);printf("a=%d b=%d\\n",a,b);return 0;}',
      },
      {
        title: 'Pointer Difference',
        slug: 'c-w4-c9', world: 4, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Given `int arr[5]`, print the difference between the pointer to the last and first elements.\n\nExpected output:\n```\nDiff: 4\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int arr[5] = {1,2,3,4,5};\n    int *first = arr;\n    int *last = arr + 4;\n    // Print the difference\n    \n    return 0;\n}',
        expectedOutput: 'Diff: 4\n',
        hints: ['printf("Diff: %td\\n", last - first);', 'Pointer subtraction gives element count, not bytes.'],
        solution: '#include <stdio.h>\nint main(){int a[5]={1,2,3,4,5};int *f=a,*l=a+4;printf("Diff: %td\\n",l-f);return 0;}',
      },
      {
        title: 'Boss: Find Max via Pointer',
        slug: 'c-w4-boss', world: 4, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nGiven `int nums[] = {3, 67, 12, 89, 45}`, use a pointer to find the maximum value.\n\nExpected output:\n```\nMax: 89\n```',
        starterCode: '#include <stdio.h>\n\nint main() {\n    int nums[] = {3, 67, 12, 89, 45};\n    int *ptr = nums;\n    int max = *ptr;\n    // Loop to find max using pointer\n    \n    printf("Max: %d\\n", max);\n    return 0;\n}',
        expectedOutput: 'Max: 89\n',
        hints: ['for (int i = 1; i < 5; i++) if (*(ptr+i) > max) max = *(ptr+i);'],
        solution: '#include <stdio.h>\nint main(){int n[]={3,67,12,89,45};int *p=n,m=*p;for(int i=1;i<5;i++)if(*(p+i)>m)m=*(p+i);printf("Max: %d\\n",m);return 0;}',
      },

      // ═══ WORLD 5: Struct Citadel ═════════════════════════════════════════════
      {
        title: 'Your First Struct',
        slug: 'c-w5-c1', world: 5, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Define a `struct Point` with `int x` and `int y`. Create a point at `(3, 7)` and print:\n```\nPoint: (3, 7)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point {\n    int x, y;\n};\n\nint main() {\n    struct Point p;\n    p.x = 3; p.y = 7;\n    printf("Point: (%d, %d)\\n", p.x, p.y);\n    return 0;\n}',
        expectedOutput: 'Point: (3, 7)\n',
        hints: ['The starter code is almost complete — just run it!'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};int main(){struct Point p;p.x=3;p.y=7;printf("Point: (%d, %d)\\n",p.x,p.y);return 0;}',
      },
      {
        title: 'Struct Initialization',
        slug: 'c-w5-c2', world: 5, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Define `struct Student` with `name[20]` (char array) and `int age`. Initialize it and print:\n```\nName: Alice Age: 20\n```',
        starterCode: '#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[20];\n    int age;\n};\n\nint main() {\n    struct Student s;\n    strcpy(s.name, "Alice");\n    s.age = 20;\n    printf("Name: %s Age: %d\\n", s.name, s.age);\n    return 0;\n}',
        expectedOutput: 'Name: Alice Age: 20\n',
        hints: ['The starter code is complete — just run it!'],
        solution: '#include <stdio.h>\n#include <string.h>\nstruct Student{char name[20];int age;};int main(){struct Student s;strcpy(s.name,"Alice");s.age=20;printf("Name: %s Age: %d\\n",s.name,s.age);return 0;}',
      },
      {
        title: 'Struct with typedef',
        slug: 'c-w5-c3', world: 5, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Use `typedef` to create a `Rectangle` struct with `int width` and `int height`. Compute area and print:\n```\nArea: 24\n```\nUse `width = 6`, `height = 4`.',
        starterCode: '#include <stdio.h>\n\ntypedef struct {\n    int width, height;\n} Rectangle;\n\nint main() {\n    Rectangle r;\n    r.width = 6; r.height = 4;\n    // Calculate and print area\n    \n    return 0;\n}',
        expectedOutput: 'Area: 24\n',
        hints: ['int area = r.width * r.height;', 'printf("Area: %d\\n", area);'],
        solution: '#include <stdio.h>\ntypedef struct{int width,height;}Rectangle;int main(){Rectangle r;r.width=6;r.height=4;printf("Area: %d\\n",r.width*r.height);return 0;}',
      },
      {
        title: 'Pointer to Struct',
        slug: 'c-w5-c4', world: 5, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create a `struct Car` with `int speed`. Use a pointer to set speed to `120` and print:\n```\nSpeed: 120\n```\n\nUse the arrow operator `->` to access via pointer.',
        starterCode: '#include <stdio.h>\n\nstruct Car { int speed; };\n\nint main() {\n    struct Car c;\n    struct Car *ptr = &c;\n    // Set speed via pointer and print\n    \n    return 0;\n}',
        expectedOutput: 'Speed: 120\n',
        hints: ['ptr->speed = 120;', 'printf("Speed: %d\\n", ptr->speed);'],
        solution: '#include <stdio.h>\nstruct Car{int speed;};int main(){struct Car c;struct Car *p=&c;p->speed=120;printf("Speed: %d\\n",p->speed);return 0;}',
      },
      {
        title: 'Array of Structs',
        slug: 'c-w5-c5', world: 5, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create an array of 3 `struct Point`s: `(1,2)`, `(3,4)`, `(5,6)`. Print all:\n```\n(1,2) (3,4) (5,6)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\nint main() {\n    struct Point pts[3] = {{1,2},{3,4},{5,6}};\n    // Print all points\n    \n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '(1,2) (3,4) (5,6)\n',
        hints: ['for (int i = 0; i < 3; i++) printf("(%d,%d) ", pts[i].x, pts[i].y);'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};int main(){struct Point p[3]={{1,2},{3,4},{5,6}};for(int i=0;i<3;i++)printf("(%d,%d) ",p[i].x,p[i].y);printf("\\n");return 0;}',
      },
      {
        title: 'Nested Structs',
        slug: 'c-w5-c6', world: 5, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Create a `struct Circle` with center `struct Point` and `int radius`. Print:\n```\nCenter: (2,3) Radius: 5\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\nstruct Circle { struct Point center; int radius; };\n\nint main() {\n    struct Circle c = {{2,3}, 5};\n    printf("Center: (%d,%d) Radius: %d\\n", c.center.x, c.center.y, c.radius);\n    return 0;\n}',
        expectedOutput: 'Center: (2,3) Radius: 5\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};struct Circle{struct Point c;int r;};int main(){struct Circle ci={{2,3},5};printf("Center: (%d,%d) Radius: %d\\n",ci.c.x,ci.c.y,ci.r);return 0;}',
      },
      {
        title: 'Struct Function Param',
        slug: 'c-w5-c7', world: 5, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Write a function `printPoint(struct Point p)` that prints a point. Call it with `(4, 9)`.\n\nExpected output:\n```\nPoint: (4, 9)\n```',
        starterCode: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\nvoid printPoint(struct Point p) {\n    // Print the point\n}\n\nint main() {\n    struct Point p = {4, 9};\n    printPoint(p);\n    return 0;\n}',
        expectedOutput: 'Point: (4, 9)\n',
        hints: ['printf("Point: (%d, %d)\\n", p.x, p.y);'],
        solution: '#include <stdio.h>\nstruct Point{int x,y;};void printPoint(struct Point p){printf("Point: (%d, %d)\\n",p.x,p.y);}int main(){struct Point p={4,9};printPoint(p);return 0;}',
      },
      {
        title: 'Enum Basics',
        slug: 'c-w5-c8', world: 5, order: 8, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Define an enum `Day` with values `MON=1, TUE, WED`. Print the integer value of `WED`.\n\nExpected output:\n```\nWednesday: 3\n```',
        starterCode: '#include <stdio.h>\n\nenum Day { MON=1, TUE, WED };\n\nint main() {\n    // Print value of WED\n    \n    return 0;\n}',
        expectedOutput: 'Wednesday: 3\n',
        hints: ['printf("Wednesday: %d\\n", WED);', 'Enums auto-increment: MON=1, TUE=2, WED=3.'],
        solution: '#include <stdio.h>\nenum Day{MON=1,TUE,WED};int main(){printf("Wednesday: %d\\n",WED);return 0;}',
      },
      {
        title: 'Struct Size',
        slug: 'c-w5-c9', world: 5, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Print the total size in bytes of this struct:\n```c\nstruct Data { char a; int b; };\n```\nExpected output:\n```\nSize: 8\n```\n(Due to struct padding, `char` is padded to align with `int`.)',
        starterCode: '#include <stdio.h>\n\nstruct Data { char a; int b; };\n\nint main() {\n    printf("Size: %zu\\n", sizeof(struct Data));\n    return 0;\n}',
        expectedOutput: 'Size: 8\n',
        hints: ['sizeof(struct Data) accounts for padding bytes.', 'Just run the starter code!'],
        solution: '#include <stdio.h>\nstruct Data{char a;int b;};int main(){printf("Size: %zu\\n",sizeof(struct Data));return 0;}',
      },
      {
        title: 'Boss: Student Records',
        slug: 'c-w5-boss', world: 5, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
        description: '**BOSS BATTLE!**\n\nDefine a `struct Student` with `name[20]` and `int marks`. Create 2 students and print the one with higher marks:\n\nUse: Alice=85, Bob=92.\n\nExpected output:\n```\nTopper: Bob\n```',
        starterCode: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct { char name[20]; int marks; } Student;\n\nint main() {\n    Student s1, s2;\n    strcpy(s1.name, "Alice"); s1.marks = 85;\n    strcpy(s2.name, "Bob"); s2.marks = 92;\n    // Print the student with higher marks\n    \n    return 0;\n}',
        expectedOutput: 'Topper: Bob\n',
        hints: ['if (s1.marks > s2.marks) printf("Topper: %s\\n", s1.name);', 'else printf("Topper: %s\\n", s2.name);'],
        solution: '#include <stdio.h>\n#include <string.h>\ntypedef struct{char name[20];int marks;}Student;int main(){Student s1,s2;strcpy(s1.name,"Alice");s1.marks=85;strcpy(s2.name,"Bob");s2.marks=92;if(s1.marks>s2.marks)printf("Topper: %s\\n",s1.name);else printf("Topper: %s\\n",s2.name);return 0;}',
      },

      // ═══ WORLD 6: Allocation Abyss ═══════════════════════════════════════════
      {
        title: 'malloc Basics',
        slug: 'c-w6-c1', world: 6, order: 1, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Allocate memory for one `int` using `malloc`. Store the value `42` and print it. Free the memory.\n\nExpected output:\n```\nValue: 42\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = malloc(sizeof(int));\n    *ptr = 42;\n    printf("Value: %d\\n", *ptr);\n    free(ptr);\n    return 0;\n}',
        expectedOutput: 'Value: 42\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *p=malloc(sizeof(int));*p=42;printf("Value: %d\\n",*p);free(p);return 0;}',
      },
      {
        title: 'Dynamic Array',
        slug: 'c-w6-c2', world: 6, order: 2, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Allocate a dynamic array of 3 ints with `malloc`. Fill with `{10, 20, 30}` and print each.\n\nExpected output:\n```\n10 20 30\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(3 * sizeof(int));\n    arr[0]=10; arr[1]=20; arr[2]=30;\n    // Print all elements\n    \n    free(arr);\n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '10 20 30\n',
        hints: ['for (int i = 0; i < 3; i++) printf("%d ", arr[i]);'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(3*sizeof(int));a[0]=10;a[1]=20;a[2]=30;for(int i=0;i<3;i++)printf("%d ",a[i]);free(a);printf("\\n");return 0;}',
      },
      {
        title: 'calloc vs malloc',
        slug: 'c-w6-c3', world: 6, order: 3, course: 'c', difficulty: 'Easy', bossBattle: false, xpReward: 50,
        description: 'Use `calloc` to allocate 4 ints. Print the first element (it should be 0 because calloc zeroes memory).\n\nExpected output:\n```\nFirst element: 0\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = calloc(4, sizeof(int));\n    printf("First element: %d\\n", arr[0]);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'First element: 0\n',
        hints: ['calloc initializes all allocated memory to zero.', 'Run the starter code — it\'s already complete!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=calloc(4,sizeof(int));printf("First element: %d\\n",a[0]);free(a);return 0;}',
      },
      {
        title: 'realloc Array',
        slug: 'c-w6-c4', world: 6, order: 4, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Allocate space for 2 ints. Use `realloc` to expand to 3. Add a third value and print all three.\n\nExpected output:\n```\n1 2 3\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(2 * sizeof(int));\n    arr[0] = 1; arr[1] = 2;\n    arr = realloc(arr, 3 * sizeof(int));\n    arr[2] = 3;\n    // Print all elements\n    \n    free(arr);\n    printf("\\n");\n    return 0;\n}',
        expectedOutput: '1 2 3\n',
        hints: ['for (int i = 0; i < 3; i++) printf("%d ", arr[i]);'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(2*sizeof(int));a[0]=1;a[1]=2;a=realloc(a,3*sizeof(int));a[2]=3;for(int i=0;i<3;i++)printf("%d ",a[i]);free(a);printf("\\n");return 0;}',
      },
      {
        title: 'NULL Check after malloc',
        slug: 'c-w6-c5', world: 6, order: 5, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Always check if `malloc` succeeded. If `ptr` is not NULL, print `Allocated`. Else print `Failed`.\n\nExpected output:\n```\nAllocated\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = malloc(sizeof(int));\n    if (ptr != NULL) {\n        printf("Allocated\\n");\n    } else {\n        printf("Failed\\n");\n    }\n    free(ptr);\n    return 0;\n}',
        expectedOutput: 'Allocated\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *p=malloc(sizeof(int));if(p!=NULL)printf("Allocated\\n");else printf("Failed\\n");free(p);return 0;}',
      },
      {
        title: 'Dynamic Struct Allocation',
        slug: 'c-w6-c6', world: 6, order: 6, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Use `malloc` to allocate a `struct Point`. Set `x=7, y=3` via pointer and print:\n```\n(7, 3)\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct Point { int x, y; };\n\nint main() {\n    struct Point *p = malloc(sizeof(struct Point));\n    p->x = 7; p->y = 3;\n    printf("(%d, %d)\\n", p->x, p->y);\n    free(p);\n    return 0;\n}',
        expectedOutput: '(7, 3)\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nstruct Point{int x,y;};int main(){struct Point *p=malloc(sizeof(struct Point));p->x=7;p->y=3;printf("(%d, %d)\\n",p->x,p->y);free(p);return 0;}',
      },
      {
        title: 'Sum of Dynamic Array',
        slug: 'c-w6-c7', world: 6, order: 7, course: 'c', difficulty: 'Medium', bossBattle: false, xpReward: 100,
        description: 'Dynamically allocate an array of 5 ints: `{2, 4, 6, 8, 10}`. Compute and print the sum.\n\nExpected output:\n```\nSum: 30\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    int vals[] = {2,4,6,8,10};\n    for (int i=0; i<5; i++) arr[i] = vals[i];\n    // Calculate sum\n    int sum = 0;\n    \n    printf("Sum: %d\\n", sum);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'Sum: 30\n',
        hints: ['for (int i = 0; i < 5; i++) sum += arr[i];'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(5*sizeof(int));int v[]={2,4,6,8,10};for(int i=0;i<5;i++)a[i]=v[i];int s=0;for(int i=0;i<5;i++)s+=a[i];printf("Sum: %d\\n",s);free(a);return 0;}',
      },
      {
        title: 'String on Heap',
        slug: 'c-w6-c8', world: 6, order: 8, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Dynamically allocate space for a string `"Heap"` (5 chars + null). Copy with `strcpy` and print it.\n\nExpected output:\n```\nHello: Heap\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    char *str = malloc(5 * sizeof(char));\n    strcpy(str, "Heap");\n    printf("Hello: %s\\n", str);\n    free(str);\n    return 0;\n}',
        expectedOutput: 'Hello: Heap\n',
        hints: ['The starter code is complete — run it!'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\nint main(){char *s=malloc(5);strcpy(s,"Heap");printf("Hello: %s\\n",s);free(s);return 0;}',
      },
      {
        title: 'Count Positives',
        slug: 'c-w6-c9', world: 6, order: 9, course: 'c', difficulty: 'Hard', bossBattle: false, xpReward: 200,
        description: 'Dynamically allocate `{-1, 3, -5, 7, 2}`. Count and print how many are positive.\n\nExpected output:\n```\nPositives: 3\n```',
        starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    int vals[] = {-1,3,-5,7,2};\n    for (int i=0;i<5;i++) arr[i]=vals[i];\n    int count = 0;\n    // Count positives\n    \n    printf("Positives: %d\\n", count);\n    free(arr);\n    return 0;\n}',
        expectedOutput: 'Positives: 3\n',
        hints: ['for (int i=0;i<5;i++) if(arr[i]>0) count++;'],
        solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *a=malloc(5*sizeof(int));int v[]={-1,3,-5,7,2};for(int i=0;i<5;i++)a[i]=v[i];int c=0;for(int i=0;i<5;i++)if(a[i]>0)c++;printf("Positives: %d\\n",c);free(a);return 0;}',
      },
      {
        title: 'Boss: Dynamic Gradebook',
        slug: 'c-w6-boss', world: 6, order: 10, course: 'c', difficulty: 'Boss', bossBattle: true, xpReward: 500,
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
    
    console.log(`Successfully seeded ${allChallenges.length} challenges (50 JS + 60 C) without wiping progress!`);

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
