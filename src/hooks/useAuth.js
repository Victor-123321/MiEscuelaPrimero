import { useState, useEffect, useCallback } from "react";
import { login as apiLogin, logout as apiLogout, verifyToken, getToken } from "../services/api";

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function check() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const u = await verifyToken();
        setUser(u);
      } catch {
        // expired or invalid, just ignore
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { user: u } = await apiLogin(email, password);
      setUser(u);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return { user, loading, error, setError, login, logout, isAuthenticated: !!user };
}
