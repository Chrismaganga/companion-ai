"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Code,
    Image,
    FileText,
    Brain,
    Zap,
    Palette,
    BookOpen,
    Download,
    Copy,
    Loader2
} from "lucide-react";

interface SimpleAIInterfaceProps {
    toolType: string;
}

export function SimpleAIInterface({ toolType }: SimpleAIInterfaceProps) {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt");
            return;
        }

        setLoading(true);
        setResult("");

        try {
            // Simulate AI processing for now
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock results based on tool type
            let mockResult = "";
            switch (toolType) {
                case "code":
                    mockResult = `// Generated code for: ${prompt}\n\nfunction example() {\n  console.log("Hello World");\n  return "Success";\n}`;
                    break;
                case "image":
                    mockResult = "Image generation would create a visual based on your description. Add OpenAI API key for real image generation.";
                    break;
                case "resume":
                    mockResult = "Resume generation would create a professional resume based on your input. Add OpenAI API key for real resume generation.";
                    break;
                case "writing":
                    mockResult = "Writing assistance would enhance your text. Add OpenAI API key for real writing assistance.";
                    break;
                case "learning":
                    mockResult = "Study materials would be generated based on your content. Add OpenAI API key for real study material generation.";
                    break;
                default:
                    mockResult = "AI processing would occur here. Add OpenAI API key for real AI functionality.";
            }

            setResult(mockResult);
        } catch (error) {
            setResult("Error: Failed to process request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(result);
            alert("Copied to clipboard!");
        } catch (error) {
            alert("Failed to copy to clipboard");
        }
    };

    const getToolIcon = () => {
        switch (toolType) {
            case "code": return <Code className="h-5 w-5" />;
            case "image": return <Image className="h-5 w-5" />;
            case "resume": return <FileText className="h-5 w-5" />;
            case "writing": return <Brain className="h-5 w-5" />;
            case "learning": return <BookOpen className="h-5 w-5" />;
            default: return <Zap className="h-5 w-5" />;
        }
    };

    const getToolTitle = () => {
        switch (toolType) {
            case "code": return "Code Assistant";
            case "image": return "Image Generator";
            case "resume": return "Resume Builder";
            case "writing": return "Writing Assistant";
            case "learning": return "Study Assistant";
            default: return "AI Tool";
        }
    };

    const getPlaceholder = () => {
        switch (toolType) {
            case "code": return "Describe what you want to build or paste your code here...";
            case "image": return "Describe the image you want to create...";
            case "resume": return "Describe your experience, skills, and what you're looking for...";
            case "writing": return "Enter your text or describe what you want to write...";
            case "learning": return "Enter your study material or topic...";
            default: return "Enter your prompt here...";
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Interface */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {getToolIcon()}
                        {getToolTitle()}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Zap className="h-4 w-4 mr-2" />
                            )}
                            {loading ? "Processing..." : "Generate with AI"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Generated Result</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                💡 <strong>To enable real AI functionality:</strong> Add your OpenAI API key to the environment variables.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 