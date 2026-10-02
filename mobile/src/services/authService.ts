import api from "./api";
import type { AuthUser } from "./authStorage";

export type AuthSession = { token: string; user: AuthUser };
const sessionFrom = (response: { data: { data: AuthSession } }) => response.data.data;
export const register = (payload: { name: string; email: string; password: string }) => api.post("/auth/register", payload).then(sessionFrom);
export const login = (payload: { email: string; password: string }) => api.post("/auth/login", payload).then(sessionFrom);
export const readableError = (error: unknown) => {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.message || "Something went wrong. Please try again.";
};
