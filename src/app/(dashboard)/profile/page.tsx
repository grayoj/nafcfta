"use client"

import { useState } from "react"
import { format } from "date-fns"
import { LogOut, KeyRound } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"

type ProfileProps = {
  name: string
  email: string
  applications: number
  createdAt: Date
}

const mockUser: ProfileProps = {
  name: "Gerald Okereke",
  email: "geraldmokereke@gmail.com",
  applications: 1,
  createdAt: new Date("2024-04-23T14:30:00"),
}

export default function ProfilePage() {
  const { name, email, applications, createdAt } = mockUser

  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordChange = () => {
    // TODO: Integrate password change logic
    console.log("Changing password to:", newPassword)
  }

  const handleLogout = () => {
    // TODO: Logout logic
    console.log("Logging out...")
  }

  return (
    <main className="flex items-center justify-center my-36 px-4 py-12">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="text-xl">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-center">{name}</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-base font-medium">{email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Applications</p>
            <p className="text-base font-medium">{applications}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-base font-medium">
              {format(createdAt, "MMMM dd, yyyy")}
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
  )
}
