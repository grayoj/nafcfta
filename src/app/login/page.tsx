"use client"

import { LoginForm } from "~/components/login-form"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useState } from "react"

export default function LoginPage() {
  const [role, setRole] = useState<"exporter" | "dca" | "admin">("exporter")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center">
          <img src="/logo.png" className="w-28 h-28" />
        </a>

        <Tabs value={role} onValueChange={(value) => setRole(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exporter">Exporter</TabsTrigger>
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>

        <LoginForm role={role} />
      </div>
    </div>
  )
}
