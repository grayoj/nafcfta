import { api } from "~/lib/axios"

export type LoginPayload = {
  email: string
  password: string
  role: "admin" | "dca" | "exporter"
}

export const login = async ({ email, password, role }: LoginPayload) => {
  const endpoint = role === "exporter" ? "/auth/login" : `/auth/${role}/login`
  const res = await api.post(endpoint, { email, password })
  return res.data.token as string
}
