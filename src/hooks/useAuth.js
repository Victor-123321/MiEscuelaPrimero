/**
 * useAuth — manages admin authentication state.
 * Persists JWT in localStorage and validates it on mount.
 */
import { useState, useEffect, useCallback } from "react";
import { login as apiLogin, logout as apiLogout, verifyToken, getToken } from "../services/api";

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // On mount, validate any existing token
  useEffect(() => {
    async function check() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const u = await verifyToken();
        setUser(u);
      } catch {
        // Token expired / invalid — discard silently
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
