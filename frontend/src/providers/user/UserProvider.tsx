import { PropsWithChildren, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { User } from "../../types/User";
import { verifyAuth } from "../../services/auth";

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const deleteUser = () => setUser(null);

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
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
