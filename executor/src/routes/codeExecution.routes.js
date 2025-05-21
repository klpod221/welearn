const express = require("express");
const router = express.Router();
const codeExecutorService = require("../services/codeExecutor.service");

/**
 * Execute code
 * @route POST /execute/code
 */
router.post("/code", async (req, res) => {
  try {
    const { language, files, input = "" } = req.body;

    if (!language) {
      return res.status(400).json({ error: "Language is required" });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "Files are required" });
    }

    const result = await codeExecutorService.executeCode({
      language,
      files,
      stdin: input,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(`Error executing code: ${error.message}`);

    res.status(error.status || 500).json({
      error: error.message || "Failed to execute code",
    });
  }
});

/**
 * Execute code with test cases
 * @route POST /execute/test
 */
router.post("/test", async (req, res) => {
  try {
    const { language, files, testCases } = req.body;

    if (!language) {
      return res.status(400).json({ error: "Language is required" });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "Files are required" });
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ error: "Test cases are required" });
    }

    const result = await codeExecutorService.executeCodeWithTestCases({
      language,
      files,
      testCases,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(`Error executing code with test cases: ${error.message}`);

    res.status(error.status || 500).json({
      error: error.message || "Failed to execute code with test cases",
    });
  }
});

/**
 * Get supported languages
 * @route GET /execute/languages
 */
router.get("/languages", (req, res) => {
  try {
    const languages = codeExecutorService.getSupportedLanguages();
    res.status(200).json({ languages });
  } catch (error) {
    res.status(500).json({ error: "Failed to get supported languages" });
  }
});

module.exports = router;
