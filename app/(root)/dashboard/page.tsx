"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Code,
    Image,
    FileText,
    Brain,
    BookOpen,
    Sparkles,
    ArrowRight,
    LogOut,
    User,
    Settings,
    BarChart3,
    Send,
    Copy,
    Download,
    Loader2,
    Wand2,
    Home,
    MessageSquare,
    Palette,
    Calculator,
    Music,
    Video,
    FileText as Document,
    Globe,
    Zap
} from "lucide-react";
import { signOutUser } from "@/lib/firebase";

const tools = [
    {
        id: "code",
        title: "Code Assistant",
        description: "Generate, debug, and optimize code in multiple languages",
        icon: Code,
        gradient: "from-blue-500 to-cyan-500",
        placeholder: "Write a React component that displays a user profile card...",
        examples: [
            "Create a Python function to sort a list of dictionaries by a specific key",
            "Write a JavaScript function to validate email addresses",
            "Generate a SQL query to find the top 10 customers by order value"
        ]
    },
    {
        id: "image",
        title: "Image Generator",
        description: "Create stunning graphics, logos, and visual content",
        icon: Image,
        gradient: "from-purple-500 to-pink-500",
        placeholder: "A modern logo for a tech startup with blue and white colors...",
        examples: [
            "A futuristic cityscape at night with neon lights",
            "A minimalist logo for a coffee shop",
            "A professional headshot with a modern background"
        ]
    },
    {
        id: "resume",
        title: "Resume Builder",
        description: "Create professional resumes and CVs with AI assistance",
        icon: FileText,
        gradient: "from-green-500 to-emerald-500",
        placeholder: "Create a resume for a software developer with 3 years of experience...",
        examples: [
            "Write a resume for a marketing manager with 5 years experience",
            "Create a CV for a data scientist with Python and ML skills",
            "Generate a resume for a graphic designer with portfolio examples"
        ]
    },
    {
        id: "writing",
        title: "Writing Assistant",
        description: "Enhance your writing with AI-powered tools",
        icon: Brain,
        gradient: "from-orange-500 to-red-500",
        placeholder: "Write a professional email to a client about project delays...",
        examples: [
            "Write a blog post about the benefits of remote work",
            "Create a persuasive essay about climate change",
            "Generate a product description for an eco-friendly water bottle"
        ]
    },
    {
        id: "learning",
        title: "Study Assistant",
        description: "AI-powered learning tools for students",
        icon: BookOpen,
        gradient: "from-indigo-500 to-purple-500",
        placeholder: "Explain quantum physics in simple terms...",
        examples: [
            "Create flashcards for learning Spanish vocabulary",
            "Generate a study guide for organic chemistry",
            "Write practice questions for calculus integration"
        ]
    },
    {
        id: "chat",
        title: "AI Chat",
        description: "Have conversations with AI assistant",
        icon: MessageSquare,
        gradient: "from-teal-500 to-cyan-500",
        placeholder: "Ask me anything...",
        examples: [
            "What are the latest trends in AI?",
            "Explain machine learning in simple terms",
            "Help me plan a study schedule"
        ]
    },
    {
        id: "design",
        title: "Design Tools",
        description: "Create beautiful designs and layouts",
        icon: Palette,
        gradient: "from-pink-500 to-rose-500",
        placeholder: "Design a modern website layout...",
        examples: [
            "Create a color palette for a tech brand",
            "Design a mobile app interface",
            "Generate a logo concept"
        ]
    },
    {
        id: "math",
        title: "Math Solver",
        description: "Solve complex mathematical problems",
        icon: Calculator,
        gradient: "from-yellow-500 to-orange-500",
        placeholder: "Solve this equation: 2x + 5 = 13...",
        examples: [
            "Find the derivative of x^2 + 3x + 1",
            "Solve the quadratic equation x^2 - 4x + 4 = 0",
            "Calculate the area under the curve y = x^2"
        ]
    }
];

const sidebarItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "tools", title: "AI Tools", icon: Zap },
    { id: "history", title: "History", icon: BarChart3 },
    { id: "settings", title: "Settings", icon: Settings },
];

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [selectedTool, setSelectedTool] = useState("code");
    const [activeSidebar, setActiveSidebar] = useState("tools");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [chatHistory, setChatHistory] = useState<Array<{ role: string, content: string }>>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOutUser();
        router.push('/');
    };

    const handleGenerate = async () => {
        if (!input.trim()) return;

        setIsGenerating(true);
        setOutput("");

        // Add to chat history for chat tool
        if (selectedTool === "chat") {
            setChatHistory(prev => [...prev, { role: "user", content: input }]);
        }

        // Simulate AI generation with a delay
        setTimeout(() => {
            const mockResponses = {
                code: `// Generated code for: ${input}
function exampleFunction() {
    console.log("Hello from AI-generated code!");
    return "Success";
}

// Additional implementation details...
const result = exampleFunction();
console.log(result);`,
                image: `🎨 Generated Image Description:
Based on your prompt: "${input}"

The AI has created a stunning visual that captures:
• Modern design elements
• Professional color scheme
• Clean composition
• High-quality resolution

Your image is ready for download!`,
                resume: `📄 Professional Resume Generated:

${user?.displayName || user?.email?.split('@')[0] || 'Professional'}

EXPERIENCE
• 3+ years of relevant experience
• Strong technical skills
• Proven track record of success

EDUCATION
• Bachelor's Degree in relevant field
• Certifications and training

SKILLS
• Technical: JavaScript, Python, React
• Soft Skills: Leadership, Communication
• Tools: Git, Docker, AWS`,
                writing: `✍️ AI-Generated Content:

${input}

Here's a professional response that addresses your request:

Dear [Recipient],

I hope this message finds you well. I wanted to reach out regarding the project timeline we discussed.

[Professional content continues...]

Best regards,
[Your name]`,
                learning: `📚 Study Material Generated:

Topic: ${input}

Key Concepts:
1. Fundamental principles
2. Important definitions
3. Practical examples
4. Common applications

Study Tips:
• Review regularly
• Practice with examples
• Connect concepts to real-world scenarios

Practice Questions:
1. [Question 1]
2. [Question 2]
3. [Question 3]`,
                chat: `🤖 AI Assistant:

${input}

I'd be happy to help you with that! Here's what I can tell you:

[AI response content...]

Is there anything specific you'd like me to elaborate on?`,
                design: `🎨 Design Generated:

Based on your request: "${input}"

Design Elements:
• Color Scheme: Modern and professional
• Typography: Clean and readable
• Layout: Responsive and user-friendly
• Visual Hierarchy: Clear and organized

The design follows current trends and best practices.`,
                math: `🧮 Math Solution:

Problem: ${input}

Solution:
1. Step-by-step breakdown
2. Mathematical reasoning
3. Final answer with explanation

The solution shows all working steps for clarity.`
            };

            const response = mockResponses[selectedTool as keyof typeof mockResponses] || "Generated content will appear here...";
            setOutput(response);

            if (selectedTool === "chat") {
                setChatHistory(prev => [...prev, { role: "assistant", content: response }]);
            }

            setIsGenerating(false);
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTool}-output.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExample = (example: string) => {
        setInput(example);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const currentTool = tools.find(tool => tool.id === selectedTool);

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <Sparkles className="h-8 w-8 text-blue-400" />
                        <h1 className="text-xl font-bold">AI Student Hub</h1>
                    </div>

                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSidebar(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSidebar === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* User Section */}
                <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.displayName || user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-900">
                {activeSidebar === "tools" && (
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                AI Tools
                            </h2>
                            <p className="text-gray-300">
                                Choose an AI tool and start creating amazing content.
                            </p>
                        </div>

                        {/* Tool Selection */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {tools.map((tool) => (
                                <Card
                                    key={tool.id}
                                    className={`bg-gray-800 border-none cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTool === tool.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                                        }`}
                                    onClick={() => setSelectedTool(tool.id)}
                                >
                                    <CardHeader className="text-center pb-3">
                                        <div className={`mx-auto w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-full flex items-center justify-center mb-2`}>
                                            <tool.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-sm font-semibold text-white">{tool.title}</CardTitle>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>

                        {/* AI Tool Interface */}
                        {currentTool && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Input Section */}
                                <Card className="bg-gray-800 shadow-lg border-none">
                                    <CardHeader className="border-b bg-gray-800">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 bg-gradient-to-r ${currentTool.gradient} rounded-full flex items-center justify-center`}>
                                                <currentTool.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-white">{currentTool.title}</CardTitle>
                                                <CardDescription className="text-gray-300">{currentTool.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-200 mb-3 block">
                                                Your Prompt
                                            </label>
                                            <Textarea
                                                placeholder={currentTool.placeholder}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                className="min-h-[150px] resize-none border-gray-700 focus:border-blue-500 focus:ring-blue-500 bg-gray-900 text-white placeholder-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-200">
                                                Quick Examples
                                            </label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {currentTool.examples.map((example, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleExample(example)}
                                                        className="block w-full text-left p-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200"
                                                    >
                                                        {example}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleGenerate}
                                            disabled={!input.trim() || isGenerating}
                                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 text-lg font-medium"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="mr-2 h-5 w-5" />
                                                    Generate with AI
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Output Section */}
                                <Card className="bg-gray-800 shadow-lg border-none">
                                    <CardHeader className="border-b bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg text-white">Generated Output</CardTitle>
                                                <CardDescription className="text-gray-300">Your AI-generated content appears here</CardDescription>
                                            </div>
                                            {output && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleCopy}
                                                        className="text-gray-300 border-gray-700 hover:text-white hover:border-blue-500"
                                                    >
                                                        <Copy className="h-4 w-4 mr-1" />
                                                        Copy
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleDownload}
                                                        className="text-gray-300 border-gray-700 hover:text-white hover:border-blue-500"
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="min-h-[400px] bg-gray-900 rounded-lg p-4 border border-gray-700">
                                            {isGenerating ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center">
                                                        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                                                        <p className="text-gray-200 font-medium">AI is generating your content...</p>
                                                        <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
                                                    </div>
                                                </div>
                                            ) : output ? (
                                                <pre className="whitespace-pre-wrap text-sm text-gray-100 font-mono leading-relaxed">
                                                    {output}
                                                </pre>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">
                                                    <div className="text-center">
                                                        <Wand2 className="h-16 w-16 mx-auto mb-4 text-gray-700" />
                                                        <p className="text-lg font-medium mb-2 text-gray-200">Ready to Generate</p>
                                                        <p className="text-sm text-gray-400">Enter a prompt and click generate to see AI magic!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Stats Section */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gray-800 shadow-lg border-none">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-2">
                                        <BarChart3 className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl text-white">8</CardTitle>
                                    <CardDescription className="text-gray-300">Available Tools</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="bg-gray-800 shadow-lg border-none">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl text-white">0</CardTitle>
                                    <CardDescription className="text-gray-300">Generations Today</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="bg-gray-800 shadow-lg border-none">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl text-white">Free</CardTitle>
                                    <CardDescription className="text-gray-300">Current Plan</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                )}

                {activeSidebar === "dashboard" && (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Dashboard Overview</h2>
                        <p className="text-gray-300">Welcome to your AI Student Hub dashboard!</p>
                    </div>
                )}

                {activeSidebar === "history" && (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Generation History</h2>
                        <p className="text-gray-300">View your past AI generations here.</p>
                    </div>
                )}

                {activeSidebar === "settings" && (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Settings</h2>
                        <p className="text-gray-300">Configure your AI Student Hub preferences.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 