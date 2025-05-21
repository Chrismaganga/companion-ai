"use client";

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
    onChange?: (value: string) => void;
    language?: string;
    code?: string;
    theme?: string;
    readOnly?: boolean;
}

export const CodeEditor = ({
    onChange,
    language = "javascript",
    code = "// Start coding here...",
    theme = "vs-dark",
    readOnly = false
}: CodeEditorProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (monacoEl.current) {
            // Initialize Monaco Editor
            const initMonaco = async () => {
                try {
                    editorRef.current = monaco.editor.create(monacoEl.current!, {
                        value: code,
                        language,
                        theme: resolvedTheme === "dark" ? "vs-dark" : "light",
                        automaticLayout: true,
                        minimap: {
                            enabled: false
                        },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        roundedSelection: false,
                        readOnly,
                        scrollbar: {
                            vertical: "visible",
                            horizontal: "visible",
                            useShadows: false,
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10
                        }
                    });

                    editorRef.current.onDidChangeModelContent(() => {
                        onChange?.(editorRef.current?.getValue() || "");
                    });

                    setIsLoading(false);
                } catch (error) {
                    console.error("Error initializing Monaco Editor:", error);
                    setIsLoading(false);
                }
            };

            initMonaco();
        }

        return () => {
            editorRef.current?.dispose();
        };
    }, [language, code, onChange, resolvedTheme, readOnly]);

    return (
        <div className="h-[500px] w-full border rounded-md overflow-hidden relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            <div ref={monacoEl} className="h-full" />
        </div>
    );
}; 