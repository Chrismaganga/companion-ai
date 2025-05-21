import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">About Our Platform</h1>
                    <p className="text-muted-foreground text-lg">
                        A collaborative space for developers to learn, code, and grow together.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Coding Sessions</CardTitle>
                            <CardDescription>
                                Real-time collaborative coding environment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Our platform provides an interactive coding environment where developers
                                can collaborate in real-time. Share your screen, write code together,
                                and learn from each other in a dynamic setting.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Resources</CardTitle>
                            <CardDescription>
                                Comprehensive tutorials and documentation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Access a wide range of learning materials, from beginner-friendly
                                tutorials to advanced programming concepts. Our content is regularly
                                updated to keep up with the latest technologies and best practices.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Community</CardTitle>
                            <CardDescription>
                                Connect with fellow developers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Join a vibrant community of developers. Share your knowledge,
                                ask questions, and participate in discussions. Our platform
                                fosters a supportive environment for learning and growth.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Tracking</CardTitle>
                            <CardDescription>
                                Monitor your learning journey
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Track your progress with detailed analytics and insights. Set goals,
                                measure your achievements, and stay motivated on your learning path.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 