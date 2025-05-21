import { LiveSession } from "@/components/live-session";
import { notFound } from "next/navigation";

interface SessionPageProps {
    params: {
        sessionId: string;
    };
}

export default function SessionPage({ params }: SessionPageProps) {
    // This would typically fetch from your database
    const session = {
        id: params.sessionId,
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