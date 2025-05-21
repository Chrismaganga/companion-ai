import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

export default function ProfilePage({ params }: ProfilePageProps) {
    // This would typically fetch from your database
    const user = {
        id: params.userId,
        name: "John Doe",
        email: "john@example.com",
        bio: "Full-stack developer passionate about React and TypeScript",
        stats: {
            sessionsAttended: 25,
            submissions: 150,
            successRate: 85
        }
    };

    if (!user) {
        return notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{user.bio}</p>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Sessions Attended
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.stats.sessionsAttended}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Total Submissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.stats.submissions}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Success Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.stats.successRate}%</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 