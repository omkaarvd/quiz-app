"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function QuizLobbyPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const router = useRouter();
  const { roomCode } = use(params);

  const handleStartQuiz = () => {
    router.push(`/quiz/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Ready to Start?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg mb-2">Room Code: {roomCode}</p>
            <p className="text-sm text-muted-foreground">
              Click start when you're ready to begin the quiz
            </p>
          </div>
          <Button onClick={handleStartQuiz} className="w-full" size="lg">
            Start Quiz <PlayCircle className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
