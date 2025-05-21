"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Clock, Users } from "lucide-react";

interface Session {
    id: string;
    title: string;
    host: string;
    startTime: string;
    participants: number;
    status: "scheduled" | "live" | "ended";
}

interface SessionsListProps {
    sessions: Session[];
}

export const SessionsList = ({ sessions }: SessionsListProps) => {
    const router = useRouter();

    const getStatusColor = (status: Session["status"]) => {
        switch (status) {
            case "live":
                return "bg-green-500/10 text-green-500";
            case "scheduled":
                return "bg-blue-500/10 text-blue-500";
            case "ended":
                return "bg-gray-500/10 text-gray-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
                <Card
                    key={session.id}
                    className="cursor-pointer hover:bg-accent/50 transition"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                >
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{session.title}</CardTitle>
                            <Badge
                                variant="secondary"
                                className={getStatusColor(session.status)}
                            >
                                {session.status}
                            </Badge>
                        </div>
                        <CardDescription>Hosted by {session.host}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(session.startTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {session.participants} participants
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}; 