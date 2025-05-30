import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-4xl font-bold">404</h2>
            <p className="text-muted-foreground">Page not found</p>
            <Button asChild>
                <Link href="/">
                    Return Home
                </Link>
            </Button>
        </div>
    );
} 