import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to QuizMaster</h1>
          <p className="text-xl text-muted-foreground">
            Challenge your friends in real-time multiplayer quizzes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Brain className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Create Quizzes</CardTitle>
              <CardDescription>
                Design your own quizzes with multiple question types
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Play Together</CardTitle>
              <CardDescription>
                Join rooms and compete with friends in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                View statistics and climb the global leaderboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/create">
            <Button size="lg">Create Quiz</Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="outline">Join Quiz</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}