import { LiveSession } from "@/components/live-session";
import { notFound } from "next/navigation";

interface SessionPageProps {
    params: Promise<{
        sessionId: string;
    }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
    const { sessionId } = await params;

    // This would typically fetch from your database
    const session = {
        id: sessionId,
        title: "Building a React App with TypeScript",
        host: "John Doe"
    };

    if (!session) {
        return notFound();
    }

    return (
        <div className="h-full">
            <LiveSession
                sessionId={session.id}
                title={session.title}
                host={session.host}
            />
        </div>
    );
} 