const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed.js');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find things like:
// \n    int a, b;
// \n    scanf("%d %d", &a, &b);
//
// In seed.js, the starterCode string contains literal "\n". Wait, if it's a literal "\n" in the source code file,
// it's actually written as backslash n in the file!
// Yes, `seed.js` has string literals like: '#include <stdio.h>\\n\\nint main() {\\n    int num;\\n    scanf("%d", &num);\\n'
// Wait! If the file contains `\n` literally as two characters, then my regex needs to match `\\n`.
// Let's match both. Actually, `content` is the literal file text, so `\n` is two chars.
// So we must match `\\n\\s+(int|float|double)\\s+[a-zA-Z0-9_, ]+;\\n\\s+scanf\\([^;]+\\);`
// In a JS regex literal `//`, `\` must be escaped to match a literal backslash.
// So `/\\\\n\\\\s+(int|float|double)\\\\s+[a-zA-Z0-9_, ]+;\\\\n\\\\s+scanf\\\\([^;]+\\\\);/g`
// That's confusing. Let's use `new RegExp` to be safe and clean.

const regex = new RegExp(
  "\\\\n\\\\s+(int|float|double)\\\\s+[a-zA-Z0-9_, ]+;\\\\n\\\\s+scanf\\\\([^;]+\\\\);", "g"
);

// Actually, wait, \s matches space. Let's just match any whitespace or literal \n
// A simpler string replacement logic since we know exactly what's there.
// Instead of complex regex, let's just use `\\\\n\\s*(int|float|double)[^;]+;\\\\n\\s*scanf\\\\([^;]+\\\\);`

const simplerRegex = /\\n\s*(int|float|double)[^;]+;\\n\s*scanf\([^;]+\);/g;

content = content.replace(simplerRegex, '');

fs.writeFileSync(filePath, content);
console.log('Done!');
