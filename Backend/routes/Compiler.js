const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const authMiddleware = require('../middleware/authMiddleware');

// Language configurations
const LANGUAGE_CONFIGS = {
  python: {
    image: 'python:3.9-alpine',
    extension: '.py',
    command: ['python', '/app/code.py'],
    timeout: 10000
  },
  javascript: {
    image: 'node:16-alpine',
    extension: '.js',
    command: ['node', '/app/code.js'],
    timeout: 10000
  },
  java: {
    image: 'openjdk:11-alpine',
    extension: '.java',
    command: ['sh', '-c', 'cd /app && javac Main.java && java Main'],
    timeout: 15000
  },
  cpp: {
    image: 'gcc:9-alpine',
    extension: '.cpp',
    command: ['sh', '-c', 'cd /app && g++ -o main code.cpp && ./main'],
    timeout: 15000
  }
};

// Create temporary directory for code execution
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
const ensureTempDir = async () => {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
};

// Check if Docker is running
const checkDockerStatus = () => {
  return new Promise((resolve) => {
    const docker = spawn('docker', ['version'], { stdio: 'pipe' });
    
    docker.on('close', (code) => {
      resolve(code === 0);
    });

    docker.on('error', () => {
      resolve(false);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      docker.kill();
      resolve(false);
    }, 5000);
  });
};

// Security: Validate and sanitize code
const validateCode = (code, language) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid code provided');
  }

  if (code.length > 10000) {
    throw new Error('Code too long (max 10000 characters)');
  }

  // Basic security checks
  const dangerousPatterns = [
    /import\s+os/i,
    /import\s+subprocess/i,
    /import\s+sys/i,
    /exec\s*\(/i,
    /eval\s*\(/i,
    /system\s*\(/i,
    /Runtime\.getRuntime/i,
    /ProcessBuilder/i,
    /#include\s*<cstdlib>/i,
    /system\s*\(/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error('Code contains potentially dangerous operations');
    }
  }

  return true;
};

// Fallback execution without Docker (for development/testing)
const executeWithoutDocker = async (code, language, input = '') => {
  const config = LANGUAGE_CONFIGS[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const executionId = uuidv4();
  const tempPath = path.join(TEMP_DIR, executionId);
  
  try {
    // Create temporary directory for this execution
    await fs.mkdir(tempPath, { recursive: true });

    // Write code to file
    let filename = `code${config.extension}`;
    if (language === 'java') {
      filename = 'Main.java';
    }
    
    const codePath = path.join(tempPath, filename);
    await fs.writeFile(codePath, code);

    // Prepare execution command based on language
    let execCommand, execArgs;
    
    switch (language) {
      case 'python':
        execCommand = 'python';
        execArgs = [codePath];
        break;
      case 'javascript':
        execCommand = 'node';
        execArgs = [codePath];
        break;
      case 'java':
        // First compile, then run
        const compileProcess = spawn('javac', [codePath], { cwd: tempPath });
        await new Promise((resolve, reject) => {
          compileProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error('Compilation failed'));
          });
        });
        execCommand = 'java';
        execArgs = ['-cp', tempPath, 'Main'];
        break;
      case 'cpp':
        // First compile, then run
        const outputPath = path.join(tempPath, 'main');
        const cppCompileProcess = spawn('g++', [codePath, '-o', outputPath]);
        await new Promise((resolve, reject) => {
          cppCompileProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error('Compilation failed'));
          });
        });
        execCommand = outputPath;
        execArgs = [];
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const process = spawn(execCommand, execArgs, { cwd: tempPath });

      let stdout = '';
      let stderr = '';

      // Send input to the process
      if (input) {
        process.stdin.write(input);
      }
      process.stdin.end();

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Set timeout
      const timeout = setTimeout(() => {
        process.kill('SIGKILL');
        reject(new Error('Execution timeout'));
      }, config.timeout);

      process.on('close', (code) => {
        clearTimeout(timeout);
        const executionTime = Date.now() - startTime;

        if (code === 0) {
          resolve({
            success: true,
            output: stdout.trim(),
            error: stderr.trim(),
            executionTime,
            memoryUsed: Math.floor(Math.random() * 50) + 10 // Simulated memory usage
          });
        } else {
          resolve({
            success: false,
            output: stdout.trim(),
            error: stderr.trim() || 'Runtime error',
            executionTime,
            memoryUsed: 0
          });
        }
      });

      process.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Execution failed: ${err.message}`));
      });
    });

  } finally {
    // Cleanup temporary files
    try {
      await fs.rm(tempPath, { recursive: true, force: true });
    } catch (err) {
      console.error('Failed to cleanup temp directory:', err);
    }
  }
};

// Execute code in Docker container
const executeInDocker = async (code, language, input = '') => {
  const config = LANGUAGE_CONFIGS[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const executionId = uuidv4();
  const tempPath = path.join(TEMP_DIR, executionId);
  
  try {
    // Create temporary directory for this execution
    await fs.mkdir(tempPath, { recursive: true });

    // Write code to file
    let filename = `code${config.extension}`;
    if (language === 'java') {
      filename = 'Main.java';
    }
    
    const codePath = path.join(tempPath, filename);
    await fs.writeFile(codePath, code);

    // Write input to file if provided
    const inputPath = path.join(tempPath, 'input.txt');
    await fs.writeFile(inputPath, input);

    // Prepare Docker command
    const dockerArgs = [
      'run',
      '--rm',
      '--network', 'none', // No network access
      '--memory', '128m', // Memory limit
      '--cpus', '0.5', // CPU limit
      '--user', 'nobody', // Run as non-root user
      '--read-only', // Read-only filesystem
      '--tmpfs', '/tmp:rw,noexec,nosuid,size=10m', // Temporary filesystem
      '-v', `${tempPath}:/app:ro`, // Mount code directory as read-only
      '-w', '/app',
      config.image,
      ...config.command
    ];

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const docker = spawn('docker', dockerArgs);

      let stdout = '';
      let stderr = '';

      // Send input to the process
      if (input) {
        docker.stdin.write(input);
      }
      docker.stdin.end();

      docker.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      docker.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Set timeout
      const timeout = setTimeout(() => {
        docker.kill('SIGKILL');
        reject(new Error('Execution timeout'));
      }, config.timeout);

      docker.on('close', (code) => {
        clearTimeout(timeout);
        const executionTime = Date.now() - startTime;

        if (code === 0) {
          resolve({
            success: true,
            output: stdout.trim(),
            error: stderr.trim(),
            executionTime,
            memoryUsed: Math.floor(Math.random() * 50) + 10 // Simulated memory usage
          });
        } else {
          resolve({
            success: false,
            output: stdout.trim(),
            error: stderr.trim() || 'Runtime error',
            executionTime,
            memoryUsed: 0
          });
        }
      });

      docker.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Docker execution failed: ${err.message}`));
      });
    });

  } finally {
    // Cleanup temporary files
    try {
      await fs.rm(tempPath, { recursive: true, force: true });
    } catch (err) {
      console.error('Failed to cleanup temp directory:', err);
    }
  }
};

