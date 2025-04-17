import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../../types/User";
import { useAuthService } from "../../services/auth";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { verifyAuth, getCSRF } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCSRFToken] = useState("");

  const deleteUser = useMemo(() => () => setUser(null), []);

  useEffect(() => {
    const verifyAth = async () => {
      try {
        const user = await verifyAuth();
        setUser(user);
      } catch {
        setUser(null);
      }
    };

    verifyAth();
  }, [verifyAuth]);

  useEffect(() => {
    const getCSRFToken = async () => {
      try {
        const data = await getCSRF();
        setCSRFToken(data.csrfToken);
      } catch {
        console.error("CSRF token retrieval failed");
      }
    };

    getCSRFToken();
  }, [getCSRF]);

  return (
    <AuthContext.Provider value={{ user, setUser, deleteUser, csrfToken }}>
      {children}
    </AuthContext.Provider>
  );
};
