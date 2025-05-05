import { useCallback, useEffect, useState } from 'react';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { AppError } from '../types/AppError';
import { toast } from 'react-toastify';
import { useUserService } from '../services/user';
import { User } from '../types/User';
import { UserTable } from '../components/user-table/UserTable';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const USER_PER_PAGE_LIMIT = 5;

const Users: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { getUsers, deleteUser } = useUserService();
    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const onDeleteUser = async (id: string) => {
      try {
        await deleteUser(id);
        loadUsers(currentPage, USER_PER_PAGE_LIMIT);
        toast.success('User deleted!');
        return true;
      } catch (err: unknown) {
        if (err instanceof AppError) {
          if (err.code === 404) {
            toast.error("We cound't find this user!");
          } else {
            toast.error(err.message);
          }
        } else {
          toast.error('Deleting user failed!');
        }

        return false;
      }
    };

    const loadUsers = useCallback(
      async (page: number, limit: number) => {
        setCurrentPage(page);
        try {
          setIsLoading(true);
          const { users, totalPages } = await getUsers(page, limit);
          setUsers(users);
          setTotalPages(totalPages);
        } catch (err: unknown) {
          if (err instanceof AppError) {
            toast.error(err.message);
            return;
          }

          toast.error('Loading users failed!');
        } finally {
          setIsLoading(false);
        }
      },
      [getUsers],
    );

    useEffect(() => {
      loadUsers(1, USER_PER_PAGE_LIMIT);
    }, [loadUsers]);

    return (
      <div
        className="w-full py-2 min-h-screen flex flex-col items-center justify-center "
        onDoubleClick={(e) =>
          redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
        }
      >
        <UserTable
          data={users}
          totalPages={totalPages}
          limit={USER_PER_PAGE_LIMIT}
          isLoading={isLoading}
          onPageChange={(page) => loadUsers(page, USER_PER_PAGE_LIMIT)}
          onDelete={onDeleteUser}
        />
      </div>
    );
  });

export default Users;
