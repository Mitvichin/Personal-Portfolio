import { useEffect, useState } from 'react';
import { EntityTableProps } from '../../types/EntityTableProps';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { Pagination } from '../Pagination';
import { User } from '../../types/User';
import { UserRow } from './UserRow';
import { FillerRow } from '../FillerRow';
import { UserDetails } from './UserDetails';
import { Button } from '../Button';

export const UserTable: React.FC<EntityTableProps<User>> = ({
  data: userProps,
  onPageChange,
  onDelete,
  totalPages,
  limit,
  isLoading = true,
}) => {
  const [users, setUsers] = useState<User[]>(userProps);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onModalClose = () => {
    setIsModalOpened(false);

    setTimeout(() => setSelectedUser(null), 200);
  };

  const onRowClick = (message: User) => {
    setSelectedUser(message);
    setIsModalOpened(true);
  };

  const onMessageDelete = async (id: string) => {
    setIsDeleteLoading(true);
    const res = await onDelete(id);
    if (res) {
      onModalClose();
      const index = users.findIndex((it) => it.id === selectedUser?.id);

      setUsers((prev) => {
        prev.splice(index, 1);
        return prev;
      });
    }

    setIsDeleteLoading(false);
  };

  const userElements = users.map((it) => (
    <UserRow key={it.id} data={it} onRowClick={onRowClick} />
  ));

  const deleteBtn = (
    <Button
      isDisabled={selectedUser?.role === 'admin'}
      isLoading={isDeleteLoading}
      onClick={() => onMessageDelete(selectedUser?.id || '')}
      className="text-white bg-red-400"
    >
      Delete
    </Button>
  );

  useEffect(() => {
    setUsers(userProps);
  }, [userProps]);

  if (isLoading && userElements.length === 0)
    return <LoadingSpinner className="text-blue-600! border-4 size-14" />;

  return (
    <div className="flex flex-col w-full md:w-6/7">
      <Modal
        title="Message Details"
        isOpened={isModalOpened}
        onClose={onModalClose}
        footerElements={deleteBtn}
      >
        {selectedUser && <UserDetails user={selectedUser} />}
      </Modal>
      <div className="p-1.5 w-full inline-block align-middle">
        <p className="text-xl font-medium mb-1">
          Messages
          {isLoading && (
            <LoadingSpinner className="text-blue-600! ml-2 size-3! border-2!" />
          )}
        </p>
        <div className="border border-gray-200 rounded-lg max-w-full overflow-auto bg-white shadow-md">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-1/3 sm:w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="w-2/3 sm:w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  First name
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  Last name
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="border-t-1 border-gray-200">
              {userElements}
              {users.length >= 1 && (
                <FillerRow
                  dataLength={users.length}
                  limit={limit}
                  colSpan={5}
                />
              )}
              <tr>
                <td colSpan={5}>
                  <Pagination total={totalPages} onPageChange={onPageChange} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
