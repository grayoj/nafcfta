"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { LogOut, KeyRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

type ProfileProps = {
  email: string;
  role: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ fixed
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);


  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }

    try {
      const res = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          currentPassword: password,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to change password.");
      } else {
        alert("Password changed successfully!");
        // Clear inputs
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Something went wrong.");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    location.reload(); // Or redirect
  };

  if (!user) {
    return (
      <main className="flex items-center justify-center my-36">
        <p className="text-muted-foreground">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center my-36 px-4 py-12">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={user.email} />
            <AvatarFallback className="text-xl">
              {user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-center">{user.email}</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="text-base font-medium">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-base font-medium">
              {format(new Date(user.createdAt), "MMMM dd, yyyy")}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            {/* Change Password Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2 items-center">
                  <KeyRound className="w-4 h-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handlePasswordChange}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Logout Button */}
            <Button
              variant="destructive"
              className="w-full flex gap-2 items-center"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
