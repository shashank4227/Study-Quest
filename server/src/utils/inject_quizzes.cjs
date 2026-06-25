const fs = require('fs');

const file = '../../client/src/data/theoryData.js';
let data = fs.readFileSync(file, 'utf8');

const getQuiz = (pitfall) => {
  if (pitfall.includes('return `undefined`')) {
    return `,\n        quiz: {\n          question: "What does a JavaScript function return by default if you don't explicitly use the 'return' keyword?",\n          options: ["null", "0", "undefined", "false"],\n          correctIndex: 2,\n          explanation: "If a function doesn't have a return statement, JavaScript automatically returns 'undefined' when it finishes executing."\n        }`;
  }
  if (pitfall.includes('shadow')) {
    return `,\n        quiz: {\n          question: "What happens if you declare a local variable with the exact same name as a global variable?",\n          options: ["It updates the global variable.", "It throws an error.", "It 'shadows' the global variable, making the global one inaccessible inside that function.", "It creates a parallel universe."],\n          correctIndex: 2,\n          explanation: "Local variables take precedence over global ones with the same name, a concept known as 'shadowing'."\n        }`;
  }
  if (pitfall.includes('Math is capitalized')) {
    return `,\n        quiz: {\n          question: "Why would 'math.round(4.5)' throw a reference error in JavaScript?",\n          options: ["Because you should use 'Math.floor()'.", "Because the 'Math' object must be capitalized.", "Because it only accepts integers.", "Because 4.5 is not a valid number."],\n          correctIndex: 1,\n          explanation: "Built-in JavaScript objects like 'Math' are case-sensitive and must be capitalized."\n        }`;
  }
  if (pitfall.includes('zero-based')) {
    return `,\n        quiz: {\n          question: "If an array has 5 elements, what is the index of the very last element?",\n          options: ["5", "4", "0", "6"],\n          correctIndex: 1,\n          explanation: "Arrays are zero-indexed, meaning the first element is at 0, and the last is at length - 1 (which is 4 in this case)."\n        }`;
  }
  if (pitfall.includes('.slice() does not modify')) {
    return `,\n        quiz: {\n          question: "Which of the following array methods modifies the original array instead of creating a new one?",\n          options: [".slice()", ".push()", ".filter()", ".map()"],\n          correctIndex: 1,\n          explanation: ".push() mutates the original array by adding an element, whereas .slice(), .filter(), and .map() return entirely new arrays."\n        }`;
  }
  if (pitfall.includes('Both .filter() and .map() return new arrays')) {
    return `,\n        quiz: {\n          question: "What is the primary difference between .map() and traditional loops like 'for' when transforming data?",\n          options: [".map() modifies the original array.", ".map() returns a completely new array with the transformed values.", ".map() is only for numbers.", ".map() cannot use arrow functions."],\n          correctIndex: 1,\n          explanation: ".map() is a pure function that returns a new array, leaving the original array untouched."\n        }`;
  }
  if (pitfall.includes('\\\\n')) {
    return `,\n        quiz: {\n          question: "Why is it important to include '\\\\n' at the end of a printf statement in C?",\n          options: ["It makes the text bold.", "It flushes the output buffer and moves the cursor to the next line.", "It tells the compiler the string is finished.", "It prevents memory leaks."],\n          correctIndex: 1,\n          explanation: "The newline character '\\\\n' visually breaks the line and ensures the output buffer is flushed to the screen immediately."\n        }`;
  }
  if (pitfall.includes('undefined behavior')) {
    return `,\n        quiz: {\n          question: "What happens if you use the '%d' format specifier to print a float variable?",\n          options: ["It rounds the float to the nearest integer.", "It works perfectly.", "It causes undefined behavior and prints garbage values.", "It converts the float to a string."],\n          correctIndex: 2,\n          explanation: "Format specifiers must match the variable type exactly. Mixing them up causes undefined behavior in C."\n        }`;
  }
  if (pitfall.includes('&')) {
    return `,\n        quiz: {\n          question: "What vital character must precede a variable name when using scanf to read input (for standard types like int)?",\n          options: ["*", "%", "$", "&"],\n          correctIndex: 3,\n          explanation: "The '&' (address-of) operator tells scanf exactly where in memory to store the user's input."\n        }`;
  }
  if (pitfall.includes('5 / 2')) {
    return `,\n        quiz: {\n          question: "In C, what is the result of the integer division '5 / 2'?",\n          options: ["2.5", "2", "3", "Error"],\n          correctIndex: 1,\n          explanation: "Integer division discards the decimal portion entirely, resulting in 2."\n        }`;
  }
  if (pitfall.includes('discards the decimal part')) {
    return `,\n        quiz: {\n          question: "How do you ensure a division between two integers results in a floating-point decimal?",\n          options: ["Change the division symbol to //", "Store the result in an int", "Explicitly cast at least one of the integers to a float or double", "It is impossible"],\n          correctIndex: 2,\n          explanation: "Casting forces the compiler to perform floating-point division rather than integer division."\n        }`;
  }
  if (pitfall.includes('single quotes')) {
    return `,\n        quiz: {\n          question: "Which of the following is the correct way to declare a single character in C?",\n          options: ["char c = \\"A\\";", "char c = 'A';", "char c = A;", "character c = 'A';"],\n          correctIndex: 1,\n          explanation: "Single characters must be enclosed in single quotes. Double quotes are strictly for strings."\n        }`;
  }
  if (pitfall.includes('overflow is undefined behavior')) {
    return `,\n        quiz: {\n          question: "What happens when you add 1 to a variable that is already at its maximum possible value?",\n          options: ["The program automatically upgrades the variable type.", "It results in an Overflow, often wrapping around to the minimum value.", "It caps the value at the maximum.", "It throws an exception and safely halts."],\n          correctIndex: 1,\n          explanation: "C does not protect against overflow. Exceeding the maximum limit causes the value to wrap around."\n        }`;
  }
  if (pitfall.includes('output the words "true" or "false"')) {
    return `,\n        quiz: {\n          question: "How are the boolean values 'true' and 'false' stored internally in C?",\n          options: ["As the strings 'true' and 'false'", "As the integers 1 and 0", "As special keywords", "As floating point numbers"],\n          correctIndex: 1,\n          explanation: "Under the hood, C treats the integer 0 as false and any non-zero integer (usually 1) as true."\n        }`;
  }
  if (pitfall.includes('Always use `==`')) {
    return `,\n        quiz: {\n          question: "What is the difference between '=' and '==' in a conditional statement?",\n          options: ["They are identical.", "'=' compares values, '==' assigns values.", "'=' assigns a value, '==' compares values for equality.", "'==' is only used for strings."],\n          correctIndex: 2,\n          explanation: "Using '=' in an if-statement accidentally overwrites the variable, whereas '==' properly compares it."\n        }`;
  }
  if (pitfall.includes('10 <= x <= 20')) {
    return `,\n        quiz: {\n          question: "How should you correctly write the condition 'x is between 10 and 20' in C?",\n          options: ["10 <= x <= 20", "x >= 10 && x <= 20", "x >= 10 || x <= 20", "x > 10 and x < 20"],\n          correctIndex: 1,\n          explanation: "C cannot evaluate chained relational operators like math equations. You must separate them with the logical AND (&&) operator."\n        }`;
  }
  if (pitfall.includes('fall through')) {
    return `,\n        quiz: {\n          question: "What happens if you forget to include a 'break' statement at the end of a 'case' in a switch block?",\n          options: ["The switch statement immediately exits.", "The compiler throws a syntax error.", "Execution 'falls through' to the next case automatically.", "The program crashes."],\n          correctIndex: 2,\n          explanation: "Without a break statement, C will continue executing the code for the subsequent cases until it hits a break or the end of the switch."\n        }`;
  }
  if (pitfall.includes('hang indefinitely')) {
    return `,\n        quiz: {\n          question: "What happens if a while loop's condition never evaluates to false?",\n          options: ["It skips the loop entirely.", "It runs exactly once.", "It gets stuck in an infinite loop and hangs.", "It automatically terminates after 1000 iterations."],\n          correctIndex: 2,\n          explanation: "If the condition variables are never updated, the loop runs endlessly."\n        }`;
  }
  if (pitfall.includes('increment is below the `continue`')) {
    return `,\n        quiz: {\n          question: "Why is using 'continue' inside a 'while' loop riskier than in a 'for' loop?",\n          options: ["Because 'continue' does not work in while loops.", "Because it might skip the increment step, causing an infinite loop.", "Because while loops are slower.", "Because it exits the loop entirely."],\n          correctIndex: 1,\n          explanation: "In a for loop, 'continue' automatically triggers the increment step. In a while loop, you must ensure the increment happens before the continue."\n        }`;
  }
  if (pitfall.includes('garbage return values')) {
    return `,\n        quiz: {\n          question: "If a function is declared to return an 'int', what must the function body contain?",\n          options: ["A void keyword", "A return statement that returns an integer", "A print statement", "A pointer"],\n          correctIndex: 1,\n          explanation: "You must fulfill the contract of the function signature by returning the promised data type."\n        }`;
  }
  if (pitfall.includes('bare `return;`')) {
    return `,\n        quiz: {\n          question: "Can you use a 'return;' statement (with no value) inside a function returning 'void'?",\n          options: ["Yes, to exit the function early.", "No, void functions cannot use return.", "Yes, but it will return 0.", "No, it causes a memory leak."],\n          correctIndex: 0,\n          explanation: "A bare 'return;' safely exits a void function before reaching the end of the block."\n        }`;
  }
  if (pitfall.includes('A mismatch will cause')) {
    return `,\n        quiz: {\n          question: "What happens if your function prototype does not match the actual function definition?",\n          options: ["The compiler automatically fixes it.", "It compiles, but runs slowly.", "The compiler throws an error.", "The prototype is ignored."],\n          correctIndex: 2,\n          explanation: "Prototypes must exactly mirror the definition's return type and parameter list to compile successfully."\n        }`;
  }
  if (pitfall.includes('#1 cause of crashes')) {
    return `,\n        quiz: {\n          question: "What is a pointer in C?",\n          options: ["A variable that stores a string.", "A variable that stores the memory address of another variable.", "A keyword used to exit loops.", "A function type."],\n          correctIndex: 1,\n          explanation: "Pointers 'point' to locations in memory rather than holding raw data values themselves."\n        }`;
  }
  if (pitfall.includes('undefined behavior and buffer overflows')) {
    return `,\n        quiz: {\n          question: "If 'ptr' is a pointer to an integer (which is 4 bytes), what happens when you do 'ptr + 1'?",\n          options: ["The address increases by 1 byte.", "The address increases by 4 bytes.", "The value of the integer increases by 1.", "The pointer is deleted."],\n          correctIndex: 1,\n          explanation: "Pointer arithmetic automatically scales by the size of the data type it points to."\n        }`;
  }
  if (pitfall.includes('Each level of pointer')) {
    return `,\n        quiz: {\n          question: "How do you declare a double pointer (a pointer that points to another pointer) for an integer?",\n          options: ["int ptr;", "int *ptr;", "int **ptr;", "int ptr**;"],\n          correctIndex: 2,\n          explanation: "Two asterisks '**' denote a pointer to a pointer."\n        }`;
  }
  if (pitfall.includes('pass a raw integer as a memory address')) {
    return `,\n        quiz: {\n          question: "If you want a function to modify a variable from the caller's scope, what must you pass to the function?",\n          options: ["The variable's value", "The variable's memory address using '&'", "A global variable", "A copy of the variable"],\n          correctIndex: 1,\n          explanation: "Passing the address (pass by reference) allows the function to dereference it and modify the original data."\n        }`;
  }
  if (pitfall.includes('strcpy')) {
    return `,\n        quiz: {\n          question: "Why can't you assign a string directly to a char array inside a struct using '=' (e.g., s.name = \\"Alice\\")?",\n          options: ["Because strings don't exist in C.", "Because arrays are not modifiable l-values; you must use string copying functions like strcpy.", "Because structs are read-only.", "Because the string is too long."],\n          correctIndex: 1,\n          explanation: "In C, you cannot reassign arrays directly after declaration. You must copy the contents into the array memory."\n        }`;
  }
  if (pitfall.includes('(*ptr).speed')) {
    return `,\n        quiz: {\n          question: "When accessing a member of a struct through a pointer, which operator should you use?",\n          options: [". (dot)", "-> (arrow)", "& (address-of)", "* (asterisk)"],\n          correctIndex: 1,\n          explanation: "The arrow operator '->' is a shorthand for dereferencing the pointer and accessing the member."\n        }`;
  }
  if (pitfall.includes('not a simple addition')) {
    return `,\n        quiz: {\n          question: "Why might the size of a struct be larger than the sum of the sizes of its individual members?",\n          options: ["Because structs have hidden metadata.", "Because the compiler adds padding bytes for memory alignment.", "Because the struct name takes up space.", "It's a bug in C."],\n          correctIndex: 1,\n          explanation: "Processors read memory more efficiently when data is aligned, so compilers insert invisible padding bytes."\n        }`;
  }
  if (pitfall.includes('memory leak')) {
    return `,\n        quiz: {\n          question: "What is a 'memory leak' in C?",\n          options: ["When memory hardware physically degrades.", "When you allocate heap memory with malloc but forget to free() it.", "When variables overwrite each other.", "When the stack size is too small."],\n          correctIndex: 1,\n          explanation: "Failing to release allocated memory means it is lost forever during the program's execution, eventually causing it to run out of memory."\n        }`;
  }
  if (pitfall.includes('reassign your variable')) {
    return `,\n        quiz: {\n          question: "What is the primary difference between malloc and calloc?",\n          options: ["calloc is faster.", "malloc is only for arrays.", "calloc initializes the allocated memory to zero, whereas malloc leaves it with garbage values.", "There is no difference."],\n          correctIndex: 2,\n          explanation: "calloc clears the memory bits to 0, which is safer but slightly slower than malloc."\n        }`;
  }
  if (pitfall.includes('Segmentation Fault')) {
    return `,\n        quiz: {\n          question: "Why is it critical to check if a pointer returned by malloc is NULL?",\n          options: ["Because NULL pointers are faster.", "Because memory allocation can fail, and dereferencing a NULL pointer crashes the program.", "Because malloc always returns NULL the first time.", "Because NULL pointers save memory."],\n          correctIndex: 1,\n          explanation: "If the system runs out of heap space, malloc fails gracefully by returning NULL. You must handle this to prevent a fatal crash."\n        }`;
  }
  
  // Generic fallback
  return `,\n        quiz: {\n          question: "Did you understand the concepts in this section?",\n          options: ["Yes, I'm ready to continue!", "No, I will review it again.", "Sort of.", "Not at all."],\n          correctIndex: 0,\n          explanation: "Great! Let's keep moving forward."\n        }`;
};

const lines = data.split(/\\r?\\n/);
let injectedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.trim().startsWith('pitfall:')) {
    let pitfallLineIndex = i;
    let pitfallText = line;
    
    // Look ahead to check if there is a quiz
    let j = i + 1;
    let foundQuiz = false;
    while (j < lines.length) {
      if (lines[j].trim().startsWith('quiz:')) {
        foundQuiz = true;
        break;
      }
      if (lines[j].trim() === '}' || lines[j].trim() === '},') {
        break;
      }
      j++;
    }
    
    if (!foundQuiz) {
      // Remove any trailing comma from the pitfall line just in case (shouldn't be there, but just safe)
      pitfallText = pitfallText.replace(/,\\s*$/, '');
      const quizToInject = getQuiz(pitfallText);
      lines[pitfallLineIndex] = pitfallText + quizToInject;
      injectedCount++;
    }
  }
}

fs.writeFileSync(file, lines.join('\\n'), 'utf8');
console.log('Quizzes injected successfully! Total injected: ' + injectedCount);
