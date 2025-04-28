import { useNavigate } from 'react-router';
import { Button } from '../Button';
import { routes } from '../../router';
import { useAuthContext } from '../../providers/auth/AuthContext';
import { useAuthService } from '../../services/auth';
import { toast } from 'react-toastify';
import { AppError } from '../../types/AppError';
import BurgerIcon from '../../../public/burger-menu-icon.svg?react';
import LeftArrowIcon from '../../../public/left-arrow.svg?react';
import { useState } from 'react';
import ReactDOM from 'react-dom';

export const Sidebar: React.FC = () => {
  const { logout } = useAuthService();
  const navigate = useNavigate();
  const { user, deleteUser } = useAuthContext();

  const [isMenuOpened, setIsMenuOpened] = useState(false);

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
    <div className="p-1 bg-white left-0.5 width-[100%] mt-2 rounded-xl shadow-xl mb-1 flex justify-between md:shadow-none md:rounded-none md:absolute md:width-auto md:bg-transparent md:mt-0">
      <Button
        onClick={() => setIsMenuOpened((prev) => !prev)}
        className="px-2 py-1 md:border-1 bg-white md:border-gray-200 md:shadow-xl hover:scale-110"
      >
        <BurgerIcon width={24} height={24} />
      </Button>

      {user && (
        <p className="p-1 self-end block md:hidden font-medium">{`Hello, ${user.firstName} ${user.lastName}!`}</p>
      )}

      {ReactDOM.createPortal(
        <div
          className={`${isMenuOpened ? 'left-0' : 'left-[-101%] md:left-[-201px]'} absolute flex inset-0 flex-col bg-white top-0 gap-3 focus:outline-none min-w-[200px] w-[100%] md:w-[200px] border border-gray-200 shadow-md px-4 pb-4 rounded-md transition-all z-50`}
        >
          <LeftArrowIcon
            width="32"
            height="32"
            className="self-end hover:scale-110 hover:cursor-pointer"
            onClick={() => setIsMenuOpened((prev) => !prev)}
          />

          {user ? (
            <>
              <p className="p-1 self-center hidden md:block font-medium">{`Hello, ${user.firstName} ${user.lastName}!`}</p>
              <Button
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 mt-auto"
                onClick={onLogout}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="px-2 py-1 border-1 border-gray-200 shadow-md hover:scale-110"
                onClick={() => navigate(`/${routes.login}`)}
              >
                Log in
              </Button>
              <Button
                className="px-2 py-1 border-1 border-gray-200 shadow-md hover:scale-110"
                onClick={() => navigate(`/${routes.register}`)}
              >
                Register
              </Button>
            </>
          )}
        </div>,
        document.getElementById('root')!,
      )}
    </div>
  );
};
