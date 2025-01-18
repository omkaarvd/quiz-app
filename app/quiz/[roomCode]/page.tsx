"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  type: "MCQ" | "TRUE_FALSE";
  options: string[];
  points: number;
  timeLimit: number;
}

interface QuizMetadata {
  currentIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
  quizTitle: string;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { roomCode } = use(params);

  useEffect(() => {
    fetchQuestion(0);
  }, []);

  const fetchQuestion = async (index: number) => {
    try {
      const response = await fetch(`/api/quiz/${roomCode}?index=${index}`);
      const data = await response.json();

      if (response.ok) {
        setQuestion(data.question);
        setMetadata(data.metadata);
        setTimeLeft(data.question.timeLimit);
        setSelectedAnswer("");
      } else {
        toast.error("Failed to fetch question");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }

    try {
      const response = await fetch(`/api/quiz/${roomCode}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question?.id,
          answer: selectedAnswer,
          timeSpent: question?.timeLimit! - timeLeft,
        }),
      });

      if (response.ok) {
        if (metadata?.isLastQuestion) {
          // Handle quiz completion
        } else {
          fetchQuestion(metadata?.currentIndex! + 1);
        }
      }
    } catch (error) {
      toast.error("Failed to submit answer");
    }
  };

  if (!question || !metadata) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{metadata.quizTitle}</CardTitle>
          <div className="flex justify-between text-sm">
            <span>
              Question {metadata.currentIndex + 1}/{metadata.totalQuestions}
            </span>
            <span>Time left: {timeLeft}s</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-xl">{question.text}</div>
          <div className="space-y-2">
            {question.options.map((option) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleAnswerSubmit}
            className="w-full"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
