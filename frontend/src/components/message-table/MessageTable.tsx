import { TableProps } from '../../types/TableProps';
import { Pagination } from '../Pagination';

export const MessageTable: React.FC<TableProps> = ({
  messages: messagesProps,
  onPageChange,
  totalPages,
}) => {
  const noMessages = (
    <tr>
      <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
        <p>You haven't received any messages!</p>
      </td>
    </tr>
  );

  const messages = messagesProps.map((it) => (
    <tr className="border-b-1 border-gray-200 w-full hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.email}
        </p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.firstName}
        </p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.lastName}
        </p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.message}
        </p>
      </td>
    </tr>
  ));

  const content = messages.length > 0 ? messages : noMessages;

  return (
    <div className="flex flex-col w-2/3">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 w-full inline-block align-middle">
          <div className="border border-gray-200 rounded-lg max-w-full overflow-auto  bg-white">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    First name
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Last name
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="border-t-1 border-gray-200">
                {content}
                <tr>
                  <td colSpan={100}>
                    <Pagination
                      total={totalPages}
                      onPageChange={onPageChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
