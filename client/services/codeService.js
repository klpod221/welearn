import api from "@/lib/api";
import { stringToBase64 } from "@/utils/helpers";

export const getLanguages = async () => {
  return await api.get("/languages");
};

export const getLanguage = async (id) => {
  return await api.get(`/languages/${id}`);
};

export const runCode = async (language, files, input = "") => {
  if (!language || !files) {
    throw new Error("Language and files are required");
  }

  if (files.length === 0) {
    throw new Error("At least one file is required");
  }

  const formData = {
    language,
    input: stringToBase64(input),
    files: files.map((file) => ({
      ...file,
      content: stringToBase64(file.content),
    })),
  };

  return await api.post("/run-code", formData);
};

export const runTests = async (language, files, testCases) => {
  if (!language || !files) {
    throw new Error("Language and files are required");
  }

  if (files.length === 0) {
    throw new Error("At least one file is required");
  }

  const formData = {
    language,
    testCases: testCases.map((testCase, index) => ({
      input: stringToBase64(testCase.input),
      expectedOutput: stringToBase64(testCase.expectedOutput),
      order: index,
    })),
    files: files.map((file) => ({
      ...file,
      content: stringToBase64(file.content),
    })),
  };

  return await api.post("/run-tests", formData);
};
