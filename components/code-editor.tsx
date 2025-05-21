"use client";

import { useState, useCallback, useMemo, useRef, useEffect, useLayoutEffect, useId, useTransition, useDeferredValue, useSyncExternalStore, createContext, useContext } from "react";
import { useTheme } from "next-themes";
import { Loader2, Plug, Github, TerminalSquare, Zap, Code2, FileCode2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import Editor from "@monaco-editor/react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage } from "zustand/middleware";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const PLUGINS = [
    { name: "AI Assistant", icon: <Zap className="w-4 h-4 mr-1" /> },
    { name: "GitHub Copilot", icon: <Github className="w-4 h-4 mr-1" /> },
    { name: "Linter", icon: <Plug className="w-4 h-4 mr-1" /> },
    { name: "Formatter", icon: <Plug className="w-4 h-4 mr-1" /> },
    { name: "Package Manager", icon: <Package className="w-4 h-4 mr-1" /> },
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
        { label: "React FC with Props", code: "import React from 'react';\n\ninterface Props {\n  title: string;\n  count?: number;\n}\n\nconst MyComponent: React.FC<Props> = ({ title, count = 0 }) => {\n  return (\n    <div>\n      <h1>{title}</h1>\n      <p>Count: {count}</p>\n    </div>\n  );\n};\n\nexport default MyComponent;" },
        { label: "useState Hook", code: "import { useState } from 'react';\n\nconst [count, setCount] = useState<number>(0);\n\nconst increment = () => setCount(prev => prev + 1);\nconst decrement = () => setCount(prev => prev - 1);" },
        { label: "useEffect Hook", code: "import { useEffect } from 'react';\n\nuseEffect(() => {\n  // Side effect code here\n  const subscription = someAPI.subscribe();\n  \n  // Cleanup function\n  return () => {\n    subscription.unsubscribe();\n  };\n}, [dependency]);" },
        { label: "useReducer Hook", code: "import { useReducer } from 'react';\n\ntype State = {\n  count: number;\n};\n\ntype Action = \n  | { type: 'INCREMENT' }\n  | { type: 'DECREMENT' }\n  | { type: 'RESET' };\n\nconst reducer = (state: State, action: Action): State => {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { count: state.count + 1 };\n    case 'DECREMENT':\n      return { count: state.count - 1 };\n    case 'RESET':\n      return { count: 0 };\n    default:\n      return state;\n  }\n};\n\nconst [state, dispatch] = useReducer(reducer, { count: 0 });" },
        { label: "Custom Hook", code: "import { useState } from 'react';\n\nconst useLocalStorage = <T>(key: string, initialValue: T) => {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.error(error);\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T | ((val: T) => T)) => {\n    try {\n      const valueToStore = value instanceof Function ? value(storedValue) : value;\n      setStoredValue(valueToStore);\n      window.localStorage.setItem(key, JSON.stringify(valueToStore));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n\n  return [storedValue, setValue] as const;\n};" },
        { label: "useCallback Hook", code: "import { useCallback } from 'react';\n\nconst memoizedCallback = useCallback(\n  () => {\n    doSomething(a, b);\n  },\n  [a, b],\n);" },
        { label: "useMemo Hook", code: "import { useMemo } from 'react';\n\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);" },
        { label: "useRef Hook", code: "import { useRef, useEffect } from 'react';\n\nconst inputRef = useRef<HTMLInputElement>(null);\n\nuseEffect(() => {\n  if (inputRef.current) {\n    inputRef.current.focus();\n  }\n}, []);" },
        { label: "useLayoutEffect Hook", code: "import { useLayoutEffect, useRef } from 'react';\n\nconst nodeRef = useRef<HTMLDivElement>(null);\n\nuseLayoutEffect(() => {\n  // Synchronously runs after DOM mutations\n  const { width } = measureDOMNode(nodeRef.current);\n  setWidth(width);\n}, [measurements]);" },
        { label: "useId Hook", code: "import { useId } from 'react';\n\nconst id = useId();\n\nreturn (\n  <div>\n    <label htmlFor={id}>Name:</label>\n    <input id={id} type=\"text\" />\n  </div>\n);" },
        { label: "useTransition Hook", code: "import { useTransition, useState } from 'react';\n\nconst [isPending, startTransition] = useTransition();\nconst [count, setCount] = useState(0);\n\nfunction handleClick() {\n  startTransition(() => {\n    // Update that causes a transition\n    setCount(c => c + 1);\n  });\n}" },
        { label: "useDeferredValue Hook", code: "import { useDeferredValue, useState } from 'react';\n\nconst [value, setValue] = useState('');\nconst deferredValue = useDeferredValue(value);\n\nreturn (\n  <div>\n    <p>Current value: {value}</p>\n    <p>Deferred value: {deferredValue}</p>\n  </div>\n);" },
        { label: "useSyncExternalStore Hook", code: "import { useSyncExternalStore } from 'react';\n\nconst subscribe = (callback: () => void) => {\n  window.addEventListener('resize', callback);\n  return () => window.removeEventListener('resize', callback);\n};\n\nconst getSnapshot = () => window.innerWidth;\n\nconst width = useSyncExternalStore(subscribe, getSnapshot);" },
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
        { label: "React Functional Component", code: "import React from 'react';\n\nfunction MyComponent() {\n  return <div>Hello, React!</div>;\n}" },
        { label: "Redux Slice", code: "import { createSlice } from '@reduxjs/toolkit';\n\nconst initialState = { value: 0 };\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState,\n  reducers: {\n    increment: state => { state.value += 1; },\n    decrement: state => { state.value -= 1; },\n  },\n});\n\nexport const { increment, decrement } = counterSlice.actions;\nexport default counterSlice.reducer;" },
        { label: "Redux Store Setup", code: "import { configureStore } from '@reduxjs/toolkit';\nimport counterReducer from './counterSlice';\n\nexport const store = configureStore({\n  reducer: {\n    counter: counterReducer,\n  },\n});\n\nexport type RootState = ReturnType<typeof store.getState>;\nexport type AppDispatch = typeof store.dispatch;" },
        { label: "Redux Hooks Setup", code: "import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';\nimport type { RootState, AppDispatch } from './store';\n\nexport const useAppDispatch = () => useDispatch<AppDispatch>();\nexport const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;" },
        { label: "Redux Thunk Action", code: "import { createAsyncThunk } from '@reduxjs/toolkit';\n\nexport const fetchUserData = createAsyncThunk(\n  'users/fetchUserData',\n  async (userId: string, { rejectWithValue }) => {\n    try {\n      const response = await fetch(`/api/users/${userId}`);\n      const data = await response.json();\n      return data;\n    } catch (error) {\n      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');\n    }\n  }\n);" },
        { label: "React Context Setup", code: "import { createContext, useContext, useState, ReactNode } from 'react';\n\ntype ThemeContextType = {\n  theme: string;\n  toggleTheme: () => void;\n};\n\nconst ThemeContext = createContext<ThemeContextType | undefined>(undefined);\n\nexport const ThemeProvider = ({ children }: { children: ReactNode }) => {\n  const [theme, setTheme] = useState('light');\n\n  const toggleTheme = () => {\n    setTheme(prev => prev === 'light' ? 'dark' : 'light');\n  };\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n};\n\nexport const useTheme = () => {\n  const context = useContext(ThemeContext);\n  if (context === undefined) {\n    throw new Error('useTheme must be used within a ThemeProvider');\n  }\n  return context;\n};" },
        { label: "React Query Setup", code: "import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';\nimport React from 'react';\n\nconst queryClient = new QueryClient();\n\nfunction App() {\n  return (\n    <QueryClientProvider client={queryClient}>\n      <YourComponent />\n    </QueryClientProvider>\n  );\n}\n\nfunction YourComponent() {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['todos'],\n    queryFn: () => fetch('/api/todos').then(res => res.json())\n  });\n\n  if (isLoading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;\n\n  return (\n    <div>\n      {data.map(todo => (\n        <div key={todo.id}>{todo.title}</div>\n      ))}\n    </div>\n  );\n}" },
        { label: "Zustand Store", code: "import { create } from 'zustand';\nimport { devtools, persist } from 'zustand/middleware';\n\ninterface BearState {\n  bears: number;\n  increase: () => void;\n  decrease: () => void;\n}\n\nexport const useBearStore = create<BearState>()(\n  devtools(\n    persist(\n      (set) => ({\n        bears: 0,\n        increase: () => set((state) => ({ bears: state.bears + 1 })),\n        decrease: () => set((state) => ({ bears: state.bears - 1 })),\n      }),\n      {\n        name: 'bear-storage',\n      }\n    )\n  )\n);" },
        { label: "Zustand with Async Actions", code: "import { create } from 'zustand';\n\ninterface User {\n  id: string;\n  name: string;\n}\n\ninterface UserState {\n  user: User | null;\n  isLoading: boolean;\n  error: string | null;\n  fetchUser: (id: string) => Promise<void>;\n}\n\nexport const useUserStore = create<UserState>((set) => ({\n  user: null,\n  isLoading: false,\n  error: null,\n  fetchUser: async (id: string) => {\n    set({ isLoading: true, error: null });\n    try {\n      const response = await fetch(`/api/users/${id}`);\n      const user = await response.json();\n      set({ user, isLoading: false });\n    } catch (error) {\n      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });\n    }\n  },\n}));" },
        { label: "Zustand with Slices", code: "import { create } from 'zustand';\nimport { createJSONStorage, persist } from 'zustand/middleware';\n\ninterface User {\n  id: string;\n  name: string;\n}\n\ninterface Item {\n  id: string;\n  name: string;\n}\n\ninterface AuthSlice {\n  user: User | null;\n  login: (user: User) => void;\n  logout: () => void;\n}\n\ninterface CartSlice {\n  items: Item[];\n  addItem: (item: Item) => void;\n  removeItem: (id: string) => void;\n}\n\nconst createAuthSlice = (set: any) => ({\n  user: null,\n  login: (user: User) => set({ user }),\n  logout: () => set({ user: null }),\n});\n\nconst createCartSlice = (set: any) => ({\n  items: [],\n  addItem: (item: Item) => set((state: any) => ({ items: [...state.items, item] })),\n  removeItem: (id: string) => set((state: any) => ({ items: state.items.filter((item: Item) => item.id !== id) })),\n});\n\nexport const useStore = create(\n  persist(\n    (...a) => ({\n      ...createAuthSlice(...a),\n      ...createCartSlice(...a),\n    }),\n    {\n      name: 'app-storage',\n      storage: createJSONStorage(() => localStorage),\n    }\n  )\n);" },
        { label: "Zustand with Immer", code: "import { create } from 'zustand';\nimport { immer } from 'zustand/middleware/immer';\n\ninterface Todo {\n  id: string;\n  text: string;\n  completed: boolean;\n}\n\ninterface TodoState {\n  todos: Todo[];\n  addTodo: (text: string) => void;\n  toggleTodo: (id: string) => void;\n}\n\nexport const useTodoStore = create<TodoState>()(\n  immer((set) => ({\n    todos: [],\n    addTodo: (text: string) =>\n      set((state) => {\n        state.todos.push({ id: Date.now().toString(), text, completed: false });\n      }),\n    toggleTodo: (id: string) =>\n      set((state) => {\n        const todo = state.todos.find((todo) => todo.id === id);\n        if (todo) todo.completed = !todo.completed;\n      }),\n  }))\n);" },
    ],
};

