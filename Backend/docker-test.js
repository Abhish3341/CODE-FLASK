const { spawn } = require('child_process');

console.log('🔍 Testing Docker manually...');

// Test 1: Docker info
console.log('\\n1. Testing docker info...');
const dockerInfo = spawn('docker', ['info'], { stdio: 'pipe' });
let infoOutput = '';
let infoError = '';

dockerInfo.stdout.on('data', (data) => {
  infoOutput += data.toString();
});

dockerInfo.stderr.on('data', (data) => {
  infoError += data.toString();
});

dockerInfo.on('close', (code) => {
  console.log('Docker info exit code:', code);
  if (code === 0) {
    console.log('✅ Docker is running');
  } else {
    console.log('❌ Docker is not running');
    console.log('Error:', infoError);
  }
  
  // Test 2: Check Python image
  console.log('\\n2. Testing Python image...');
  const pythonTest = spawn('docker', ['image', 'inspect', 'python:3.9-alpine'], { stdio: 'pipe' });
  
  pythonTest.on('close', (code) => {
    console.log('Python image inspect exit code:', code);
    if (code === 0) {
      console.log('✅ Python image is available');
      
      // Test 3: Run simple Python code
      console.log('\\n3. Testing Python execution...');
      const pythonRun = spawn('docker', [
        'run', '--rm', 'python:3.9-alpine', 'python', '-c', 'print(\"Hello from Docker!\")'
      ], { stdio: 'pipe' });
      
      let runOutput = '';
      pythonRun.stdout.on('data', (data) => {
        runOutput += data.toString();
      });
      
      pythonRun.on('close', (code) => {
        console.log('Python execution exit code:', code);
        if (code === 0) {
          console.log('✅ Python execution successful');
          console.log('Output:', runOutput.trim());
        } else {
          console.log('❌ Python execution failed');
        }
      });
    } else {
      console.log('❌ Python image is not available');
    }
  });
});