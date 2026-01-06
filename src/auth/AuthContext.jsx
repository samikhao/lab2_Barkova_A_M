import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearTokens, decodeJwtPayload, getAccessToken, setTokens } from "./storage.js";
import { login as apiLogin, logout as apiLogout } from "../api/auth.js";
import { listUsers } from "../api/users.js";

const AuthContext = createContext(null);

function getUidFromAccess(token) {
  const payload = decodeJwtPayload(token) || {};
  // у тебя в refresh payload ключ "uid"
  return payload.uid ?? payload.sub ?? payload.user_id ?? payload.id ?? null;
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
      const me = Array.isArray(users) ? users.find((u) => String(u.id) === String(uid)) : null;

      // если is_admin не приходит в UserRead — будем считать false
      setUser(
        me
          ? {
              ...me,
              is_admin: Boolean(me.is_admin), // если нет поля — будет false
              is_verified_author: Boolean(me.is_verified_author),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const tokens = await apiLogin({ email, password });
    setTokens(tokens);
    await reloadUser();
    return tokens;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {}
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(getAccessToken()),
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
