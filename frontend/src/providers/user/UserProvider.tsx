import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";
import { User } from "../../types/User";
import { useAuthService } from "../../services/auth";

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { verifyAuth } = useAuthService();
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <UserContext.Provider value={{ user, setUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
