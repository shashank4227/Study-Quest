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
        content: "Operators are symbols used to perform operations on values and variables. JavaScript supports several types of operators:\n\n1. **Arithmetic Operators**: Used for math.\n   • `+` (Addition), `-` (Subtraction), `*` (Multiplication), `/` (Division), `%` (Remainder/Modulo), `**` (Exponentiation)\n\n2. **Assignment Operators**: Used to assign values.\n   • `=` (Assign), `+=`, `-=`, `*=`, `/=`\n\n3. **Comparison Operators**: Compare two values and return a boolean.\n   • `==` (Equal value), `===` (Equal value & type), `!=`, `!==`, `>`, `<`, `>=`, `<=`, `?` (Ternary)\n\n4. **Logical Operators**: Combine booleans.\n   • `&&` (Logical AND), `||` (Logical OR), `!` (Logical NOT)\n\n5. **Type Operators**: Check types.\n   • `typeof` (Returns type), `instanceof` (Checks object type)",
        codeSnippet: `// Arithmetic & Assignment
let x = 10 + 5; // 15
x *= 2;        // 30 (same as x = x * 2)

// Comparison & Logical
let isAdult = x >= 18; // true
let isStudent = false;
let discount = isAdult && isStudent; // false

// Ternary Operator
let message = isAdult ? "Allowed" : "Not Allowed";
console.log(message); // "Allowed"`,
        pitfall: "Be careful with `==` (loose equality) vs `===` (strict equality). `==` performs type conversion, so `5 == '5'` is `true`, but `5 === '5'` is `false`. Always prefer `===` for safety."
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
        title: "For Loop",
        content: "A `for` loop is perfect when you know exactly how many times you want to repeat an action. It consists of three parts: initialization (start here), condition (keep going while true), and iteration (what to do after each step).",
        codeSnippet: `// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Current count is: " + i);
}`,
        pitfall: "Be careful with the condition. If your condition is ALWAYS true (e.g., `i > 0` but you keep increasing `i`), you will create an Infinite Loop that crashes the browser."
      },
      {
        title: "While Loop",
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
        content: 'Operators are symbols that tell the compiler to perform specific mathematical or logical manipulations. C is rich in built-in operators:\n\n1. **Arithmetic Operators**:\n   • `+` (Add), `-` (Subtract), `*` (Multiply), `/` (Divide), `%` (Modulo/Remainder), `++` (Increment), `--` (Decrement)\n\n2. **Relational Operators**:\n   • `==` (Equal to), `!=` (Not equal to), `>`, `<`, `>=`, `<=`\n\n3. **Logical Operators**:\n   • `&&` (Logical AND), `||` (Logical OR), `!` (Logical NOT)\n\n4. **Bitwise Operators**:\n   • `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), `<<` (Left Shift), `>>` (Right Shift)\n\n5. **Assignment Operators**:\n   • `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`\n\n6. **Misc Operators**:\n   • `sizeof` (Size in bytes), `&` (Address of), `*` (Value at address / Dereference), `? :` (Conditional/Ternary)',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    // Arithmetic & Assignment\n    int a = 10, b = 3;\n    int sum = a + b;       // 13\n    int remainder = a % b; // 1\n\n    // Logical & Relational\n    int isAdult = (a >= 18);\n    int hasPermit = 0;\n    int canDrive = isAdult || hasPermit;\n\n    // Bitwise & Ternary\n    int mask = 1 << 3; // Shift 1 left by 3 bits (8)\n    int finalVal = (a > b) ? a : b; // Ternary select max (10)\n\n    printf("Sum: %d, Mod: %d, Ternary: %d\\n", sum, remainder, finalVal);\n    return 0;\n}',
        pitfall: 'Be careful with division between integers! In C, `5 / 2` evaluates to `2` (integer division truncates the remainder). If you want a decimal result, at least one operand must be a float/double (e.g. `5.0 / 2`). Also, `&` is both bitwise AND and address-of, and `*` is both multiplication and dereference, depending on context.'
      },
    ]
  },
  2: {
    title: 'Type Caverns',
    description: 'Understand data types, sizes, and memory representation in C.',
    sections: [
      {
        title: 'Integers & sizeof',
        content: 'The `sizeof` operator tells you how many bytes a type occupies. This is crucial for understanding memory usage in C.\n\nC integer types by size:\n• `char` — 1 byte\n• `short` — 2 bytes\n• `int` — 4 bytes\n• `long` — 4 or 8 bytes\n• `long long` — 8 bytes',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("int: %zu bytes\\n", sizeof(int));\n    printf("double: %zu bytes\\n", sizeof(double));\n    printf("char: %zu bytes\\n", sizeof(char));\n    return 0;\n}',
        pitfall: 'Use `%zu` (not `%d`) to print the result of `sizeof` as it returns type `size_t`, which is unsigned.'
      },
      {
        title: 'Type Casting',
        content: 'C allows you to convert between types using a cast. Be careful — casting can lose precision or cause unexpected results.\n\nImplicit casting (automatic) happens when mixing types in an expression. Explicit casting uses `(type)` syntax.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    float result = (float)a / b;\n    printf("%.2f\\n", result); // 3.50\n    return 0;\n}',
        pitfall: 'Integer division (e.g., `7/2`) always truncates — it gives `3`, not `3.5`. Cast at least one operand to `float` first.'
      },
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
        title: 'Loops: while and for',
        content: 'Loops repeat code. A `while` loop runs as long as a condition holds true. A `for` loop packages loop control (initialization, condition, and increment) in one line.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    // Print 1 to 3\n    for (int i = 1; i <= 3; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
        pitfall: 'Ensure your loop condition eventually becomes false, otherwise your program will run infinitely and hang.'
      }
    ]
  },
  4: {
    title: 'Pointer Peaks',
    description: 'Master pointers and direct memory manipulation.',
    sections: [
      {
        title: 'What is a Pointer?',
        content: 'A pointer is a variable that stores the memory address of another variable. This gives C its power — and its danger.\n\n• `&variable` — the address of a variable\n• `*pointer` — the value at the address (dereferencing)',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int score = 100;\n    int *ptr = &score;\n    printf("Value: %d\\n", *ptr);\n    printf("Address: %p\\n", (void*)ptr);\n    return 0;\n}',
        pitfall: 'Never dereference a NULL or uninitialized pointer. Always initialize pointers before use. This is the #1 cause of crashes in C programs.'
      },
    ]
  },
  5: {
    title: 'Struct Citadel',
    description: 'Build complex data layouts using structs and enums.',
    sections: [
      {
        title: 'Structs',
        content: 'A `struct` groups related variables under a single name. Think of it as a custom data type that can hold multiple fields.\n\nStructs are the foundation of C data modeling — similar to classes in Java or Python, but without methods.',
        codeSnippet: '#include <stdio.h>\n\nstruct Student {\n    char name[50];\n    int age;\n    float gpa;\n};\n\nint main() {\n    struct Student s;\n    s.age = 21;\n    s.gpa = 9.1;\n    printf("Age: %d, GPA: %.1f\\n", s.age, s.gpa);\n    return 0;\n}',
        pitfall: 'You cannot assign a string directly to a `char` array like `s.name = "Alice"`. Use `strcpy(s.name, "Alice")` from `<string.h>` instead.'
      },
    ]
  },
  6: {
    title: 'Allocation Abyss',
    description: 'Control heap memory with malloc, calloc, and free.',
    sections: [
      {
        title: 'Dynamic Memory Allocation',
        content: 'In C, you can allocate memory at runtime using `malloc`. This memory lives on the heap and must be explicitly freed with `free()`.\n\n• `malloc(n)` — allocates n bytes\n• `calloc(count, size)` — allocates and zeroes memory\n• `free(ptr)` — releases memory back to the OS',
        codeSnippet: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    for (int i = 0; i < 5; i++) arr[i] = i * 10;\n    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);\n    free(arr);\n    return 0;\n}',
        pitfall: 'Always call `free()` on memory you allocated. Failing to do so causes a memory leak — the memory stays consumed even after your program is done with it.'
      },
    ]
  },
};
