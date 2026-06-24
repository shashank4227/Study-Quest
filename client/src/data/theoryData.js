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
      },
      {
        title: "Operators",
        content: "Operators are symbols used to perform operations on values and variables. JavaScript supports several types of operators:\n\n1. **Arithmetic Operators**: Used for math.\n   • `+` (Addition), `-` (Subtraction), `*` (Multiplication), `/` (Division), `%` (Remainder/Modulo)\n2. **Assignment Operators**: Used to assign values.\n   • `=` (Assign), `+=`, `-=`, `*=`, `/=`\n3. **Comparison Operators**: Compare two values and return a boolean.\n   • `===` (Equal value & type), `!==` (Not equal), `>`, `<`, `>=`, `<=`\n4. **Logical Operators**: Combine booleans.\n   • `&&` (Logical AND), `||` (Logical OR), `!` (Logical NOT)",
        codeSnippet: `// Arithmetic & Assignment
let x = 10 + 5; // 15
x *= 2;        // 30

// Comparison & Logical
let isAdult = x >= 18; // true
let isStudent = false;
let discount = isAdult && isStudent; // false`,
        pitfall: "Always prefer strict equality (`===`) over loose equality (`==`). Loose equality performs implicit type conversions, making `5 == '5'` true, which is a common source of bugs."
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
        pitfall: "Don't chain too many logical operators together without using parentheses `()`. It becomes difficult to read and JavaScript might evaluate them in an unexpected order."
      }
    ]
  },
  3: {
    title: "Loop Mountains",
    description: "Automate repetitive tasks without writing the same code twice.",
    sections: [
      {
        title: "For Loops",
        content: "A `for` loop is perfect when you know exactly how many times you want to repeat an action. It consists of three parts:\n1. **Initialization**: Declaring a loop counter (e.g., `let i = 1`).\n2. **Condition**: Kept running as long as this evaluates to true (e.g., `i <= 5`).\n3. **Increment**: Update counter after each iteration (e.g., `i++`).",
        codeSnippet: `// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Current count is: " + i);
}`,
        pitfall: "Be careful with the condition. If your condition is ALWAYS true, you will create an Infinite Loop that hangs the browser."
      },
      {
        title: "While Loops",
        content: "A `while` loop is used when you don't know in advance how many times the loop will run. It simply repeats an action AS LONG AS a condition remains true.",
        codeSnippet: `let bossHealth = 100;

while (bossHealth > 0) {
  console.log("Attacking the boss!");
  bossHealth -= 25; // Decrement health to prevent infinite loop
}`,
        pitfall: "Always ensure that the variables involved in the while condition are being modified INSIDE the loop. Otherwise, the condition will never become false."
      },
      {
        title: "Loop Control: break & continue",
        content: "You can alter the flow of a loop from the inside:\n• `break` stops the loop immediately and exits it.\n• `continue` skips the rest of the current iteration and jumps directly to the next loop cycle.",
        codeSnippet: `// Sum numbers 1 to 5, skipping 4, and breaking if sum >= 10
let sum = 0;
for (let i = 1; i <= 5; i++) {
  if (i === 4) continue; // Skip 4
  sum += i;
  if (sum >= 10) break;  // Exit loop
}`,
        pitfall: "Putting code after a `break` or `continue` within the same block makes it unreachable. Ensure it is the last statement executed in that branch."
      }
    ]
  },
  4: {
    title: "Function Kingdom",
    description: "Build reusable, modular logic blocks to avoid code duplication.",
    sections: [
      {
        title: "Declaring Functions",
        content: "A function is a block of code designed to perform a particular task. You define it once using the `function` keyword, specify parameters (input placeholders), and invoke (call) it with arguments.",
        codeSnippet: `// Declaring a function with a parameter
function sayHello(name) {
  return "Hello, " + name + "!";
}

// Calling the function
let greeting = sayHello("Zara"); // "Hello, Zara!"`,
        pitfall: "Forgetting the `return` statement in a function will cause it to return `undefined` by default when called."
      },
      {
        title: "Global vs Local Scope",
        content: "Scope determines the accessibility of variables:\n• **Global Scope**: Variables declared outside functions are global and can be accessed anywhere.\n• **Local Scope**: Variables declared inside a function are local to that function and cannot be accessed from outside.",
        codeSnippet: `let multiplier = 3; // Global variable

function multiplyBy(n) {
  let localResult = n * multiplier; // localResult is local
  return localResult;
}

console.log(multiplyBy(5)); // 15
// console.log(localResult); // Error: localResult is not defined`,
        pitfall: "Declaring a local variable with the same name as a global variable will 'shadow' the global one, making the global variable inaccessible within that function."
      },
      {
        title: "Math Library Functions",
        content: "JavaScript has a built-in `Math` object for mathematical constants and functions. Common utilities include:\n• `Math.PI` — ratio of circumference of a circle to its diameter (~3.14159).\n• `Math.round(x)` — rounds x to the nearest integer.",
        codeSnippet: `let radius = 3;
let area = Math.PI * radius * radius;
let roundedArea = Math.round(area * 100) / 100; // Rounds to 2 decimal places`,
        pitfall: "Remember that `Math` is capitalized! Writing `math.round()` or `math.pi` will throw a reference error."
      }
    ]
  },
  5: {
    title: "Array Dragon Cave",
    description: "Master lists of ordered data and use built-in array methods.",
    sections: [
      {
        title: "Creating and Accessing Arrays",
        content: "An array is a special variable that can hold more than one value at a time. It is structured as an ordered list where elements are accessed via numeric indices starting at `0`. The `.length` property tells you how many elements are in the array.",
        codeSnippet: `let bag = ["sword", "shield", "potion"];
console.log(bag[0]); // "sword"
console.log(bag.length); // 3`,
        pitfall: "Array indices are zero-based. The last element in an array named `arr` is located at `arr[arr.length - 1]`, not `arr[arr.length]`."
      },
      {
        title: "Array Methods: Modifying Lists",
        content: "JavaScript arrays have built-in methods to modify their contents:\n• `.push(item)`: Adds an item to the end of the array.\n• `.pop()`: Removes the last item of the array and returns it.\n• `.indexOf(item)`: Finds the index of a value, returning `-1` if not found.\n• `.slice(start, end)`: Returns a shallow copy of a portion of the array without modifying the original.",
        codeSnippet: `let party = ["Warrior", "Rogue"];
party.push("Mage"); // ["Warrior", "Rogue", "Mage"]
let last = party.pop(); // last = "Mage"

let idx = party.indexOf("Rogue"); // 1
let subset = party.slice(0, 1); // ["Warrior"]`,
        pitfall: "`.slice()` does not modify the original array (it returns a new one), whereas methods like `.push()` and `.pop()` modify the array in place."
      },
      {
        title: "Filtering & Transforming Arrays",
        content: "For advanced array manipulations, JavaScript provides functional methods:\n• `.filter(fn)`: Creates a new array with all elements that pass the test implemented by the provided function.\n• `.map(fn)`: Creates a new array populated with the results of calling a provided function on every element.",
        codeSnippet: `let movies = [
  { title: "Inception", rating: 8.8 },
  { title: "Avatar", rating: 7.8 }
];

// Get movies with rating >= 8.0
let filtered = movies.filter(m => m.rating >= 8.0);
// Extract titles only
let titles = filtered.map(m => m.title); // ["Inception"]`,
        pitfall: "Both `.filter()` and `.map()` return new arrays. They do not alter the source array, so make sure to assign their outputs to variables."
      }
    ]
  }
};

