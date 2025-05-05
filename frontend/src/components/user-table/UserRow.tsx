import { EntityRowProps } from '../../types/EntityRowProps';
import { User } from '../../types/User';

export const UserRow: React.FC<EntityRowProps<User>> = ({
  data: user,
  onRowClick,
}) => (
  <tr
    onClick={() => onRowClick(user)}
    key={user.id}
    className="border-b-1 border-gray-200 w-full hover:bg-gray-50 cursor-pointer"
  >
    <td className="px-6 py-4 text-sm font-medium text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.id}
      </p>
    </td>
    <td className="px-6 py-4 text-sm font-medium text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.email}
      </p>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.firstName}
      </p>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.lastName}
      </p>
    </td>
    <td className="hidden xs:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.role}
      </p>
    </td>
  </tr>
);
