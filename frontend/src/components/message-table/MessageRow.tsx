import { Message } from '../../types/Message';

export const MessageRow: React.FC<{
  message: Message;
  onRowClick: (msg: Message) => void;
}> = ({ message, onRowClick }) => (
  <tr
    onClick={() => onRowClick(message)}
    key={message.id}
    className="border-b-1 border-gray-200 w-full hover:bg-gray-50 cursor-pointer"
  >
    <td className="px-6 py-4 text-sm font-medium text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {message.email}
      </p>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {message.firstName}
      </p>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {message.lastName}
      </p>
    </td>
    <td className="hidden xs:table-cell px-6 py-4 text-sm text-gray-800">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {message.message}
      </p>
    </td>
  </tr>
);
