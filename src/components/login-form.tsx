"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { login as apiLogin } from "~/services/auth";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth-context";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  role: "exporter" | "dca" | "admin";
};

export function LoginForm({ className, role, ...props }: LoginFormProps) {
  const router = useRouter();
  const { login: LoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await apiLogin({ email, password, role });
      localStorage.setItem("token", token);

      LoggedIn();

      toast.success("Login successful!");

      const redirectPath =
        role === "admin" ? "/" : role === "dca" ? "/dca" : "/";
      router.push(redirectPath);
    } catch (err: any) {
      toast.error(
        "Login failed: " +
        (err?.response?.data || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">AFCFTA Nigeria</CardTitle>
          <CardDescription>
            Login as{" "}
            <strong className="capitalize">{role === "dca" ? "DCA" : role}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Register as an Exporter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
