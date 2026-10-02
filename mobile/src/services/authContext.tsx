import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { clearSession, getStoredUser, getToken, saveSession, type AuthUser } from "./authStorage";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setAuthenticatedUser: (token: string, user: AuthUser) => Promise<void>;
  updateUser: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getToken(), getStoredUser()])
      .then(([token, storedUser]) => setUser(token && storedUser ? storedUser : null))
      .finally(() => setLoading(false));
  }, []);

  const setAuthenticatedUser = useCallback(async (token: string, nextUser: AuthUser) => {
    await saveSession(token, nextUser);
    setUser(nextUser);
  }, []);

  const updateUser = useCallback(async (nextUser: AuthUser) => {
    const token = await getToken();
    if (token) await saveSession(token, nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, setAuthenticatedUser, updateUser, logout }), [user, loading, setAuthenticatedUser, updateUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
