import api from "./api";
import { saveSession, getToken, type AuthUser } from "./authStorage";
export const getProfile = () => api.get("/users/profile").then((r) => r.data.data.user as AuthUser);
export async function updateProfile(payload: Pick<AuthUser, "name" | "phone" | "address" | "avatar">) {
  const user = (await api.put("/users/profile", payload)).data.data.user as AuthUser;
  const token = await getToken();
  if (token) await saveSession(token, user);
  return user;
}
