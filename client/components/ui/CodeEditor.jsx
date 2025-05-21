import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  value,
  language = "javascript",
  onChange,
  editorSettings = {
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'off',
    minimap: true,
    lineNumbers: true,
    autoIndent: true
  },
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Apply any additional editor configurations here
    editor.focus();
  };

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: editorSettings.fontSize,
        tabSize: editorSettings.tabSize,
        wordWrap: editorSettings.wordWrap,
        minimap: { enabled: editorSettings.minimap },
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        autoIndent: editorSettings.autoIndent ? 'advanced' : 'none',
      });
    }
  }, [editorSettings]);

  return (
    <Editor
      language={language == "nodejs" ? "javascript" : language}
      theme={editorSettings.theme}
      value={value || ""}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        automaticLayout: true,
        fontSize: editorSettings.fontSize,
        tabSize: editorSettings.tabSize,
        wordWrap: editorSettings.wordWrap,
        minimap: { enabled: editorSettings.minimap },
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        autoIndent: editorSettings.autoIndent ? 'advanced' : 'none',
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default CodeEditor;
