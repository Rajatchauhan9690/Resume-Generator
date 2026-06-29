import { createContext, useState, useEffect, useCallback } from "react";
import { getUser } from "../service/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const [loading, setLoading] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getUser();

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loadUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
