import { useNavigate } from "react-router";
import { Button } from "../Button";
import { routes } from "../../router";
import { useUserContext } from "../../providers/user/UserContext";
import { logout } from "../../services/auth";
import { toast } from "react-toastify";

export const AuthNav: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteUser } = useUserContext();

  const onLogout = async () => {
    try {
      await logout();
      deleteUser();
    } catch (error) {
      console.log(error);
      toast.error("Logout failed!");
    }
  };

  console.log(user);
  return (
    <div className="h-[10%] p-1 bg-gray-100 flex sm:justify-end gap-3 md:gap-6 focus:outline-none ">
      {user ? (
        <>
          <p className="p-1 self-center">{`Hello, ${user.firstName} ${user.lastName}!`}</p>
          <Button
            text="Log out"
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={onLogout}
          />
        </>
      ) : (
        <>
          <Button
            text="Log in"
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={() => navigate(`/${routes.login}`)}
          />
          <Button
            text="Register"
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={() => navigate(`/${routes.register}`)}
          />
        </>
      )}
    </div>
  );
};
