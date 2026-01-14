import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearTokens, decodeJwtPayload, getAccessToken, setTokens } from "./storage.js";
import { login as apiLogin, logout as apiLogout } from "../api/auth.js";
import { listUsers } from "../api/users.js";

const AuthContext = createContext(null);

function getUidFromAccess(token) {
  const payload = decodeJwtPayload(token);
  return payload.uid;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const reloadUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const uid = getUidFromAccess(token);

    try {
      const users = await listUsers();
      const me = users.find(u => u.id === uid);

      setUser(
        me
          ? {
              ...me,
              is_admin: me.is_admin,
              is_verified_author: me.is_verified_author,
            }
          : { id: uid, is_admin: false, is_verified_author: false }
      );
    } catch {
      setUser({ id: uid, is_admin: false, is_verified_author: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadUser();
  }, []);

  const login = async ({ email, password }) => {
    const tokens = await apiLogin({ email, password });
    setTokens(tokens);
    await reloadUser();
    return tokens;
  };

  const logout = async () => {
    await apiLogout();
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user) && !loading,
      login,
      logout,
      reloadUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
