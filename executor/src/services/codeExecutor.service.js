const path = require("path");
const fs = require("fs-extra");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const os = require("os");
const pidusage = require("pidusage");

const execPromise = util.promisify(exec);

// Get base directory for code execution temp files
const BASE_TEMP_DIR = path.join(os.tmpdir(), "code-execution");

// Configuration defaults
const config = {
  MAX_EXECUTION_TIME: parseInt(process.env.MAX_EXECUTION_TIME) || 10000,
  MAX_MEMORY: parseInt(process.env.MAX_MEMORY) || 512,
};

// Ensure base temp directory exists on startup
(async () => {
  try {
    await fs.ensureDir(BASE_TEMP_DIR, { mode: 0o755 });
    console.log(`Base temporary directory created: ${BASE_TEMP_DIR}`);
  } catch (err) {
    console.error(`Failed to create base temp directory: ${err.message}`);
    console.error(
      "This may cause code execution to fail. Check directory permissions."
    );
  }
})();

// Supported languages configuration
const languageConfigs = {
  nodejs: {
    extension: ".js",
    compile: null,
    run: "node",
    get timeout() {
      return config.MAX_EXECUTION_TIME;
    },
  },
  python: {
    extension: ".py",
    compile: null,
    run: "python3",
    get timeout() {
      return config.MAX_EXECUTION_TIME;
    },
  },
  java: {
    extension: ".java",
    compile: (file) => `javac ${file}`,
    run: (className) => `java ${className}`,
    get timeout() {
      return config.MAX_EXECUTION_TIME;
    },
  },
  cpp: {
    extension: ".cpp",
    compile: (file) => `g++ -o ${file.replace(".cpp", "")} ${file}`,
    run: (file) => `./${file.replace(".cpp", "")}`,
    get timeout() {
      return config.MAX_EXECUTION_TIME;
    },
  },
  c: {
    extension: ".c",
    compile: (file) => `gcc -o ${file.replace(".c", "")} ${file}`,
    run: (file) => `./${file.replace(".c", "")}`,
    get timeout() {
      return config.MAX_EXECUTION_TIME;
    },
  },
};

/**
 * Base64 decoder
 *
 * @param {string} str - Base64 encoded string
 * @returns {string} Decoded string
 * @throws {Error} If decoding fails
 * */
const base64Decoder = (str) => {
  try {
    return Buffer.from(str, "base64").toString("utf-8");
  } catch (err) {
    throw new Error("Failed to decode base64 string");
  }
};

/**
 * Execute code in the specified language
 *
 * @param {Object} options - Options for code execution
 * @param {string} options.language - Programming language name (nodejs, python, java, etc.)
 * @param {Array<Object>} options.files - Array of file objects { name, content, isMain }
 * @param {string} options.stdin - Standard input (optional)
 * @returns {Promise<Object>} Execution result
 */
