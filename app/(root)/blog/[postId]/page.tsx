import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { CodeEditor } from "@/components/code-editor";

interface BlogPostPageProps {
    params: {
        postId: string;
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    // This would typically fetch from your database
    const post = {
        id: params.postId,
        title: "Getting Started with React and TypeScript",
        author: "John Doe",
        date: "2024-03-15",
        content: "In this tutorial, we'll explore how to build a modern React application using TypeScript...",
        code: "// Example React component with TypeScript\nimport React from 'react';\n\ninterface Props {\n  name: string;\n}\n\nconst Greeting: React.FC<Props> = ({ name }) => {\n  return <h1>Hello, {name}!</h1>;\n};\n\nexport default Greeting;"
    };

    if (!post) {
        return notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                            By {post.author} • {post.date}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-muted-foreground">{post.content}</p>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Code Example</h3>
                            <CodeEditor
                                code={post.code}
                                language="typescript"
                                readOnly
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 