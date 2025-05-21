"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Plug, Github, TerminalSquare, Zap, Code2, FileCode2 } from "lucide-react";
import Editor from "@monaco-editor/react";

const PLUGINS = [
    { name: "AI Assistant", icon: <Zap className="w-4 h-4 mr-1" /> },
    { name: "GitHub Copilot", icon: <Github className="w-4 h-4 mr-1" /> },
    { name: "Linter", icon: <Plug className="w-4 h-4 mr-1" /> },
    { name: "Formatter", icon: <Plug className="w-4 h-4 mr-1" /> },
];

const LANGUAGES = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "css", label: "CSS" },
    { value: "tailwindcss", label: "Tailwind CSS" },
    { value: "html", label: "HTML" },
    { value: "jsx", label: "JSX" },
];

const SNIPPETS: Record<string, { label: string; code: string }[]> = {
    javascript: [
        { label: "Console Log", code: "console.log('Hello, world!');" },
        { label: "Fetch Example", code: "fetch('https://api.example.com').then(res => res.json()).then(data => console.log(data));" },
    ],
    typescript: [
        { label: "Type Alias", code: "type User = {\n  id: number;\n  name: string;\n};" },
        { label: "Interface", code: "interface Props {\n  title: string;\n  onClick: () => void;\n}" },
    ],
    css: [
        { label: "Flex Center", code: ".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}" },
        { label: "Button Style", code: ".btn {\n  background: #333;\n  color: #fff;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n}" },
    ],
    tailwindcss: [
        { label: "Button", code: "<button className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">Button</button>" },
        { label: "Card", code: "<div className=\"bg-white shadow rounded p-4\">Tailwind Card</div>" },
    ],
    html: [
        { label: "HTML Boilerplate", code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>" },
        { label: "Image Tag", code: "<img src=\"/path/to/image.jpg\" alt=\"Description\" />" },
    ],
    jsx: [
        { label: "React Functional Component", code: "function MyComponent() {\n  return <div>Hello, React!</div>;\n}" },
        { label: "Redux Slice", code: "import { createSlice } from '@reduxjs/toolkit';\n\nconst initialState = { value: 0 };\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState,\n  reducers: {\n    increment: state => { state.value += 1; },\n    decrement: state => { state.value -= 1; },\n  },\n});\n\nexport const { increment, decrement } = counterSlice.actions;\nexport default counterSlice.reducer;" },
    ],
};

interface CodeEditorProps {
    onChange?: (value: string | undefined) => void;
    language?: string;
    code?: string;
    theme?: string;
    readOnly?: boolean;
}

export const CodeEditor = ({
    onChange,
    language = "javascript",
    code = "// Start coding here...",
    readOnly = false
}: CodeEditorProps) => {
    const { resolvedTheme } = useTheme();
    const [selectedPlugin, setSelectedPlugin] = useState(PLUGINS[0].name);
    const [isAIConnected, setIsAIConnected] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState<string[]>(["Welcome to the VSCode-like terminal!"]);
    const [terminalInput, setTerminalInput] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState(language);
    const [editorValue, setEditorValue] = useState(code);

    const handlePluginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlugin(e.target.value);
    };

    const handleAIConnect = () => {
        setIsAIConnected((prev) => !prev);
    };

    const handleTerminalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerminalInput(e.target.value);
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (terminalInput.trim()) {
            setTerminalOutput((prev) => [...prev, "> " + terminalInput]);
            setTerminalInput("");
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLanguage(e.target.value);
        setEditorValue("");
    };

    const handleSnippetInsert = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const snippet = SNIPPETS[currentLanguage]?.find(s => s.label === e.target.value);
        if (snippet) {
            setEditorValue(snippet.code);
            onChange?.(snippet.code);
        }
    };

    return (
        <div className="w-full border rounded-md overflow-hidden bg-[#1e1e1e] text-white shadow-lg">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#23272e] border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-zinc-300">code-editor.tsx</span>
                    <span className="ml-4 text-xs text-zinc-400">Plugin:</span>
                    <select
                        className="bg-[#23272e] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                        value={selectedPlugin}
                        onChange={handlePluginChange}
                    >
                        {PLUGINS.map((plugin) => (
                            <option key={plugin.name} value={plugin.name}>
                                {plugin.name}
                            </option>
                        ))}
                    </select>
                    <span className="ml-4 text-xs text-zinc-400">Language:</span>
                    <select
                        className="bg-[#23272e] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                        value={currentLanguage}
                        onChange={handleLanguageChange}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                    <span className="ml-4 text-xs text-zinc-400">Snippet:</span>
                    <select
                        className="bg-[#23272e] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                        onChange={handleSnippetInsert}
                        defaultValue=""
                    >
                        <option value="" disabled>Select snippet</option>
                        {(SNIPPETS[currentLanguage] || []).map(snippet => (
                            <option key={snippet.label} value={snippet.label}>{snippet.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition ${isAIConnected ? "bg-green-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
                    onClick={handleAIConnect}
                >
                    <Zap className="w-4 h-4" />
                    {isAIConnected ? "AI Connected" : "Connect to AI"}
                </button>
            </div>
            {/* Main Area */}
            <div className="flex h-[500px]">
                {/* Sidebar */}
                <div className="w-12 bg-[#23272e] border-r border-zinc-800 flex flex-col items-center py-2 gap-2">
                    {PLUGINS.map((plugin) => (
                        <button
                            key={plugin.name}
                            className={`p-2 rounded ${selectedPlugin === plugin.name ? "bg-zinc-700" : "hover:bg-zinc-800"}`}
                            title={plugin.name}
                            onClick={() => setSelectedPlugin(plugin.name)}
                        >
                            {plugin.icon}
                        </button>
                    ))}
                    <button className="p-2 rounded hover:bg-zinc-800 mt-auto" title="Terminal">
                        <TerminalSquare className="w-4 h-4" />
                    </button>
                </div>
                {/* Editor */}
                <div className="flex-1">
                    <Editor
                        height="100%"
                        language={currentLanguage}
                        value={editorValue}
                        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                        loading={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            readOnly,
                            scrollBeyondLastLine: false,
                            automaticLayout: true
                        }}
                        onChange={(val) => {
                            setEditorValue(val || "");
                            onChange?.(val);
                        }}
                    />
                </div>
            </div>
            {/* Terminal */}
            <div className="bg-black border-t border-zinc-800 px-4 py-2 text-xs font-mono">
                <div className="h-24 overflow-y-auto mb-1">
                    {terminalOutput.map((line, idx) => (
                        <div key={idx} className="whitespace-pre text-zinc-200">{line}</div>
                    ))}
                </div>
                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                    <span className="text-green-500">$</span>
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-zinc-100"
                        value={terminalInput}
                        onChange={handleTerminalInput}
                        placeholder="Type a command..."
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
}; 