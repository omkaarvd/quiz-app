"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function JoinQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "register" | "join">("login");
  const [roomCode, setRoomCode] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setStep("join");
        toast.success("Registration successful!");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.ok) {
        setStep("join");
        toast.success("Login successful!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/quiz/${roomCode}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        router.push(`/quiz/${roomCode}/lobby`);
      } else {
        toast.error("Failed to join quiz");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === "login"
              ? "Login"
              : step === "register"
              ? "Register"
              : "Join Quiz"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep("register")}
              >
                Need an account? Register
              </Button>
            </form>
          ) : step === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Choose Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full">
                Register <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="text-center text-2xl tracking-wider uppercase"
                maxLength={6}
                required
              />
              <Button type="submit" className="w-full">
                Join Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
