import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { CodeEditor } from "@/components/code-editor";

interface BlogPostPageProps {
    params: Promise<{
        postId: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { postId } = await params;

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Blog Post</h1>
            <p>Post ID: {postId}</p>
            <p>This is a placeholder for your blog post content.</p>
        </div>
    );
} 