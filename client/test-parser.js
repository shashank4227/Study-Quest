import { analyzeExecution } from './src/utils/codeParser.js';

const code = `
let inventory = ["Sword", "Shield"];
let obj = { name: "Bob", age: 30 };
`;
const timeline = analyzeExecution(code);
const lastFrame = timeline[timeline.length - 1];
console.log("Timeline length:", timeline.length);
console.log("Memory in last frame:", lastFrame.memory);
