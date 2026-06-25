const fs = require('fs');
let text = fs.readFileSync('src/utils/seed.js', 'utf8');

const targetCases = `        testCases: [
          { input: '75', expectedOutput: 'Pass\\n' },
          { input: '43', expectedOutput: 'Fail\\n' }
        ],`;
const newCases = `        testCases: [
          { input: '50', expectedOutput: 'Pass\\n' },
          { input: '75', expectedOutput: 'Pass\\n' },
          { input: '43', expectedOutput: 'Fail\\n' }
        ],`;

text = text.replace(targetCases, newCases);

// Replace variable declarations + scanf safely
text = text.replace(/\\n    int a, b;\\n    scanf\("%d %d", &a, &b\);/g, '');
text = text.replace(/\\n    int dividend, divisor;\\n    scanf\("%d %d", &dividend, &divisor\);/g, '');
text = text.replace(/\\n    int km;\\n    scanf\("%d", &km\);/g, '');
text = text.replace(/\\n    int num;\\n    scanf\("%d", &num\);/g, '');
text = text.replace(/\\n    int rank;\\n    scanf\("%d", &rank\);/g, '');
text = text.replace(/\\n    int n;\\n    scanf\("%d", &n\);/g, '');
text = text.replace(/\\n    int x, y;\\n    scanf\("%d %d", &x, &y\);/g, '');
text = text.replace(/\\n    float c;\\n    scanf\("%f", &c\);/g, '');
text = text.replace(/\\n    double r;\\n    scanf\("%lf", &r\);/g, '');
text = text.replace(/\\n    int score;\\n    scanf\("%d", &score\);/g, '');

fs.writeFileSync('src/utils/seed.js', text);
console.log('Seed file successfully patched safely.');
