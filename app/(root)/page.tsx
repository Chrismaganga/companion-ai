"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Code,
    Image,
    FileText,
    Brain,
    Sparkles,
    Zap,
    Palette,
    BookOpen,
    Target,
    ArrowRight,
    Star,
    Users,
    TrendingUp,
    CheckCircle,
    Play,
    Github,
    Twitter,
    Linkedin,
    Mail,
    ChevronDown,
    Menu,
    X
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase";

const tools = [
    {
        id: "code",
        title: "Code Assistant",
        description: "Generate, debug, and optimize code in multiple languages",
        icon: Code,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        features: ["Code Generation", "Debugging", "Code Review", "Documentation", "Best Practices"],
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "image",
        title: "Image Generator",
        description: "Create stunning graphics, logos, and visual content",
        icon: Image,
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        features: ["Logo Design", "Illustrations", "UI Mockups", "Social Media Graphics", "Icons"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "resume",
        title: "Resume Builder",
        description: "Create professional resumes and CVs with AI assistance",
        icon: FileText,
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
        features: ["Template Selection", "Content Optimization", "ATS Friendly", "PDF Export", "Customization"],
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: "writing",
        title: "Writing Assistant",
        description: "Enhance your writing with AI-powered tools",
        icon: Brain,
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        features: ["Content Writing", "Grammar Check", "Plagiarism Detection", "Style Enhancement", "Translation"],
        gradient: "from-orange-500 to-red-500"
    },
    {
        id: "learning",
        title: "Study Assistant",
        description: "AI-powered learning tools for students",
        icon: BookOpen,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-950",
        features: ["Flashcards", "Quiz Generation", "Study Plans", "Note Taking", "Concept Explanation"],
        gradient: "from-indigo-500 to-purple-500"
    }
];

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Get AI-powered results in seconds, not minutes"
    },
    {
        icon: Users,
        title: "Student Focused",
        description: "Designed specifically for students and learners"
    },
    {
        icon: Star,
        title: "Premium Quality",
        description: "Professional-grade tools for academic success"
    },
    {
        icon: CheckCircle,
        title: "Easy to Use",
        description: "Intuitive interface that anyone can master"
    }
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Computer Science Student",
        content: "The code assistant helped me debug my React app in minutes. Game changer!",
        avatar: "SC"
    },
    {
        name: "Marcus Rodriguez",
        role: "Graphic Design Student",
        content: "Created stunning portfolio graphics with the image generator. Highly recommended!",
        avatar: "MR"
    },
    {
        name: "Emily Watson",
        role: "Marketing Student",
        content: "The resume builder helped me land my dream internship. Thank you!",
        avatar: "EW"
    }
];

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [selectedTool, setSelectedTool] = useState("code");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSignOut = async () => {
        await signOutUser();
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Redirect to dashboard if user is authenticated
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
        );
    }

    // Don't render the landing page if user is authenticated (will redirect)
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-8 w-8 text-white" />
                            <h1 className="text-2xl font-bold text-white">AI Student Hub</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => scrollToSection("features")}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection("tools")}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                Tools
                            </button>
                            <button
                                onClick={() => scrollToSection("testimonials")}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                Testimonials
                            </button>
                            <AuthModal
                                trigger={
                                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                                        Get Started
                                    </Button>
                                }
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-4">
                            <button
                                onClick={() => { scrollToSection("features"); setIsMenuOpen(false); }}
                                className="block text-white hover:text-blue-200 transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => { scrollToSection("tools"); setIsMenuOpen(false); }}
                                className="block text-white hover:text-blue-200 transition-colors"
                            >
                                Tools
                            </button>
                            <button
                                onClick={() => { scrollToSection("testimonials"); setIsMenuOpen(false); }}
                                className="block text-white hover:text-blue-200 transition-colors"
                            >
                                Testimonials
                            </button>
                            <AuthModal
                                trigger={
                                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                                        Get Started
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Your AI-Powered
                            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                Student Companion
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                            Boost your academic success with cutting-edge AI tools designed specifically for students,
                            programmers, and graphic designers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <AuthModal
                                trigger={
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                }
                            />
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                                onClick={() => scrollToSection("features")}
                            >
                                <Play className="mr-2 h-5 w-5" />
                                Watch Demo
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                                <div className="text-blue-200">Active Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                                <div className="text-blue-200">AI Generations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">98%</div>
                                <div className="text-blue-200">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Why Choose AI Student Hub?
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Built by students, for students. Experience the future of learning with our comprehensive AI toolkit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-blue-100">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Powerful AI Tools
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Everything you need to excel in your studies, from code generation to resume building.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {tools.map((tool, index) => (
                            <Card
                                key={tool.id}
                                className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-white/10 backdrop-blur-md border-white/20 text-white ${selectedTool === tool.id ? 'ring-4 ring-white/50 shadow-2xl' : ''
                                    } animate-pulse`}
                                style={{
                                    animationDelay: `${index * 200}ms`,
                                    animationDuration: '3s'
                                }}
                                onClick={() => setSelectedTool(tool.id)}
                            >
                                <CardHeader className="text-center">
                                    <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${tool.gradient} rounded-full flex items-center justify-center mb-4`}>
                                        <tool.icon className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">{tool.title}</CardTitle>
                                    <CardDescription className="text-blue-100">
                                        {tool.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {tool.features.slice(0, 3).map((feature, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs border-white/30 text-white">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Selected Tool Details */}
                    {user && (
                        <div className="text-center">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-3xl flex items-center justify-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${tools.find(t => t.id === selectedTool)?.gradient} rounded-full flex items-center justify-center`}>
                                            {(() => {
                                                const tool = tools.find(t => t.id === selectedTool);
                                                return tool?.icon ? <tool.icon className="h-6 w-6 text-white" /> : null;
                                            })()}
                                        </div>
                                        {tools.find(t => t.id === selectedTool)?.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-blue-100 text-lg mb-6">
                                        {tools.find(t => t.id === selectedTool)?.description}
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                                    >
                                        Try {tools.find(t => t.id === selectedTool)?.title}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 px-4 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            What Students Say
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Join thousands of satisfied students who have transformed their learning experience.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardContent className="p-8 text-center">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-xl">
                                            {testimonials[currentTestimonial].avatar}
                                        </span>
                                    </div>
                                    <p className="text-xl italic text-blue-100 mb-4">
                                        &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                                    </p>
                                    <div>
                                        <div className="font-semibold text-white">
                                            {testimonials[currentTestimonial].name}
                                        </div>
                                        <div className="text-blue-200">
                                            {testimonials[currentTestimonial].role}
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial Dots */}
                                <div className="flex justify-center space-x-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                                                }`}
                                            onClick={() => setCurrentTestimonial(index)}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Learning?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of students who are already using AI to accelerate their academic success.
                        </p>
                        {user ? (
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
                                onClick={() => scrollToSection("tools")}
                            >
                                Explore Tools
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        ) : (
                            <AuthModal
                                trigger={
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Sparkles className="h-6 w-6 text-white" />
                                <h3 className="text-xl font-bold text-white">AI Student Hub</h3>
                            </div>
                            <p className="text-blue-200">
                                Empowering students with AI-powered tools for academic success.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><button onClick={() => scrollToSection("features")}>Features</button></li>
                                <li><button onClick={() => scrollToSection("tools")}>Tools</button></li>
                                <li><button onClick={() => scrollToSection("testimonials")}>Testimonials</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>Privacy Policy</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <div className="flex space-x-4">
                                <button className="text-blue-200 hover:text-white transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </button>
                                <button className="text-blue-200 hover:text-white transition-colors">
                                    <Github className="h-5 w-5" />
                                </button>
                                <button className="text-blue-200 hover:text-white transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </button>
                                <button className="text-blue-200 hover:text-white transition-colors">
                                    <Mail className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-8 pt-8 text-center text-blue-200">
                        <p>&copy; 2024 AI Student Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 