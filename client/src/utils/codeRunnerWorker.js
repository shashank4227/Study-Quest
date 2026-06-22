// This script will be loaded as a Web Worker
self.onmessage = function (e) {
  const { code } = e.data;
  
  // Hijack console.log to capture output
  const logs = [];
  const originalLog = console.log;
  
  console.log = function (...args) {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  try {
    if (e.data.testCases && e.data.testCases.length > 0) {
      const testResults = [];
      let allPassed = true;
      for (let i = 0; i < e.data.testCases.length; i++) {
        const tc = e.data.testCases[i];
        let args = {};
        try {
          args = JSON.parse(tc.input);
        } catch(err) {}
        
        const argNames = Object.keys(args);
        const argValues = Object.values(args);
        
        const run = new Function(...argNames, code);
        const res = run(...argValues);
        const stringRes = res !== undefined ? String(res) : 'null';
        const expectedStr = String(tc.expectedOutput);
        
        // Handle possible quotes around strings in expectedOutput
        const normalizedExpected = expectedStr.replace(/^"|"$/g, '');
        const passed = stringRes === expectedStr || stringRes === normalizedExpected;
        
        if (!passed) allPassed = false;
        
        testResults.push({
          index: i + 1,
          input: tc.input,
          expected: normalizedExpected,
          actual: stringRes,
          passed
        });
      }
      
      self.postMessage({
        type: 'test_cases',
        logs,
        testResults,
        success: allPassed
      });
    } else {
      // Create a safe environment function
      // eslint-disable-next-line no-new-func
      const run = new Function(code);
      
      // Execute the code
      const result = run();
      
      self.postMessage({
        type: 'success',
        logs,
        result: result !== undefined ? String(result) : null,
      });
    }
  } catch (err) {
    self.postMessage({
      type: 'error',
      logs,
      error: err.toString(),
    });
  } finally {
    // Restore console.log just in case
    console.log = originalLog;
  }
};
