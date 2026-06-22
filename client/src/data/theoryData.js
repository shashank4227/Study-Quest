export const theoryData = {
  1: {
    title: "Village of Variables",
    description: "Master the basics of data storage and memory management.",
    sections: [
      {
        title: "The Concept of Variables",
        content: "Think of a variable as a labeled box in your computer's memory. When you want to store information—like a player's score or a username—you put it inside a box and write a name on it so you can find it later. In modern JavaScript, we use `let` and `const` to create these boxes.",
        codeSnippet: `// Creating a box named 'score' and putting 100 inside
let score = 100;

// Creating a box that cannot be changed later
const maxLevel = 50;`,
        pitfall: "Do not use the outdated `var` keyword. It behaves unpredictably with scope and can lead to bugs that are hard to track down."
      },
      {
        title: "Data Types: Strings, Numbers, and Booleans",
        content: "Data comes in different flavors. A `Number` is used for math (e.g., 42). A `String` is text, wrapped in quotes (e.g., 'Hello World'). A `Boolean` represents absolute truth, being strictly `true` or `false`.",
        codeSnippet: `let playerName = "Arthas"; // String
let currentHealth = 85.5;  // Number
let isAlive = true;        // Boolean`,
        pitfall: "Mixing data types accidentally can cause issues. For example, adding a String and a Number together results in a concatenated String ('5' + 5 = '55'), not a mathematical addition."
      },
      {
        title: "Updating Variables",
        content: "Variables declared with `let` can have their contents replaced or updated at any time. This is essential for tracking things that change over time, like lowering a player's health when they take damage.",
        codeSnippet: `let health = 100;
// Player takes 20 damage
health = health - 20;

// Shorthand syntax
health -= 20;`,
        pitfall: "Trying to update a variable declared with `const` will throw a TypeError and crash your program. Use `const` by default, and `let` only when you know the value must change."
      }
    ]
  },
  2: {
    title: "Forest of Conditions",
    description: "Learn to make decisions and control the flow of your program.",
    sections: [
      {
        title: "If/Else Statements",
        content: "Programs need to make decisions based on changing circumstances. An `if` statement evaluates a condition. If the condition is `true`, it runs a block of code. If it is `false`, it skips it, potentially falling back to an `else` block.",
        codeSnippet: `let playerLevel = 10;
let requiredLevel = 15;

if (playerLevel >= requiredLevel) {
  console.log("You may enter the dungeon.");
} else {
  console.log("You are not strong enough yet.");
}`,
        pitfall: "Using a single equals sign (`=`) inside an if-statement performs an assignment, not a comparison. Always use `===` for checking equality."
      },
      {
        title: "Logical Operators (AND / OR)",
        content: "Often, a decision requires checking multiple things at once. The AND operator (`&&`) requires ALL conditions to be true. The OR operator (`||`) requires AT LEAST ONE condition to be true.",
        codeSnippet: `let hasKey = true;
let hasMap = false;

// && means BOTH must be true
if (hasKey && hasMap) {
  console.log("You found the treasure!");
}

// || means AT LEAST ONE must be true
if (hasKey || hasMap) {
  console.log("You can at least start the journey.");
}`,
        pitfall: "Don't chain too many logical operators together without using parentheses `()`. It becomes difficult to read and JavaScript might evaluate them in an order you didn't expect."
      }
    ]
  },
  3: {
    title: "Loop Mountains",
    description: "Automate repetitive tasks without writing the same code twice.",
    sections: [
      {
        title: "The For Loop",
        content: "A `for` loop is perfect when you know exactly how many times you want to repeat an action. It consists of three parts: initialization (start here), condition (keep going while true), and iteration (what to do after each step).",
        codeSnippet: `// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Current count is: " + i);
}`,
        pitfall: "Be careful with the condition. If your condition is ALWAYS true (e.g., `i > 0` but you keep increasing `i`), you will create an Infinite Loop that crashes the browser."
      },
      {
        title: "The While Loop",
        content: "A `while` loop is used when you don't know in advance how many times the loop will run. It simply repeats an action AS LONG AS a condition remains true.",
        codeSnippet: `let bossHealth = 100;

while (bossHealth > 0) {
  console.log("Attacking the boss!");
  bossHealth -= 25; // Without this, the loop never ends!
}`,
        pitfall: "Always ensure that the variables involved in the while condition are being modified INSIDE the loop. Otherwise, the condition will never become false."
      }
    ]
  }
};
