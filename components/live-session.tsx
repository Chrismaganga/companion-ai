"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
}

interface LiveSessionProps {
    sessionId: string;
    title: string;
    host: string;
}

export const LiveSession = ({
    sessionId,
    title,
    host
}: LiveSessionProps) => {
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    const handleCodeChange = (value: string) => {
        setCode(value);
        // Here you would typically send the code update to other participants
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Math.random().toString(),
            content: newMessage,
            sender: "You", // Replace with actual user name
            timestamp: new Date()
        };

        setMessages([...messages, message]);
        setNewMessage("");
        // Here you would typically send the message to other participants
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground">Hosted by {host}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-2">
                    <CodeEditor
                        onChange={handleCodeChange}
                        code={code}
                        language="javascript"
                    />
                </div>

                <Card className="flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold">Live Chat</h2>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {messages.map((message) => (
                            <div key={message.id} className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{message.sender}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm">{message.content}</p>
                            </div>
                        ))}
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button onClick={handleSendMessage} size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}; 