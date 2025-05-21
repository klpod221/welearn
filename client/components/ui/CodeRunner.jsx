"use client";

import { useState, useEffect, useRef } from "react";

import { getLanguages, runCode, runTests } from "@/services/codeService";

import useNotify from "@/hooks/useNotify";
import { getItem, setItem, removeItem } from "@/utils/localStorageUtils";

import CodeEditor from "@/components/ui/CodeEditor";
import InputOutputPanel from "@/components/ui/InputOutputPanel";
import TestCasesPanel from "@/components/ui/TestCasesPanel";

import {
  Select,
  Button,
  Input,
  Dropdown,
  Drawer,
  Switch,
  Slider,
  Space,
  Form,
  Radio,
  Modal,
} from "antd";
import {
  PlayCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  PlusOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  CopyOutlined,
  ExportOutlined,
  FileAddOutlined,
  StarOutlined,
} from "@ant-design/icons";

export default function IDEPage({ enableSave = true }) {
  const notify = useNotify();

  const [loading, setLoading] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState();

  const [activeTab, setActiveTab] = useState("io"); // "io" or "testcases"
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "main.js",
      content: "",
      language: "javascript",
      isMain: true,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState("1");
  const [renamingId, setRenamingId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [dirtyFiles, setDirtyFiles] = useState({}); // Track unsaved files

  // Input and Output state
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({});

  // Test cases state
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    theme: "vs-dark",
    fontSize: 14,
    tabSize: 2,
    wordWrap: "off",
    minimap: true,
    lineNumbers: true,
    autoIndent: true,
  });

  // Saving settings
  const [saveSettings, setSaveSettings] = useState({
    autoSave: true,
    autoSaveInterval: 0.5, // seconds
  });

  // Track saving state
  const [isSaving, setIsSaving] = useState(false);

  // New project dialog state
  const [newProjectModalVisible, setNewProjectModalVisible] = useState(false);

  // State for resizable panels
  const [leftPanelWidth, setLeftPanelWidth] = useState(66); // percent
  const [isDragging, setIsDragging] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  // Handle drag events for resizing
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      let percent = (x / containerRect.width) * 100;
      percent = Math.max(20, Math.min(80, percent)); // Clamp between 20% and 80%
      setLeftPanelWidth(percent);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  const handleRunCode = async () => {
    try {
      setLoading(true);
      if (activeTab === "io") {
        const { data } = await runCode(language, files, input);

        if (data.success) {
          setOutput({
            status: true,
            message: data.output,
          });
        } else {
          setOutput({
            status: false,
            message: data.error,
          });
        }

        notify.success("Code executed successfully");
      } else {
        const { data } = await runTests(language, files, testCases);
        setTestResults(data);
      }
    } catch (error) {
      console.error("Error running code:", error);
      notify.error("Failed to run code");
    } finally {
      setLoading(false);
    }
  };

  // Handle run test case
  const handleRunTestCase = async (testId) => {
    try {
      setLoading(true);
      const testCase = testCases.find((test) => test.id === testId);
      const testCaseIndex = testCases.findIndex((test) => test.id === testId);
      if (!testCase) return;

      const testCasesToRun = [
        {
          ...testCase,
          order: testCaseIndex,
        },
      ];

      const { data } = await runTests(language, files, testCasesToRun);

      console.log("Test case result:", data);

      // Update test results at the specific index
      const updatedResults = [...testResults];
      updatedResults[testCaseIndex] = data[0];
      setTestResults(updatedResults);

      notify.success("Test case executed successfully");
    } catch (error) {
      console.error("Error running test case:", error);
      notify.error("Failed to run test case");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get extension for a language
  const getExtensionForLanguage = (lang) => {
    const option = languages.find((opt) => opt.value === lang);
    return option ? option.extension : "";
  };

  // Helper function to remove extension from filename
  const removeExtension = (filename) => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) return filename;
    return filename.substring(0, lastDotIndex);
  };

  // Helper function to ensure filename has correct extension
  const ensureCorrectExtension = (filename, language) => {
    const baseFilename = removeExtension(filename);
    return baseFilename + getExtensionForLanguage(language);
  };

  const handleLanguageChange = (value) => {
    // Save current files before changing language
    if (enableSave) {
      setItem(`codeRunnerFiles_${language}`, files, (error) => {
        console.error("Error saving files before language change:", error);
      });

      // Save test cases as well
      setItem(`codeRunnerTests_${language}`, testCases, (error) => {
        console.error("Error saving test cases before language change:", error);
      });
    }

    // Set the new language - the useEffect will handle loading files for this language
    setLanguage(value);
  };

  // Add a new test case
  const handleAddTestCase = (newTestCase) => {
    // Validate that test case has required fields
    if (!newTestCase.name.trim()) {
      notify.error("Test case name is required.");
      return;
    }

    const testId = Date.now().toString();
    const test = {
      ...newTestCase,
      id: testId,
      language,
    };

    const updatedTestCases = [...testCases, test];
    setTestCases(updatedTestCases);

    // Save test cases to localStorage
    if (enableSave) {
      setItem(`codeRunnerTests_${language}`, updatedTestCases, (error) => {
        console.error("Error saving test cases:", error);
      });
      console.log("Test cases saved after adding");
    }
  };

  // Update existing test case
  const handleUpdateTestCase = (updatedTestCase) => {
    if (!updatedTestCase) return;

    const updatedTestCases = testCases.map((test) =>
      test.id === updatedTestCase.id ? updatedTestCase : test
    );

    setTestCases(updatedTestCases);

    // Update testResults if the test case exists in results
    const testCaseIndex = testCases.findIndex((test) => test.id === updatedTestCase.id);
    console.log("Test case index:", testCaseIndex);
    if (testCaseIndex !== -1) {
      // remove the testResult from the testResults array
      const newResults = [...testResults];
      newResults.splice(testCaseIndex, 1);
      setTestResults(newResults);
    }

    // Save updated test cases to localStorage
    if (enableSave) {
      setItem(`codeRunnerTests_${language}`, updatedTestCases, (error) => {
        console.error("Error saving test cases:", error);
      });
      console.log("Test cases saved after update");
    }
  };

  // Delete a test case
  const handleDeleteTestCase = (id) => {
    const updatedTestCases = testCases.filter((test) => test.id !== id);
    setTestCases(updatedTestCases);

    // Remove from test results as well
    const newResults = { ...testResults };
    delete newResults[id];
    setTestResults(newResults);

    // Save updated test cases to localStorage after deletion
    if (enableSave) {
      setItem(`codeRunnerTests_${language}`, updatedTestCases, (error) => {
        console.error("Error saving test cases:", error);
      });
      console.log("Test cases saved after deletion");
    }
  };

  // Get current active file
  const getCurrentFile = () => files.find((file) => file.id === activeFileId);

  // Create a reference for the debounced function
  const saveTimerRef = useRef(null);

  // Update code for current file
  const handleCodeChange = (newCode) => {
    setFiles(
      files.map((file) =>
        file.id === activeFileId ? { ...file, content: newCode } : file
      )
    );
    setDirtyFiles((prev) => ({ ...prev, [activeFileId]: true })); // Mark as dirty
    // Trigger auto-save if enabled
    if (enableSave && saveSettings.autoSave) {
      // Clear any existing timeout
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Create a new timeout
      saveTimerRef.current = setTimeout(() => {
        const updatedFiles = files.map((file) =>
          file.id === activeFileId ? { ...file, content: newCode } : file
        );
        setItem(`codeRunnerFiles_${language}`, updatedFiles, (error) => {
          if (!error) {
            setDirtyFiles((prev) => {
              const newDirty = { ...prev };
              delete newDirty[activeFileId];
              return newDirty;
            });
          }
          if (error) {
            console.error("Error auto-saving files:", error);
          }
        });

        setDirtyFiles((prev) => ({ ...prev, [activeFileId]: false }));
        console.log("Auto-saved files");
      }, saveSettings.autoSaveInterval * 1000);
    }
  };

  // Update saving settings
  const updateSaveSettings = (newSettings) => {
    setSaveSettings({ ...saveSettings, ...newSettings });

    // Save to localStorage
    setItem(
      "codeRunnerSaveSettings",
      { ...saveSettings, ...newSettings },
      (error) => {
        console.error("Error saving settings:", error);
      }
    );
  };

  // Add new file
  const addNewFile = () => {
    const newId = Date.now().toString();
    let baseFileName = `file${files.length + 1}`;
    let counter = 1;

    // Make sure the new filename is unique
    while (isFileNameTaken(baseFileName, language)) {
      baseFileName = `file${files.length + 1}_${counter}`;
      counter++;
    }

    const newFile = {
      id: newId,
      name: ensureCorrectExtension(baseFileName, language),
      content: "",
      language,
      isMain: false,
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
  };

  // Remove file
  const removeFile = (id, e) => {
    e.stopPropagation();
    if (files.length === 1) return; // Don't remove the last file

    const newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);

    // If we're removing the active file, set another as active
    if (id === activeFileId) {
      setActiveFileId(newFiles[0].id);
    }
  };

  // Start renaming a file (now triggered on double click)
  const startRenaming = (id, e) => {
    e.stopPropagation();
    const file = files.find((f) => f.id === id);
    setRenamingId(id);
    // Remove the extension when starting the rename
    setNewFileName(removeExtension(file.name));
  };

  // Check if a filename already exists (excluding the current file)
  const isFileNameTaken = (name, language, currentId = null) => {
    const fullName = ensureCorrectExtension(name, language);
    return files.some(
      (file) =>
        file.id !== currentId &&
        file.name.toLowerCase() === fullName.toLowerCase()
    );
  };

  // Complete file rename
  const completeRename = (id, e) => {
    e.stopPropagation();

    // Validate name is not empty
    if (!newFileName.trim()) return;

    const file = files.find((f) => f.id === id);

    // Check for duplicate names
    if (isFileNameTaken(newFileName, file.language, id)) {
      notify.error("File name already exists. Please choose a different name.");
      return;
    }

    // Update file name
    setFiles(
      files.map((file) =>
        file.id === id
          ? {
              ...file,
              name: ensureCorrectExtension(newFileName.trim(), file.language),
            }
          : file
      )
    );

    // Exit rename mode
    setRenamingId(null);
    setNewFileName("");
  };

  // Handle rename input change
  const handleRenameChange = (e) => {
    setNewFileName(e.target.value);
  };

  // Handle key press during rename
  const handleRenameKeyPress = (id, e) => {
    if (e.key === "Enter") {
      completeRename(id, e);
    } else if (e.key === "Escape") {
      setRenamingId(null);
      setNewFileName("");
    }
  };

  // Duplicate a file
  const duplicateFile = (id) => {
    const fileToClone = files.find((file) => file.id === id);
    if (!fileToClone) return;

    // Create base name for the duplicate
    let baseName = removeExtension(fileToClone.name);
    let newBaseName = `${baseName}_copy`;
    let counter = 1;

    // Make sure the new filename is unique
    while (isFileNameTaken(newBaseName, fileToClone.language)) {
      newBaseName = `${baseName}_copy${counter}`;
      counter++;
    }

    const newId = Date.now().toString();
    const newFile = {
      id: newId,
      name: ensureCorrectExtension(newBaseName, fileToClone.language),
      content: fileToClone.content,
      language: fileToClone.language,
      isMain: false,
    };

    setFiles([...files, newFile]);
    setActiveFileId(newId);
  };

  // Set a file as main
  const handleSetAsMain = (id) => {
    setFiles(files.map((file) => ({ ...file, isMain: file.id === id })));
    if (enableSave) {
      setItem(`codeRunnerFiles_${language}`, files, (error) => {
        console.error("Error saving files after setting main:", error);
      });
    }
  };

  // Save all code files and test cases to localStorage with language key
  const saveFiles = () => {
    setIsSaving(true);

    // Use Promise.all to track both save operations
    Promise.all([
      new Promise((resolve, reject) => {
        const success = setItem(
          `codeRunnerFiles_${language}`,
          files,
          (error) => {
            reject(error);
          }
        );
        if (success) resolve();
      }),
      new Promise((resolve, reject) => {
        const success = setItem(
          `codeRunnerTests_${language}`,
          testCases,
          (error) => {
            reject(error);
          }
        );
        if (success) resolve();
      }),
    ])
      .then(() => {
        notify.success("Saved successfully");
        // Mark all files as clean
        setDirtyFiles({});
      })
      .catch((error) => {
        notify.error("Failed to save data");
        console.error("Error saving data:", error);
      })
      .finally(() => {
        // Add a small delay to make the loading state visible
        setTimeout(() => {
          setIsSaving(false);
        }, 500);
      });
  };

  // Create new project (reset all data)
  const createNewProject = () => {
    // Check if there's saved data for current language
    const hasSavedFiles =
      getItem(`codeRunnerFiles_${language}`) !== null ||
      getItem(`codeRunnerTests_${language}`) !== null;

    if (hasSavedFiles) {
      // Show confirmation dialog
      setNewProjectModalVisible(true);
    } else {
      // Just create a new project if no data to lose
      resetProject();
    }
  };

  // Reset project to initial state
  const resetProject = () => {
    const initialFile = {
      id: "1",
      name: "main.js",
      content: "",
      language: "javascript",
      isMain: true,
    };
    setFiles([initialFile]);
    setActiveFileId("1");
    setLanguage("javascript");
    setTestCases([]);
    setTestResults([]);

    // Clear localStorage
    removeItem(`codeRunnerFiles_${language}`);
    removeItem(`codeRunnerTests_${language}`);

    setNewProjectModalVisible(false);
  };

  // Export current file as a downloadable file
  const exportFile = (id) => {
    const file = files.find((f) => f.id === id) || getCurrentFile();
    if (!file) return;

    // Create blob with file content
    const blob = new Blob([file.content], { type: "text/plain" });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    notify.success(`File "${file.name}" exported successfully`);
  };

  // Update editor settings
  const updateEditorSettings = (newSettings) => {
    setEditorSettings({ ...editorSettings, ...newSettings });

    // Save to localStorage
    setItem(
      "codeRunnerSettings",
      { ...editorSettings, ...newSettings },
      (error) => {
        console.error("Error saving settings:", error);
      }
    );
  };

  // Load settings from localStorage
  useEffect(() => {
    try {
      // Load editor settings
      const savedSettings = getItem("codeRunnerSettings");
      if (savedSettings) {
        setEditorSettings(savedSettings);
      } else {
        // Save default settings if none exist
        setItem("codeRunnerSettings", editorSettings);
      }

      // Load save settings
      if (enableSave) {
        const savedSaveSettings = getItem("codeRunnerSaveSettings");
        if (savedSaveSettings) {
          setSaveSettings(savedSaveSettings);
        } else {
          // Save default save settings if none exist
          setItem("codeRunnerSaveSettings", saveSettings);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      notify.error("Failed to load editor settings");
    }
  }, [enableSave]);

  // Realtime sync between tabs using localStorage events
  useEffect(() => {
    function handleStorageEvent(e) {
      if (!enableSave) return;
      // Sync files
      if (e.key === `codeRunnerFiles_${language}`) {
        const newFiles = getItem(`codeRunnerFiles_${language}`);
        if (newFiles) {
          setFiles(newFiles);
          setActiveFileId(newFiles[0]?.id || "1");
        }
      }
      // Sync test cases
      if (e.key === `codeRunnerTests_${language}`) {
        const newTests = getItem(`codeRunnerTests_${language}`);
        if (newTests) {
          setTestCases(newTests);
          setTestResults([]);
        }
      }
      // Sync editor settings
      if (e.key === "codeRunnerSettings") {
        const newSettings = getItem("codeRunnerSettings");
        if (newSettings) setEditorSettings(newSettings);
      }
      // Sync save settings
      if (e.key === "codeRunnerSaveSettings") {
        const newSaveSettings = getItem("codeRunnerSaveSettings");
        if (newSaveSettings) setSaveSettings(newSaveSettings);
      }
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [language, enableSave]);

  // Load files and test cases from localStorage on initial load or when language changes
  useEffect(() => {
    if (enableSave) {
      try {
        // Load files
        const savedFiles = getItem(`codeRunnerFiles_${language}`);
        if (savedFiles) {
          setFiles(savedFiles);
          setActiveFileId(savedFiles[0]?.id || "1");
        } else {
          // If no saved files for this language, create a new default file
          const defaultFile = {
            id: "1",
            name: `main${getExtensionForLanguage(language)}`,
            content: "",
            language,
            isMain: true,
          };
          setFiles([defaultFile]);
          setActiveFileId("1");
        }

        // Load test cases
        const savedTests = getItem(`codeRunnerTests_${language}`);
        if (savedTests) {
          setTestCases(savedTests);
          setTestResults([]); // Reset test results when language changes
        } else {
          setTestCases([]);
          setTestResults([]);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [enableSave, language]);

  // When files or language change, clear dirty state for new files
  useEffect(() => {
    setDirtyFiles({});
  }, [language]);

  // Get languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await getLanguages();
        const languageOptions = data.map((lang) => ({
          value: lang.code,
          label: lang.name,
          extension: lang.extension,
        }));
        setLanguages(languageOptions);
        setLanguage(languageOptions[0]?.value); // Set default language
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Code Editor</h2>
          <Select
            value={getCurrentFile()?.language || language}
            onChange={handleLanguageChange}
            options={languages}
            style={{ width: 120 }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRunCode}
            loading={loading}
          >
            Run
          </Button>
          {enableSave && (
            <>
              <Button icon={<FileAddOutlined />} onClick={createNewProject}>
                New
              </Button>
              <Button
                icon={<SaveOutlined />}
                loading={isSaving}
                onClick={saveFiles}
              >
                Save
              </Button>
            </>
          )}
          <Button
            icon={<SettingOutlined />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Settings Drawer */}
      <Drawer
        title="Editor Settings"
        placement="right"
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
        width={300}
      >
        <Form layout="vertical">
          <Form.Item label={<strong className="text-lg">Theme</strong>}>
            <Radio.Group
              value={editorSettings.theme}
              onChange={(e) => updateEditorSettings({ theme: e.target.value })}
            >
              <Space direction="vertical">
                <Radio value="vs">Light</Radio>
                <Radio value="vs-dark">Dark</Radio>
                <Radio value="hc-black">High Contrast</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Auto-save settings - only show if saving is enabled */}
          {enableSave && (
            <Form.Item label={<strong className="text-lg">Auto Save</strong>}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div className="flex justify-between items-center">
                  <span>Enable Auto Save</span>
                  <Switch
                    checked={saveSettings.autoSave}
                    onChange={(checked) =>
                      updateSaveSettings({ autoSave: checked })
                    }
                  />
                </div>
                {saveSettings.autoSave && (
                  <div className="mt-2">
                    <div className="mb-1 font-bold">Auto Save Interval</div>
                    <Slider
                      min={0.2}
                      max={5}
                      step={0.1}
                      value={saveSettings.autoSaveInterval}
                      onChange={(value) =>
                        updateSaveSettings({ autoSaveInterval: value })
                      }
                    />
                    <div className="text-right">
                      {saveSettings.autoSaveInterval}s
                    </div>
                  </div>
                )}
              </Space>
            </Form.Item>
          )}

          <Form.Item label={<strong className="text-lg">Font Size</strong>}>
            <Slider
              min={10}
              max={24}
              value={editorSettings.fontSize}
              onChange={(value) => updateEditorSettings({ fontSize: value })}
            />
            <div className="text-right">{editorSettings.fontSize}px</div>
          </Form.Item>

          <Form.Item label={<strong className="text-lg">Tab Size</strong>}>
            <Radio.Group
              value={editorSettings.tabSize}
              onChange={(e) =>
                updateEditorSettings({ tabSize: e.target.value })
              }
            >
              <Radio value={2}>2 spaces</Radio>
              <Radio value={4}>4 spaces</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={<strong className="text-lg">Word Wrap</strong>}>
            <Radio.Group
              value={editorSettings.wordWrap}
              onChange={(e) =>
                updateEditorSettings({ wordWrap: e.target.value })
              }
            >
              <Radio value="off">Off</Radio>
              <Radio value="on">On</Radio>
              <Radio value="wordWrapColumn">Column</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<strong className="text-lg">Other Settings</strong>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="flex justify-between items-center">
                <span>Show Minimap</span>
                <Switch
                  checked={editorSettings.minimap}
                  onChange={(checked) =>
                    updateEditorSettings({ minimap: checked })
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Show Line Numbers</span>
                <Switch
                  checked={editorSettings.lineNumbers}
                  onChange={(checked) =>
                    updateEditorSettings({ lineNumbers: checked })
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Auto Indent</span>
                <Switch
                  checked={editorSettings.autoIndent}
                  onChange={(checked) =>
                    updateEditorSettings({ autoIndent: checked })
                  }
                />
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-1 flex-1 h-full"
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        {/* Left panel - Code Editor with multiple files */}
        <div
          className="lg:col-span-2 h-full flex flex-col"
          style={{
            width: `${leftPanelWidth}%`,
            minWidth: 0,
            transition: isDragging ? "none" : "width 0.1s",
          }}
        >
          <div className="flex flex-wrap items-center bg-white rounded-t-lg p-1 overflow-x-auto">
            <div className="flex flex-1">
              {files.map((file) => (
                <Dropdown
                  key={file.id}
                  menu={{
                    items: [
                      {
                        key: "rename",
                        label: "Rename",
                        icon: <EditOutlined />,
                        onClick: () => {
                          // Create a synthetic event object
                          const syntheticEvent = { stopPropagation: () => {} };
                          startRenaming(file.id, syntheticEvent);
                        },
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        icon: <CloseOutlined />,
                        onClick: () => {
                          // Create a synthetic event object
                          const syntheticEvent = { stopPropagation: () => {} };
                          removeFile(file.id, syntheticEvent);
                        },
                        disabled: files.length <= 1,
                      },
                      {
                        key: "duplicate",
                        label: "Duplicate",
                        icon: <CopyOutlined />,
                        onClick: () => duplicateFile(file.id),
                      },
                      {
                        key: "export",
                        label: "Export",
                        icon: <ExportOutlined />,
                        onClick: () => exportFile(file.id),
                      },
                      {
                        key: "setmain",
                        label: file.isMain ? "Main File" : "Set as Main",
                        icon: file.isMain ? (
                          <CheckOutlined style={{ color: "#1677ff" }} />
                        ) : (
                          <StarOutlined />
                        ),
                        onClick: () => handleSetAsMain(file.id),
                        disabled: file.isMain,
                      },
                    ],
                  }}
                  trigger={["contextMenu"]}
                >
                  <div
                    onClick={() => setActiveFileId(file.id)}
                    onDoubleClick={(e) => startRenaming(file.id, e)}
                    className={`flex items-center px-3 py-1 mx-1 rounded-t cursor-pointer border-b-2 ${
                      file.id === activeFileId
                        ? "bg-gray-100 border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    {renamingId === file.id ? (
                      <div className="flex items-center">
                        <Input
                          size="small"
                          value={newFileName}
                          onChange={handleRenameChange}
                          onKeyDown={(e) => handleRenameKeyPress(file.id, e)}
                          onBlur={(e) => completeRename(file.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="!w-25"
                        />
                        <span className="text-gray-500 text-xs ml-0.5">
                          {getExtensionForLanguage(file.language)}
                        </span>
                      </div>
                    ) : (
                      <span className="truncate max-w-[100px] flex items-center">
                        {file.isMain && (
                          <StarOutlined className="!text-yellow-500 mr-1" />
                        )}
                        {file.name}
                        {dirtyFiles[file.id] && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </span>
                    )}
                    <div className="flex ml-2">
                      {renamingId === file.id && (
                        <CheckOutlined
                          className="mr-1 text-xs cursor-pointer hover:text-green-500"
                          onClick={(e) => completeRename(file.id, e)}
                        />
                      )}
                      {files.length > 1 && (
                        <CloseOutlined
                          className="text-xs cursor-pointer hover:text-red-500"
                          onClick={(e) => removeFile(file.id, e)}
                        />
                      )}
                    </div>
                  </div>
                </Dropdown>
              ))}
            </div>
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={addNewFile}
              size="small"
              className="ml-2"
            />
          </div>
          <div className="flex-1 min-h-[300px] h-full relative overflow-hidden bg-white rounded-b-lg border-t border-gray-200">
            <CodeEditor
              language={getCurrentFile()?.language || language}
              value={getCurrentFile()?.content || ""}
              onChange={handleCodeChange}
              editorSettings={editorSettings}
            />
          </div>
        </div>
        {/* Resizer */}
        <div
          ref={resizeRef}
          style={{
            width: 8,
            cursor: "col-resize",
            background: isDragging ? "#e0e7ef" : "transparent",
            zIndex: 10,
            userSelect: "none",
            position: "relative",
          }}
          onMouseDown={() => setIsDragging(true)}
          onDoubleClick={() => setLeftPanelWidth(66)}
        >
          <div
            style={{
              width: 2,
              height: "100%",
              margin: "0 auto",
              background: "#cbd5e1",
              borderRadius: 1,
            }}
          />
        </div>
        {/* Right panel - Input/Output or TestCases */}
        <div
          className="h-full flex flex-col bg-white rounded-lg px-4 pb-4"
          style={{ flex: 1, minWidth: 0 }}
        >
          {/* Custom Tailwind CSS tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("io")}
                className={`px-4 py-2 font-bold text-sm focus:outline-none ${
                  activeTab === "io"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Input/Output
              </button>
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-4 py-2 font-bold text-sm focus:outline-none ${
                  activeTab === "testcases"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Test Cases
              </button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "io" ? (
            <InputOutputPanel
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
            />
          ) : (
            <TestCasesPanel
              testCases={testCases}
              testResults={testResults}
              onAddTestCase={handleAddTestCase}
              onUpdateTestCase={handleUpdateTestCase}
              onDeleteTestCase={handleDeleteTestCase}
              onRunTestCase={handleRunTestCase}
            />
          )}
        </div>
      </div>

      {/* New Project Confirmation Modal */}
      <Modal
        title="Create New Project"
        open={newProjectModalVisible}
        onOk={resetProject}
        onCancel={() => setNewProjectModalVisible(false)}
        okText="Yes, create new"
        cancelText="Cancel"
      >
        <p>Creating a new project will clear all your current work.</p>
        <p>Are you sure you want to continue?</p>
      </Modal>
    </div>
  );
}
