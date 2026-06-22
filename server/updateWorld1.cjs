const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/studyquest';

const world1Updates = [
  {
    order: 2,
    title: 'Store Your Age',
    description: 'Variables can store numbers too! Create a variable named `age` and assign it the number `25`.',
    explanation: 'Numbers in JavaScript do not need quotes around them.',
    starterCode: '// Create your variable here\n\n\n// Leave this here for testing\nreturn age;',
    expectedOutput: '25'
  },
  {
    order: 3,
    title: 'Ready for Adventure',
    description: 'Booleans represent true or false values. Create a variable named `isReady` and set it to `true`.',
    explanation: 'Booleans are written exactly as true or false without quotes.',
    starterCode: '// Create your boolean here\n\n\n// Leave this here for testing\nreturn isReady;',
    expectedOutput: 'true'
  },
  {
    order: 4,
    title: 'Starting Score',
    description: 'Create a variable named `score` and assign it the number `100`.',
    explanation: 'You can use `let` to create variables that might change later in the game.',
    starterCode: '// Create your score variable here\n\n\n// Leave this here for testing\nreturn score;',
    expectedOutput: '100'
  },
  {
    order: 5,
    title: 'The Magic Constant',
    description: 'Some values never change. Use the `const` keyword to create a variable named `pi` and assign it `3.14`.',
    explanation: 'Use `const` for values that should remain constant throughout your code.',
    starterCode: '// Create your constant here\n\n\n// Leave this here for testing\nreturn pi;',
    expectedOutput: '3.14'
  },
  {
    order: 6,
    title: 'First Words',
    description: 'Create a variable named `message` and assign it the string `"Hello World"`.',
    explanation: 'Strings are sequences of characters wrapped in quotes.',
    starterCode: '// Create your message variable here\n\n\n// Leave this here for testing\nreturn message;',
    expectedOutput: 'Hello World'
  },
  {
    order: 7,
    title: 'Inventory Array',
    description: 'Arrays can hold multiple values. Create an array named `inventory` containing exactly two strings: `"Sword"` and `"Shield"`.',
    explanation: 'Arrays are created using square brackets [].',
    starterCode: '// Create your inventory array here\n\n\n// Leave this here for testing\nreturn inventory.join(",");',
    expectedOutput: 'Sword,Shield'
  },
  {
    order: 8,
    title: 'Hero Object',
    description: 'Objects group related data. Create an object named `hero` with a single property `hp` set to the number `100`.',
    explanation: 'Objects use curly braces {} with key:value pairs.',
    starterCode: '// Create your hero object here\n\n\n// Leave this here for testing\nreturn hero.hp;',
    expectedOutput: '100'
  },
  {
    order: 9,
    title: 'Basic Math',
    description: 'Create a variable `x` set to `10`, a variable `y` set to `5`, and a variable `sum` that adds them together (`x + y`).',
    explanation: 'You can perform mathematical operations directly on variables.',
    starterCode: '// Create x, y, and sum here\n\n\n// Leave this here for testing\nreturn sum;',
    expectedOutput: '15'
  },
  {
    order: 10,
    title: 'Boss Battle: The Profile',
    description: 'Defeat the boss by creating a complex object! Create a `player` object with two properties: `name` (set to `"Explorer"`) and `level` (set to `5`).',
    explanation: 'Combine everything you learned to defeat the final boss of the Village of Variables!',
    starterCode: '// Create the player object here\n\n\n// Leave this here for testing\nreturn player.name + " Lvl " + player.level;',
    expectedOutput: 'Explorer Lvl 5'
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    for (const update of world1Updates) {
      await db.collection('challenges').updateOne(
        { world: 1, order: update.order },
        { $set: { 
            title: update.title,
            description: update.description,
            explanation: update.explanation,
            starterCode: update.starterCode,
            expectedOutput: update.expectedOutput
          } 
        }
      );
      console.log('Updated challenge order ' + update.order);
    }
    
    console.log('World 1 update complete!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

run();
