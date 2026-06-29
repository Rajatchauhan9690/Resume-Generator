import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Protected = ({ children }) => {
  const { user, loadUser } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!localStorage.getItem("user")) {
        return;
      }

      try {
        await loadUser();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    };

    verify();
  }, [loadUser]);

  if (!authenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
