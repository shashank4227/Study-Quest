import fetch from 'node-fetch'; // wait, node-fetch is not in package.json, we can use global fetch if node >= 18

async function run() {
  const code = `#include <stdio.h>

int main() {
    // Print sizes of char, int, float, double
    printf("char: %d\\n",sizeof(char));
    printf("int: %d\\n",sizeof(int));
    printf("float: %d\\n",sizeof(float));
    printf("double: %d",sizeof(double));
    return 0;
}`;

  try {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-13.2.0-c',
        code: code,
        save: false
      })
    });
    const data = await res.json();
    console.log('STATUS:', data.status);
    console.log('OUTPUT:', JSON.stringify(data.program_output));
    console.log('ERROR:', data.compiler_error || data.program_error);
  } catch (err) {
    console.error(err);
  }
}

run();