export const cTheoryData = {
  1: {
    title: 'Village of Syntax',
    description: 'Learn the fundamentals of C: basic I/O, variables, and your first program.',
    sections: [
      {
        title: 'Your First C Program',
        content: 'Every C program starts with a `main` function. The `#include <stdio.h>` directive gives you access to standard input/output functions like `printf` and `scanf`.\n\nC is a compiled language — your source code is translated directly into machine code, making it blazingly fast.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
        pitfall: 'Always end `printf` strings with `\\n` for a newline. Forgetting it can cause output to not flush in some environments.'
      },
      {
        title: 'Variables & Data Types',
        content: 'C uses static typing — you must declare the type of every variable before using it.\n\nCommon types:\n• `int` — integer numbers (4 bytes)\n• `float` — single-precision decimal (4 bytes)\n• `double` — double-precision decimal (8 bytes)\n• `char` — a single character (1 byte)',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int age = 20;\n    float gpa = 9.5;\n    char grade = \'A\';\n    printf("%d %.1f %c\\n", age, gpa, grade);\n    return 0;\n}',
        pitfall: 'Using `%d` for a `float` causes undefined behavior. Always match format specifiers to their types.'
      },
      {
        title: 'Reading Input with scanf',
        content: '`scanf` is used to read values from the user. You must pass a pointer to the variable using the `&` (address-of) operator.\n\nFormat specifiers:\n• `%d` — integer\n• `%f` — float\n• `%lf` — double\n• `%c` — character\n• `%s` — string',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num;\n    printf("Enter a number: ");\n    scanf("%d", &num);\n    printf("You entered: %d\\n", num);\n    return 0;\n}',
        pitfall: 'Never forget the `&` before the variable name in `scanf`. Without it, your program will crash with a segmentation fault.'
      },
      {
        title: 'Operators',
        content: 'Operators are symbols that tell the compiler to perform specific mathematical or logical manipulations. C is rich in built-ins:\n\n1. **Arithmetic Operators**:\n   • `+` (Add), `-` (Subtract), `*` (Multiply), `/` (Divide), `%` (Modulo/Remainder)\n2. **Relational Operators**:\n   • `==` (Equal to), `!=` (Not equal to), `>`, `<`, `>=`, `<=`\n3. **Logical Operators**:\n   • `&&` (Logical AND), `||` (Logical OR), `!` (Logical NOT)\n4. **Assignment Operators**:\n   • `=`, `+=`, `-=`, `*=`, `/=`, `%=`',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a = 10, b = 3;\n    int sum = a + b;       // 13\n    int remainder = a % b; // 1\n\n    int isAdult = (a >= 18);\n    int canDrive = isAdult && 1; // 1 (true)\n\n    printf("Sum: %d, Mod: %d, CanDrive: %d\\n", sum, remainder, canDrive);\n    return 0;\n}',
        pitfall: 'Be careful with integer division! In C, `5 / 2` evaluates to `2`. To get a decimal result, use floats (e.g. `5.0 / 2`).'
      }
    ]
  },
  2: {
    title: 'Type Caverns',
    description: 'Understand data types, sizes, and memory representation in C.',
    sections: [
      {
        title: 'Integers & sizeof',
        content: 'The `sizeof` operator tells you how many bytes of memory a specific type or variable occupies. This is crucial for performance and memory optimization in C.\n\nC integer types by size (typical systems):\n• `char` — 1 byte\n• `short` — 2 bytes\n• `int` — 4 bytes\n• `long` — 4 or 8 bytes\n• `long long` — 8 bytes\n\nUse the `%zu` format specifier to print `sizeof` values because it returns a `size_t` type.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("char: %zu bytes\\n", sizeof(char));\n    printf("int: %zu bytes\\n", sizeof(int));\n    printf("double: %zu bytes\\n", sizeof(double));\n    return 0;\n}',
        pitfall: 'Do not use `%d` or `%f` to print `sizeof` results; doing so can cause compiling errors or undefined output. Always use `%zu`.'
      },
      {
        title: 'Type Casting & Promotion',
        content: 'Type conversion occurs when a value of one type is converted into another.\n\n1. **Implicit Promotion**: Done automatically by the compiler. When mixing smaller/integer types with larger/floating-point types in math, C automatically promotes the smaller type (e.g., `int` + `double` promotes `int` to `double`).\n2. **Explicit Casting**: Done manually using the `(type)` prefix syntax. For example, `(float)a` tells the compiler to treat variable `a` as a float.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    // Explicit cast forces floating-point division\n    float result = (float)a / b;\n    printf("Result: %.1f\\n", result); // Outputs: 3.5\n\n    int x = 5;\n    double y = 2.5;\n    // Implicit promotion: x is promoted to double\n    double sum = x + y;\n    printf("Sum: %.1f\\n", sum); // Outputs: 7.5\n    return 0;\n}',
        pitfall: 'Integer division (e.g., `7 / 2`) in C discards the decimal part and returns `3`. Always cast at least one operand to `float` or `double` to get a decimal result.'
      },
      {
        title: 'Characters & ASCII Code',
        content: 'In C, a character variable (`char`) is stored as a 1-byte integer under the hood, representing its corresponding numeric value in the ASCII (American Standard Code for Information Interchange) table.\n\nBecause they are integers, you can print a `char` as a character using `%c`, or print its decimal ASCII code using `%d`. You can also do math directly on characters!',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    char letter = \'A\';\n    printf("Character: %c\\n", letter);\n    printf("ASCII Code: %d\\n", letter); // Outputs 65\n\n    // Char arithmetic: \'A\' + 1 = \'B\'\n    char nextLetter = letter + 1;\n    printf("Next: %c (ASCII: %d)\\n", nextLetter, nextLetter); \n    return 0;\n}',
        pitfall: 'Remember that single quotes are for single characters (e.g. `\'A\'`), whereas double quotes are for string literals (e.g. `"A"`). Writing `char c = "A";` will produce a compilation error.'
      },
      {
        title: 'Integer Overflow & Limits',
        content: 'Every data type in C has a maximum and minimum value it can hold based on its size in memory. The header file `<limits.h>` defines these constants (such as `INT_MIN`, `INT_MAX`, `CHAR_MAX`, etc.).\n\nIf you exceed the maximum limit of a type, **overflow** occurs. For instance, an `unsigned char` can only store values from `0` to `255`. If you add `1` to `255`, it wraps around to `0`.',
        codeSnippet: '#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    printf("Int Range: %d to %d\\n", INT_MIN, INT_MAX);\n\n    unsigned char num = 255;\n    num = num + 1; // Overflow!\n    printf("Overflowed Value: %d\\n", num); // Outputs 0\n    return 0;\n}',
        pitfall: 'Signed integer overflow is undefined behavior in C. Always ensure your variables are declared with a large enough type (e.g. using `long long` instead of `int` for very large numbers) to prevent unpredictable crashes.'
      },
      {
        title: 'Boolean Logic in C',
        content: 'Historically, C did not have a built-in boolean type. Instead, it treats `0` as **false** and any non-zero value (typically `1`) as **true**.\n\nModern C introduces `<stdbool.h>`, which allows you to use the `bool` type along with standard `true` and `false` constants, although underneath they are still stored as `1` and `0`.',
        codeSnippet: '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    bool flag = true;\n    printf("Flag numeric value: %d\\n", flag); // Outputs 1\n\n    // Plain integers used in logic\n    int score = 42;\n    if (score) {\n        printf("This executes because 42 is non-zero (true).\\n");\n    }\n    return 0;\n}',
        pitfall: 'Do not print boolean variables using `%s` or expect them to output the words "true" or "false". Print them as integers with `%d`.'
      }
    ]
  },
  3: {
    title: 'Forest of Control',
    description: 'Learn logic, conditions, and repeating operations in C.',
    sections: [
      {
        title: 'Conditionals: if and else',
        content: 'Conditional statements control program flow. An `if` statement evaluates a logical condition (non-zero is true, zero is false) and executes a block. An optional `else` block runs if the condition is false.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int score = 85;\n    if (score >= 50) {\n        printf("Pass\\n");\n    } else {\n        printf("Fail\\n");\n    }\n    return 0;\n}',
        pitfall: 'Remember that a single `=` performs assignment. Always use `==` for comparison in conditionals!'
      },
      {
        title: 'Logical & Relational Operators',
        content: 'Combine multiple condition checks using operators:\n• Relational: `==` (equality), `!=` (inequality), `>`, `<`, `>=`, `<=`\n• Logical AND `&&`: True only if BOTH conditions are true.\n• Logical OR `||`: True if AT LEAST ONE condition is true.\n• Logical NOT `!`: Reverses the truth value.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int temp = 25;\n    if (temp >= 10 && temp <= 20) {\n        printf("In range\\n");\n    } else {\n        printf("Out of range\\n"); // Outputs this\n    }\n    return 0;\n}',
        pitfall: 'Ensure relational expressions are logically isolated. E.g., do not write `10 <= x <= 20` directly in C; instead, use `x >= 10 && x <= 20`.'
      },
      {
        title: 'The switch Statement',
        content: 'A `switch` statement selects one of many code blocks to be executed. It tests a variable against a list of values defined by `case` labels. Use `default` to handle non-matching cases, and remember to use `break` to exit the switch structure.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int medal = 1;\n    switch(medal) {\n        case 1:\n            printf("Gold\\n");\n            break;\n        case 2:\n            printf("Silver\\n");\n            break;\n        default:\n            printf("No medal\\n");\n    }\n    return 0;\n}',
        pitfall: 'If you omit the `break` statement at the end of a case block, execution will "fall through" into the next case automatically, executing unintended code.'
      },
      {
        title: 'Loops: while and for',
        content: 'Loops repeat code. A `while` loop runs as long as a condition holds true. A `for` loop packages loop control (initialization, condition, and increment) in one line.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    // Print 1 to 3\n    for (int i = 1; i <= 3; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
        pitfall: 'Ensure your loop condition eventually becomes false, otherwise your program will run infinitely and hang.'
      },
      {
        title: 'Loop Control: break and continue',
        content: 'Alter loop behaviors from inside:\n• `break` exits the loop immediately.\n• `continue` skips the rest of the current iteration and jumps directly to the next iteration step.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        if (i == 4) continue; // Skip 4\n        printf("%d ", i);     // Outputs: 1 2 3 5\n    }\n    return 0;\n}',
        pitfall: 'Make sure increment expressions are executed before `continue` in `while` loops, otherwise you will cause an infinite loop.'
      }
    ]
  },
  4: {
    title: 'Pointer Peaks',
    description: 'Master pointers and direct memory manipulation.',
    sections: [
      {
        title: 'What is a Pointer?',
        content: 'A pointer is a variable that stores the memory address of another variable. This gives C its power — and its danger.\n\n• `&variable` — the address of a variable (address-of operator)\n• `*pointer` — access the value stored at the address (dereferencing operator)',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int score = 100;\n    int *ptr = &score; // ptr stores address of score\n    printf("Value: %d\\n", *ptr); // Dereference ptr to print 100\n    return 0;\n}',
        pitfall: 'Never dereference a NULL or uninitialized pointer. Always initialize pointers before use. This is the #1 cause of crashes in C programs.'
      },
      {
        title: 'Pointer Arithmetic & Arrays',
        content: 'Arrays in C are stored contiguously in memory. The array name itself behaves like a pointer to its first element (`arr` is equivalent to `&arr[0]`).\n\nAdding `1` to a pointer increases its address by the size of the data type it points to. E.g., if `ptr` is an integer pointer, `ptr + 1` shifts the address forward by 4 bytes to point to the next integer.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int *ptr = arr;\n    printf("First: %d\\n", *ptr);\n    printf("Second: %d\\n", *(ptr + 1)); // Pointer offset\n    return 0;\n}',
        pitfall: 'Do not dereference pointer arithmetic that goes beyond the bounds of the array. Doing so leads to undefined behavior and buffer overflows.'
      },
      {
        title: 'Double Pointers (Pointer to Pointer)',
        content: 'A pointer is a variable, so it also has an address in memory. A double pointer is a variable that stores the address of another pointer. It is declared using two asterisks: `int **pp`.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int val = 7;\n    int *ptr = &val;\n    int **pp = &ptr;\n    printf("Value: %d\\n", **pp); // Double dereference\n    return 0;\n}',
        pitfall: 'Ensure each level of pointer is correctly initialized before dereferencing.'
      },
      {
        title: 'Passing by Reference (Functions)',
        content: 'By default, C passes arguments by value (making copies). To allow a function to modify variables in the caller\'s scope, you must pass the addresses of those variables (pass by reference) and receive them as pointer parameters.',
        codeSnippet: '#include <stdio.h>\n\nvoid swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n\nint main() {\n    int a = 5, b = 9;\n    swap(&a, &b); // Pass addresses\n    printf("a=%d b=%d\\n", a, b); // Outputs: a=9 b=5\n    return 0;\n}',
        pitfall: 'Ensure you pass the address (using `&`) when calling a function that expects pointers, otherwise you will pass a raw integer as a memory address and crash the program.'
      }
    ]
  },
  5: {
    title: 'Struct Citadel',
    description: 'Build complex data layouts using structs and enums.',
    sections: [
      {
        title: 'Structs Basics',
        content: 'A `struct` groups related variables of different types under a single name. Think of it as a custom data type that can hold multiple fields.\n\nStructs are the foundation of C data modeling — similar to classes in OOP, but without methods.',
        codeSnippet: '#include <stdio.h>\n\nstruct Student {\n    char name[50];\n    int age;\n    float gpa;\n};\n\nint main() {\n    struct Student s = {"Alice", 21, 9.1};\n    printf("Age: %d, GPA: %.1f\\n", s.age, s.gpa);\n    return 0;\n}',
        pitfall: 'You cannot assign a string directly to a `char` array field using `=`, e.g. `s.name = "Alice"`. Use `strcpy(s.name, "Alice")` from `<string.h>` instead.'
      },
      {
        title: 'typedef & Struct Pointers',
        content: '• `typedef`: Used to define aliases for types to write cleaner code without typing `struct` repeatedly.\n• Struct Pointers: Pointers to structs require using the arrow operator `->` instead of `.` to access member fields.',
        codeSnippet: '#include <stdio.h>\n\ntypedef struct {\n    int speed;\n} Car;\n\nint main() {\n    Car c = {100};\n    Car *ptr = &c;\n    ptr->speed = 120; // Arrow operator access\n    printf("Speed: %d\\n", ptr->speed);\n    return 0;\n}',
        pitfall: '`ptr->speed` is shorthand for `(*ptr).speed`. Writing `*ptr.speed` will cause a compiler error due to operator precedence.'
      },
      {
        title: 'Enums & Sizing/Padding',
        content: '• `enum`: Group of named integer constants. By default, values start at `0` and increment by `1`.\n• Struct Size & Padding: The size of a struct might be larger than the sum of its individual parts because the compiler adds padding bytes to align fields with memory boundaries (e.g. 4-byte boundaries for `int`).',
        codeSnippet: '#include <stdio.h>\n\nenum Day { MON = 1, TUE, WED }; // MON=1, TUE=2, WED=3\n\nstruct Data {\n    char a; // 1 byte + 3 bytes padding\n    int b;  // 4 bytes\n};\n\nint main() {\n    printf("WED value: %d\\n", WED);\n    printf("Data Size: %zu bytes (not 5!)\\n", sizeof(struct Data)); // Outputs 8\n    return 0;\n}',
        pitfall: 'Never assume the size of a struct is a simple addition of its types. Always use `sizeof()` to find the correct size in memory.'
      }
    ]
  },
  6: {
    title: 'Allocation Abyss',
    description: 'Control heap memory with malloc, calloc, and free.',
    sections: [
      {
        title: 'Dynamic Memory Allocation',
        content: 'In C, you can allocate memory at runtime using `malloc`. This memory lives on the heap and must be explicitly freed with `free()`.\n\n• `malloc(n)` — allocates n bytes. Returns a `void*` pointing to the block, which should be cast to the desired type.\n• `free(ptr)` — releases the heap memory back to the system.',
        codeSnippet: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int*)malloc(sizeof(int));\n    *ptr = 42;\n    printf("Value: %d\\n", *ptr);\n    free(ptr); // Free allocation\n    return 0;\n}',
        pitfall: 'Always call `free()` on dynamically allocated memory. Failing to do so causes a memory leak, exhausting memory over time.'
      },
      {
        title: 'calloc & realloc',
        content: '• `calloc(count, size)`: Allocates memory for an array, initializes all bits to `0` (unlike `malloc` which contains garbage values).\n• `realloc(ptr, new_size)`: Resizes an existing heap allocation to a new size, keeping old contents intact.',
        codeSnippet: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Allocate zeroed array of 3 ints\n    int *arr = (int*)calloc(3, sizeof(int));\n    printf("First: %d\\n", arr[0]); // Outputs 0\n\n    // Resize array to 5 ints\n    arr = (int*)realloc(arr, 5 * sizeof(int));\n    free(arr);\n    return 0;\n}',
        pitfall: '`realloc` might move the memory block to a new location. It returns the new pointer address, so always reassign your variable: `ptr = realloc(ptr, size)`.'
      },
      {
        title: 'NULL Checks & Safety',
        content: 'Heap allocation can fail if the system is out of memory. If so, `malloc`, `calloc`, and `realloc` return `NULL`.\n\nYou must always check if the returned pointer is `NULL` before using it to prevent crashes.',
        codeSnippet: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int*)malloc(1000 * sizeof(int));\n    if (ptr == NULL) {\n        printf("Allocation failed!\\n");\n        return 1;\n    }\n    // Safe to use ptr\n    free(ptr);\n    return 0;\n}',
        pitfall: 'Dereferencing a `NULL` pointer (e.g. `*ptr = 10` when `ptr` is `NULL`) causes a Segmentation Fault and immediate crash.'
      }
    ]
  }
};
