import { useNavigate } from "react-router";
import { Button } from "../Button";
import { routes } from "../../router";

export const AuthNav: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[10%] p-1 bg-gray-100 flex justify-between sm:justify-end gap-3 md:gap-6 focus:outline-none ">
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
    </div>
  );
};