interface PackageManagerState {
    installedPackages: string[];
    isInstalling: boolean;
    installPackage: (packageName: string) => Promise<void>;
    removePackage: (packageName: string) => Promise<void>;
}

const usePackageManager = create<PackageManagerState>((set) => ({
    installedPackages: [],
    isInstalling: false,
    installPackage: async (packageName: string) => {
        set({ isInstalling: true });
        try {
            // Simulate package installation
            await new Promise(resolve => setTimeout(resolve, 1000));
            set(state => ({
                installedPackages: [...state.installedPackages, packageName],
                isInstalling: false
            }));
        } catch (error) {
            set({ isInstalling: false });
            throw error;
        }
    },
    removePackage: async (packageName: string) => {
        set({ isInstalling: true });
        try {
            // Simulate package removal
            await new Promise(resolve => setTimeout(resolve, 500));
            set(state => ({
                installedPackages: state.installedPackages.filter(pkg => pkg !== packageName),
                isInstalling: false
            }));
        } catch (error) {
            set({ isInstalling: false });
            throw error;
        }
    }
}));

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
    const [packageInput, setPackageInput] = useState("");
    const { installedPackages, isInstalling, installPackage, removePackage } = usePackageManager();
    const [sidebarOpen, setSidebarOpen] = useState(true);

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

    const handlePackageInstall = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!packageInput.trim()) return;

        try {
            await installPackage(packageInput.trim());
            setTerminalOutput(prev => [...prev, `> npm install ${packageInput.trim()}`]);
            setPackageInput("");
        } catch (error) {
            setTerminalOutput(prev => [...prev, `Error installing package: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        }
    };

    const handlePackageRemove = async (packageName: string) => {
        try {
            await removePackage(packageName);
            setTerminalOutput(prev => [...prev, `> npm uninstall ${packageName}`]);
        } catch (error) {
            setTerminalOutput(prev => [...prev, `Error removing package: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        }
    };

    return (
        <div className="w-full h-full border rounded-md overflow-hidden bg-[#1e1e1e] text-white shadow-lg flex flex-col">
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
            <div className="flex-1 flex h-[calc(100vh-48px)] relative">
                {/* Sidebar */}
                {sidebarOpen && (
                    <div className="w-12 bg-[#23272e] border-r border-zinc-800 flex flex-col items-center py-2 gap-2 h-full transition-all duration-200">
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
                        <button
                            className="p-2 rounded hover:bg-zinc-800 mt-auto"
                            title="Terminal"
                        >
                            <TerminalSquare className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {/* Sidebar Toggle Button */}
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#23272e] border border-zinc-800 rounded-r px-1 py-2 focus:outline-none"
                    style={{ left: sidebarOpen ? 48 : 0 }}
                    onClick={() => setSidebarOpen((open) => !open)}
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {/* Editor or Package Manager */}
                <div className={`flex-1 transition-all duration-200 ${sidebarOpen ? '' : 'ml-0'}`} style={{ width: sidebarOpen ? 'calc(100% - 48px)' : '100%' }}>
                    {selectedPlugin === "Package Manager" ? (
                        <div className="p-4 h-full overflow-y-auto">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Package Manager</h3>
                                <form onSubmit={handlePackageInstall} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={packageInput}
                                        onChange={(e) => setPackageInput(e.target.value)}
                                        placeholder="Enter package name..."
                                        className="flex-1 bg-[#2d2d2d] border border-zinc-700 rounded px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isInstalling}
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                                    >
                                        {isInstalling ? "Installing..." : "Install"}
                                    </button>
                                </form>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Installed Packages</h4>
                                <div className="space-y-2">
                                    {installedPackages.map((pkg) => (
                                        <div key={pkg} className="flex items-center justify-between bg-[#2d2d2d] p-2 rounded">
                                            <span className="text-sm">{pkg}</span>
                                            <button
                                                onClick={() => handlePackageRemove(pkg)}
                                                className="text-red-500 hover:text-red-400 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
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
                    )}
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