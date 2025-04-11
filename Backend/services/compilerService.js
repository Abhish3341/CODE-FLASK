const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const docker = new Docker();

const CONTAINER_TIMEOUT = 5000; // 5 seconds
const MEMORY_LIMIT = '512m';

const languageConfigs = {
  java: {
    image: 'openjdk:11-jdk-slim',
    extension: '.java',
    compileCmd: (filename) => `javac ${filename}`,
    runCmd: (filename) => `java ${filename.replace('.java', '')}`,
    className: 'Solution'
  },
  c: {
    image: 'gcc:latest',
    extension: '.c',
    compileCmd: (filename) => `gcc ${filename} -o program`,
    runCmd: () => './program'
  },
  cpp: {
    image: 'gcc:latest',
    extension: '.cpp',
    compileCmd: (filename) => `g++ ${filename} -o program`,
    runCmd: () => './program'
  },
  python: {
    image: 'python:3.9-slim',
    extension: '.py',
    runCmd: (filename) => `python ${filename}`
  }
};

class CompilerService {
  async createContainer(language, memory = MEMORY_LIMIT) {
    const config = languageConfigs[language];
    if (!config) throw new Error('Unsupported language');

    return await docker.createContainer({
      Image: config.image,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: true,
      StdinOnce: false,
      Tty: true,
      HostConfig: {
        Memory: parseInt(memory),
        MemorySwap: parseInt(memory),
        CpuPeriod: 100000,
        CpuQuota: 90000,
        NetworkMode: 'none'
      }
    });
  }

  async compileAndRun(code, language, input) {
    const config = languageConfigs[language];
    if (!config) throw new Error('Unsupported language');

    const workDir = path.join('/tmp', uuidv4());
    await fs.mkdir(workDir);

    try {
      const filename = `Solution${config.extension}`;
      const filepath = path.join(workDir, filename);
      
      // Write code file
      await fs.writeFile(filepath, code);
      
      // Create container
      const container = await this.createContainer(language);
      await container.start();

      // Copy files to container
      await container.putArchive(workDir, { path: '/app' });

      // Compile if needed
      if (config.compileCmd) {
        const compileResult = await container.exec({
          Cmd: ['/bin/sh', '-c', config.compileCmd(filename)],
          WorkingDir: '/app'
        });
        
        if (compileResult.exitCode !== 0) {
          throw new Error('Compilation failed');
        }
      }

      // Run code
      const runCmd = config.runCmd(filename);
      const execResult = await container.exec({
        Cmd: ['/bin/sh', '-c', runCmd],
        WorkingDir: '/app'
      });

      // Write input to container
      if (input) {
        await container.exec({
          Cmd: ['echo', input],
          AttachStdin: true
        });
      }

      // Get output
      const output = await new Promise((resolve, reject) => {
        let result = '';
        execResult.output.on('data', (data) => {
          result += data.toString();
        });
        execResult.output.on('end', () => resolve(result));
        execResult.output.on('error', reject);
      });

      // Cleanup
      await container.stop();
      await container.remove();
      await fs.rmdir(workDir, { recursive: true });

      return {
        success: true,
        output: output.trim(),
        executionTime: Date.now() - container.startTime
      };
    } catch (error) {
      await fs.rmdir(workDir, { recursive: true });
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CompilerService();