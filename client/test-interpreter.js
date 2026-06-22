import Interpreter from 'js-interpreter';

const code = `
const pi = 3.14;
let r = 10;
let num = 1;
for(let i = 0;i<10;i++){
    num+=i;
}
console.log(3.14 * r*r);
`;

const es5Code = code
  .replace(/\bconst\b/g, 'var  ')
  .replace(/\blet\b/g, 'var');

const interpreter = new Interpreter(es5Code, (interpreter, globalObject) => {
  const consoleObj = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, 'console', consoleObj);
  const logFunc = interpreter.createNativeFunction(() => {});
  interpreter.setProperty(consoleObj, 'log', logFunc);
});

let steps = 0;
while (interpreter.step() && steps++ < 1000) {
}
console.log("Ran successfully, steps:", steps);
