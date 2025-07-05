"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase";
import { Loader2, Mail, Chrome } from "lucide-react";

interface AuthModalProps {
    trigger?: React.ReactNode;
    mode?: "signin" | "signup";
}

export function AuthModal({ trigger, mode = "signin" }: AuthModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [authMode, setAuthMode] = useState(mode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
            router.push('/dashboard');
        }
        setLoading(false);
    };

      const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    const result = authMode === "signin" 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      router.push('/dashboard');
    }
    setLoading(false);
  };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Sign In</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {authMode === "signin" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <CardDescription className="text-center">
                        {authMode === "signin"
                            ? "Sign in to access your AI Student Hub"
                            : "Join thousands of students using AI tools"
                        }
                    </CardDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Google Sign In */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Chrome className="h-4 w-4 mr-2" />
                        )}
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleEmailAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Mail className="h-4 w-4 mr-2" />
                            )}
                            {authMode === "signin" ? "Sign In" : "Sign Up"}
                        </Button>
                    </div>

                    {/* Toggle Mode */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <button
                                className="text-primary hover:underline ml-1"
                                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                            >
                                {authMode === "signin" ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 