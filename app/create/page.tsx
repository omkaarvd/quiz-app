"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Save } from "lucide-react";
import { toast } from "sonner";

interface Question {
  text: string;
  type: "MCQ" | "TRUE_FALSE";
  options: string[];
  correctAnswer: string;
  points: number;
  order: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
      order: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "MCQ",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 10,
        order: questions.length,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          timeLimit,
          questions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Quiz created successfully!");
        router.push(`/quiz/${data.roomCode}`);
      } else {
        toast.error("Failed to create quiz");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Quiz Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Quiz Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex items-center gap-4">
                <label>Time per question (seconds):</label>
                <Input
                  type="number"
                  min="10"
                  max="300"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          Question {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeQuestion(index)}
                          disabled={questions.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Textarea
                        placeholder="Question text"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(index, "text", e.target.value)
                        }
                        required
                      />

                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(
                            index,
                            "type",
                            value as "MCQ" | "TRUE_FALSE"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ">Multiple Choice</SelectItem>
                          <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                        </SelectContent>
                      </Select>

                      {question.type === "MCQ" ? (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <Input
                              key={optionIndex}
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(index, "options", newOptions);
                              }}
                              required
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={
                              question.correctAnswer === "True"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateQuestion(index, "correctAnswer", "True")
                            }
                          >
                            True
                          </Button>
                          <Button
                            type="button"
                            variant={
                              question.correctAnswer === "False"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateQuestion(index, "correctAnswer", "False")
                            }
                          >
                            False
                          </Button>
                        </div>
                      )}

                      {question.type === "MCQ" && (
                        <Select
                          value={question.correctAnswer}
                          onValueChange={(value) =>
                            updateQuestion(index, "correctAnswer", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Correct Answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map(
                              (option, optionIndex) =>
                                option && (
                                  <SelectItem key={optionIndex} value={option}>
                                    {option}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex items-center gap-4">
                        <label>Points:</label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              "points",
                              Number(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={addQuestion}
                className="w-full"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Create Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