// Compile and run code
router.post('/execute', authMiddleware, async (req, res) => {
  try {
    await ensureTempDir();

    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required'
      });
    }

    // Validate code
    validateCode(code, language);

    // Check if Docker is available
    const dockerAvailable = await checkDockerStatus();
    
    let result;
    if (dockerAvailable) {
      console.log('Using Docker for code execution');
      result = await executeInDocker(code, language, input);
    } else {
      console.log('Docker not available, using fallback execution');
      result = await executeWithoutDocker(code, language, input);
    }

    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      language,
      executionMethod: dockerAvailable ? 'docker' : 'native'
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      error: error.message || 'Code execution failed'
    });
  }
});

// Test endpoint to check if Docker is available
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const dockerAvailable = await checkDockerStatus();
    
    if (dockerAvailable) {
      res.json({ 
        status: 'healthy', 
        docker: 'available',
        message: 'Docker is running and ready for secure code execution'
      });
    } else {
      res.json({ 
        status: 'warning', 
        docker: 'unavailable',
        message: 'Docker is not available. Using fallback execution (less secure)',
        instructions: [
          '1. Make sure Docker Desktop is installed',
          '2. Start Docker Desktop application',
          '3. Wait for Docker engine to start',
          '4. Try again'
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      message: 'Unable to check Docker status'
    });
  }
});

module.exports = router;