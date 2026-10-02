import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "foodmart.token";
const USER_KEY = "foodmart.user";

export type AuthUser = { id: string; name: string; email: string; role: "user" | "delivery"; phone?: string; address?: string; avatar?: string };

export async function saveSession(token: string, user: AuthUser) {
  await AsyncStorage.multiSet([[TOKEN_KEY, token], [USER_KEY, JSON.stringify(user)]]);
}
export async function getToken() { return AsyncStorage.getItem(TOKEN_KEY); }
export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export async function clearSession() { await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]); }
