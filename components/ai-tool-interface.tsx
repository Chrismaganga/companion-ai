"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Loader2,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AIToolInterfaceProps {
    toolType: string;
}

export function AIToolInterface({ toolType }: AIToolInterfaceProps) {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [additionalData, setAdditionalData] = useState({
        name: "",
        email: "",
        style: "realistic",
        size: "1024x1024",
        language: "JavaScript",
        type: "generate",
        subject: "",
        difficulty: "medium"
    });

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult("");

        try {
            let endpoint = "";
            let payload: any = {};

            switch (toolType) {
                case "code":
                    endpoint = "/api/ai/code";
                    payload = {
                        prompt,
                        type: additionalData.type,
                        language: additionalData.language
                    };
                    break;

                case "image":
                    endpoint = "/api/ai/image";
                    payload = {
                        prompt,
                        style: additionalData.style,
                        size: additionalData.size
                    };
                    break;

                case "resume":
                    endpoint = "/api/ai/resume";
                    payload = {
                        name: additionalData.name,
                        email: additionalData.email,
                        experience: prompt,
                        skills: "",
                        targetRole: "",
                        template: "modern"
                    };
                    break;

                case "writing":
                    endpoint = "/api/ai/writing";
                    payload = {
                        text: prompt,
                        type: additionalData.type,
                        style: additionalData.style,
                        targetAudience: "students"
                    };
                    break;

                case "learning":
                    endpoint = "/api/ai/learning";
                    payload = {
                        content: prompt,
                        type: additionalData.type,
                        subject: additionalData.subject,
                        difficulty: additionalData.difficulty
                    };
                    break;

                default:
                    throw new Error("Unknown tool type");
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to generate content");
            }

            const data = await response.json();

            if (toolType === "image") {
                setResult(data.imageUrl);
            } else if (toolType === "resume") {
                setResult(data.html);
            } else {
                setResult(data.result);
            }

            toast({
                title: "Success",
                description: "Content generated successfully!",
            });

        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Failed to generate content. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(result);
            toast({
                title: "Copied!",
                description: "Content copied to clipboard",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy to clipboard",
                variant: "destructive",
            });
        }
    };

    const downloadResult = () => {
        if (toolType === "image") {
            // Download image
            const link = document.createElement("a");
            link.href = result;
            link.download = "generated-image.png";
            link.click();
        } else if (toolType === "resume") {
            // Download HTML as file
            const blob = new Blob([result], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "resume.html";
            link.click();
            URL.revokeObjectURL(url);
        } else {
            // Download text content
            const blob = new Blob([result], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${toolType}-result.txt`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const renderInterface = () => {
        switch (toolType) {
            case "code":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={additionalData.type === "generate" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "generate" })}
                            >
                                Generate Code
                            </Button>
                            <Button
                                variant={additionalData.type === "debug" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "debug" })}
                            >
                                Debug Code
                            </Button>
                            <Button
                                variant={additionalData.type === "review" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "review" })}
                            >
                                Code Review
                            </Button>
                        </div>
                        <select
                            value={additionalData.language}
                            onChange={(e) => setAdditionalData({ ...additionalData, language: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="C++">C++</option>
                            <option value="React">React</option>
                            <option value="Node.js">Node.js</option>
                        </select>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe what you want to build or paste your code here..."
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Zap className="h-4 w-4 mr-2" />
                            )}
                            Generate with AI
                        </Button>
                    </div>
                );

            case "image":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Generate Image</Button>
                            <Button variant="outline" className="flex-1">Edit Image</Button>
                            <Button variant="outline" className="flex-1">Style Transfer</Button>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={additionalData.style}
                                onChange={(e) => setAdditionalData({ ...additionalData, style: e.target.value })}
                                className="p-2 border rounded-lg"
                            >
                                <option value="realistic">Realistic</option>
                                <option value="artistic">Artistic</option>
                                <option value="cartoon">Cartoon</option>
                                <option value="abstract">Abstract</option>
                            </select>
                            <select
                                value={additionalData.size}
                                onChange={(e) => setAdditionalData({ ...additionalData, size: e.target.value })}
                                className="p-2 border rounded-lg"
                            >
                                <option value="1024x1024">1024x1024</option>
                                <option value="512x512">512x512</option>
                                <option value="1024x768">1024x768</option>
                            </select>
                        </div>
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Palette className="h-4 w-4 mr-2" />
                            )}
                            Generate Image
                        </Button>
                    </div>
                );

            case "resume":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Create Resume</Button>
                            <Button variant="outline" className="flex-1">Edit Template</Button>
                            <Button variant="outline" className="flex-1">Export PDF</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={additionalData.name}
                                    onChange={(e) => setAdditionalData({ ...additionalData, name: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={additionalData.email}
                                    onChange={(e) => setAdditionalData({ ...additionalData, email: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your experience, skills, and what you're looking for..."
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4 mr-2" />
                            )}
                            Generate Resume
                        </Button>
                    </div>
                );

            case "writing":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={additionalData.type === "write" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "write" })}
                            >
                                Write Content
                            </Button>
                            <Button
                                variant={additionalData.type === "grammar" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "grammar" })}
                            >
                                Grammar Check
                            </Button>
                            <Button
                                variant={additionalData.type === "improve" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "improve" })}
                            >
                                Improve Style
                            </Button>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your text or describe what you want to write..."
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Brain className="h-4 w-4 mr-2" />
                            )}
                            Enhance with AI
                        </Button>
                    </div>
                );

            case "learning":
                return (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={additionalData.type === "flashcards" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "flashcards" })}
                            >
                                Create Flashcards
                            </Button>
                            <Button
                                variant={additionalData.type === "quiz" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "quiz" })}
                            >
                                Generate Quiz
                            </Button>
                            <Button
                                variant={additionalData.type === "studyplan" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setAdditionalData({ ...additionalData, type: "studyplan" })}
                            >
                                Study Plan
                            </Button>
                        </div>
                        <input
                            type="text"
                            value={additionalData.subject}
                            onChange={(e) => setAdditionalData({ ...additionalData, subject: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Subject (e.g., Mathematics, Programming)"
                        />
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your study material or topic..."
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                        />
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <BookOpen className="h-4 w-4 mr-2" />
                            )}
                            Create Study Materials
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Interface */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {toolType === "code" && <Code className="h-5 w-5" />}
                        {toolType === "image" && <Image className="h-5 w-5" />}
                        {toolType === "resume" && <FileText className="h-5 w-5" />}
                        {toolType === "writing" && <Brain className="h-5 w-5" />}
                        {toolType === "learning" && <BookOpen className="h-5 w-5" />}
                        {toolType.charAt(0).toUpperCase() + toolType.slice(1)} Tool
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderInterface()}
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
                                <Button variant="outline" size="sm" onClick={downloadResult}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {toolType === "image" ? (
                            <div className="text-center">
                                <img
                                    src={result}
                                    alt="Generated"
                                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                                />
                            </div>
                        ) : toolType === "resume" ? (
                            <div
                                className="border rounded-lg p-4 bg-white"
                                dangerouslySetInnerHTML={{ __html: result }}
                            />
                        ) : (
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 