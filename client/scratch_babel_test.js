import Babel from '@babel/standalone';

const code = `// Write your code here
let arr = [10,21,30];

let even = arr.filter(a => a%2==0);

console.log(even);`;

try {
  const result = Babel.transform(code, {
    presets: ['env'],
    retainLines: true
  });
  console.log("=== ORIGINAL CODE ===");
  console.log(code);
  console.log("=== TRANSPILED CODE ===");
  console.log(result.code);
} catch(e) {
  console.error("Babel error:", e);
}
