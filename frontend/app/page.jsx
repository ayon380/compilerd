"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Moon, Sun, Play, Copy, Trash2 } from "lucide-react";

const languages = [
  { name: "C", value: "c" },
  { name: "C++", value: "cpp" },
  { name: "Python", value: "python" },
  { name: "Java", value: "java" },
  { name: "Node.js", value: "javascript" },
  { name: "Ruby", value: "ruby" },
];

const getDefaultCode = (language) => {
  const examples = {
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    python: 'print("Hello, World!")',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    javascript: 'console.log("Hello, World!");',
    ruby: 'puts "Hello, World!"',
  };
  return examples[language] || "// Start coding here";
};

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [stdin, setStdin] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${selectedLanguage.value}`);
    setCode(savedCode || getDefaultCode(selectedLanguage.value));
  }, [selectedLanguage]);

  const handleCodeChange = useCallback(
    (value) => {
      setCode(value);
      localStorage.setItem(`code_${selectedLanguage.value}`, value);
    },
    [selectedLanguage]
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClearCode = () => {
    const defaultCode = getDefaultCode(selectedLanguage.value);
    setCode(defaultCode);
    localStorage.setItem(`code_${selectedLanguage.value}`, defaultCode);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/execute/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage.value,
          script: code,
          stdin: stdin,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setOutput(data);
    } catch (e) {
      console.error("There was an error executing the code:", e);
      setError(
        e.message || "There was an error executing the code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleStdinChange = (e) => {
    setStdin(e.target.value);
  };

  return (
    <div
      className={`min-h-screen font-rethink transition-colors duration-300 ${
        isDarkMode
          ? "dark bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1
            className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              isDarkMode
                ? "from-blue-400 to-purple-400"
                : "from-blue-600 to-purple-600"
            }`}
          >
            Code<span className="font-extrabold">Runner</span>
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`p-3 rounded-full bg-white ${
              isDarkMode
                ? "dark:bg-gray-800 text-gray-200"
                : "text-gray-800 transition-colors duration-200 hover:bg-gray-100"
            } shadow-lg`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium mb-2">
            Select Language:
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg ${
                  selectedLanguage.value === lang.value
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Code:</label>
            <div className="space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                className={`p-2 rounded-full bg-white ${
                  isDarkMode
                    ? "dark:bg-gray-800 text-gray-200"
                    : "text-gray-800 transition-colors duration-200 hover:bg-gray-100"
                } shadow-lg`}
                aria-label="Copy code"
              >
                <Copy size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearCode}
                className={`p-2 rounded-full bg-white ${
                  isDarkMode
                    ? "dark:bg-gray-800 text-gray-200"
                    : "text-gray-800 transition-colors duration-200 hover:bg-gray-100"
                } shadow-lg`}
                aria-label="Clear code"
              >
                <Trash2 size={20} />
              </motion.button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Editor
              height="480px"
              language={selectedLanguage.value}
              value={code}
              onChange={handleCodeChange}
              theme={isDarkMode ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium mb-2">
            Standard Input (stdin):
          </label>
          <textarea
            className={`w-full h-24 p-3 rounded-xl shadow-inner ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={stdin}
            onChange={handleStdinChange}
            placeholder="Enter input for your code here..."
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-full font-medium text-lg shadow-xl flex items-center justify-center transition-all duration-200"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center space-x-2"
            >
              <Play size={24} />
              <span>Executing...</span>
            </motion.div>
          ) : (
            <span className="flex items-center space-x-2">
              <Play size={24} />
              <span>Run Code</span>
            </span>
          )}
        </motion.button>

        {output !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`mt-8 p-6 rounded-2xl shadow-lg ${
              isDarkMode ? "dark:bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">Output:</h2>
            <pre className="whitespace-pre-wrap break-words">
              {output.output}
            </pre>
            {output.errors && (
              <pre className="whitespace-pre-wrap break-words text-red-500 mt-4">
                {output.errors}
              </pre>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 p-6 rounded-2xl shadow-lg bg-red-100 text-red-900"
          >
            <h2 className="text-lg font-semibold mb-2">Error:</h2>
            <p>{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
