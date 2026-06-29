import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout, logoutAll } from "../../service/api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const {
    user,
    setUser,
    loading,
    setLoading,
    loadUser, // <-- Add this
  } = context;

  const handleLogin = async (formData) => {
    try {
      setLoading(true);

      const response = await login(formData);

      setUser(response.user);

      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    try {
      setLoading(true);

      const response = await register(formData);

      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();

      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setLoading(true);

      await logoutAll();

      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    loadUser, // <-- Expose it
    handleLogin,
    handleRegister,
    handleLogout,
    handleLogoutAll,
  };
};
