import { useNavigate } from 'react-router';
import { Button } from '../Button';
import { routes } from '../../router';
import { useAuthContext } from '../../providers/auth/AuthContext';
import { useAuthService } from '../../services/auth';
import { toast } from 'react-toastify';
import { AppError } from '../../types/AppError';

export const AuthNav: React.FC = () => {
  const { logout } = useAuthService();
  const navigate = useNavigate();
  const { user, deleteUser } = useAuthContext();

  const onLogout = async () => {
    try {
      await logout();
      deleteUser();
    } catch (error) {
      if (error instanceof AppError) {
        toast.error(error.message);
        return;
      }
      toast.error('Logout failed!');
    }
  };

  return (
    <div className="h-[10%] p-1 bg-gray-100 flex sm:justify-end gap-3 md:gap-6 focus:outline-none ">
      {user ? (
        <>
          <p className="p-1 self-center">{`Hello, ${user.firstName} ${user.lastName}!`}</p>
          <Button
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={onLogout}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={() => navigate(`/${routes.login}`)}
          >
            Log in
          </Button>
          <Button
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
            onClick={() => navigate(`/${routes.register}`)}
          >
            Register
          </Button>
        </>
      )}
    </div>
  );
};
