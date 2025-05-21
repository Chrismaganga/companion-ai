import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
    // This would typically fetch from your database
    const stats = {
        totalSessions: 150,
        activeUsers: 45,
        totalSubmissions: 1200,
        successRate: 85
    };

    const sessionData = [
        { date: "2024-01", participants: 30 },
        { date: "2024-02", participants: 45 },
        { date: "2024-03", participants: 60 },
        { date: "2024-04", participants: 75 },
        { date: "2024-05", participants: 90 }
    ];

    const languageData = [
        { language: "JavaScript", count: 450 },
        { language: "Python", count: 300 },
        { language: "TypeScript", count: 250 },
        { language: "Java", count: 200 }
    ];

    return (
        <div className="h-full">
            <Dashboard
                stats={stats}
                sessionData={sessionData}
                languageData={languageData}
            />
        </div>
    );
} 