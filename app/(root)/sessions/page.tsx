import { SessionsList } from "@/components/sessions-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SessionsPage() {
    // This would typically fetch from your database
    const sessions = [
        {
            id: "1",
            title: "Building a React App with TypeScript",
            host: "John Doe",
            startTime: "2024-03-20T10:00:00Z",
            participants: 15,
            status: "live" as const
        },
        {
            id: "2",
            title: "Advanced JavaScript Patterns",
            host: "Jane Smith",
            startTime: "2024-03-21T14:00:00Z",
            participants: 8,
            status: "scheduled" as const
        },
        {
            id: "3",
            title: "Introduction to Next.js",
            host: "Mike Johnson",
            startTime: "2024-03-19T16:00:00Z",
            participants: 20,
            status: "ended" as const
        }
    ];

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Live Sessions</h1>
                    <p className="text-muted-foreground">
                        Join live coding sessions and learn from experts
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                </Button>
            </div>

            <SessionsList sessions={sessions} />
        </div>
    );
} 