async function executeCode({ language, files, stdin = "" }) {
  // Validate language support
  if (!languageConfigs[language]) {
    const error = new Error(`Unsupported language: ${language}`);
    error.status = 400;
    throw error;
  }

  // Create a unique execution ID and temp directory
  const executionId = uuidv4();
  const tempDir = path.join(BASE_TEMP_DIR, executionId);

  try {
    // Ensure base directory exists first with proper permissions
    await fs.ensureDir(BASE_TEMP_DIR, { mode: 0o755 });

    // Create temp directory with explicit permissions
    await fs.ensureDir(tempDir, { mode: 0o755 });

    // Verify directory was created successfully
    const dirExists = await fs.pathExists(tempDir);
    if (!dirExists) {
      throw new Error(`Failed to create temporary directory: ${tempDir}`);
    }

    // Find the main file or use the first file
    const mainFile = files.find((file) => file.isMain) || files[0];
    if (!mainFile) {
      throw new Error("No files provided");
    }

    // Write all files to the temp directory with proper error handling
    for (const file of files) {
      try {
        const filePath = path.join(tempDir, file.name);
        const fileContent = base64Decoder(file.content);
        await fs.writeFile(filePath, fileContent);

        // Make files executable for compiled languages
        if (languageConfigs[language].compile) {
          await fs.chmod(filePath, 0o755);
        }
      } catch (fileError) {
        throw new Error(
          `Failed to write file "${file.name}": ${fileError.message}`
        );
      }
    }

    // Write stdin to file if provided
    if (stdin) {
      try {
        await fs.writeFile(
          path.join(tempDir, "input.txt"),
          base64Decoder(stdin)
        );
      } catch (stdinError) {
        throw new Error(`Failed to write stdin file: ${stdinError.message}`);
      }
    }

    // Get language configuration
    const langConfig = languageConfigs[language];

    // Initialize result structure
    let result = {
      output: "",
      error: "",
      exitCode: 0,
      compilationOutput: "",
      executionTime: 0,
      memoryUsage: 0,
      success: false,
    };

    // Start time measurement
    const startTime = process.hrtime();

    // For compiled languages, compile the code first
    if (langConfig.compile) {
      try {
        const compileCmd = langConfig.compile(mainFile.name);
        console.log(`Compiling: ${compileCmd}`);

        const { stdout, stderr } = await execPromise(compileCmd, {
          cwd: tempDir,
          timeout: langConfig.timeout,
        });

        result.compilationOutput = stdout || "";

        // If stderr is not empty, there was a compilation error
        if (stderr) {
          result.error = stderr;
          result.exitCode = 1;
          result.success = false;
          return result;
        }
      } catch (error) {
        result.error = error.stderr || error.message;
        result.exitCode = error.code || 1;
        result.success = false;
        return result;
      }
    }

    // Execute the code
    try {
      let runCmd;

      if (language === "java") {
        // For Java, extract class name from file name
        const className = path.basename(mainFile.name, ".java");
        runCmd = langConfig.run(className);
      } else if (langConfig.compile) {
        // For other compiled languages
        runCmd = langConfig.run(mainFile.name);
      } else {
        // For interpreted languages
        runCmd = `${langConfig.run} ${mainFile.name}`;
      }

      // Add stdin redirection if provided
      if (stdin) {
        runCmd += ` < input.txt`;
      }

      console.log(`Executing: ${runCmd} with timeout: ${langConfig.timeout}ms`);

      const { stdout, stderr } = await execPromise(runCmd, {
        cwd: tempDir,
        timeout: langConfig.timeout,
      });

      // Calculate execution time
      const endTime = process.hrtime(startTime);
      const executionTimeMs = Math.round(
        endTime[0] * 1000 + endTime[1] / 1000000
      );

      // Calculate memory usage using pidusage
      try {
        const stats = await pidusage(process.pid);
        result.memoryUsage = Math.round(stats.memory / 1024); // Convert bytes to KB
      } catch (memoryError) {
        console.error(
          `Failed to calculate memory usage: ${memoryError.message}`
        );
        result.memoryUsage = 0; // Default to 0 if calculation fails
      }

      result.output = stdout || "";
      result.error = stderr || "";
      result.executionTime = executionTimeMs;
      result.exitCode = 0;
      result.success = true;
    } catch (error) {
      // Calculate execution time even if there was an error
      const endTime = process.hrtime(startTime);
      const executionTimeMs = Math.round(
        endTime[0] * 1000 + endTime[1] / 1000000
      );

      result.output = error.stdout || "";
      result.error = error.stderr || error.message;
      result.executionTime = executionTimeMs;
      result.exitCode = error.code || 1;
      result.success = false;

      if (error.signal === "SIGTERM" || error.killed) {
        result.error += "\nExecution timed out";
      }
    }

    return result;
  } catch (error) {
    console.error(`Error during code execution: ${error.message}`);
    throw error;
  } finally {
    // Clean up the temporary directory
    try {
      await fs.remove(tempDir);
      console.log(`Cleaned up temp directory: ${tempDir}`);
    } catch (error) {
      console.error(`Failed to clean up temp directory: ${error.message}`);
    }
  }
}

async function executeCodeWithTestCases({ language, files, testCases }) {
  const results = [];
  
  for (const testCase of testCases) {
    const { input, expectedOutput } = testCase;
    const result = await executeCode({ language, files, stdin: input });

    // Compare output with expected output
    const normalizedActualOutput = (result.output || "").trim();
    const normalizedExpectedOutput = (
      base64Decoder(expectedOutput) || ""
    ).trim();
    const passed = normalizedActualOutput === normalizedExpectedOutput;

    results.push({
      ...result,
      passed,
    });
  }

  return results;
}

/**
 * Get supported programming languages
 *
 * @returns {Array<string>} List of supported language names
 */
function getSupportedLanguages() {
  return Object.keys(languageConfigs);
}

module.exports = {
  executeCode,
  getSupportedLanguages,
  executeCodeWithTestCases,
};
