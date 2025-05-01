import { TableProps } from '../../types/TableProps';
import { LoadingSpinner } from '../LoadingSpinner';
import { Pagination } from '../Pagination';

const addFillerRows = (messagesLength: number, limit: number) => {
  if (messagesLength < limit) {
    return Array.from({ length: limit - messagesLength }).map((_, i) => (
      <tr key={`filler-${i}`} className="w-full border-b-1">
        <td className="px-6 py-4 text-sm font-medium">
          <p className="opacity-0">filler</p>
        </td>
        <td className="hidden md:table-cell px-6 py-4 text-sm">
          <p className="opacity-0">filler</p>
        </td>
        <td className="hidden md:table-cell px-6 py-4 text-sm">
          <p className="opacity-0">filler</p>
        </td>
        <td className="px-6 py-4 text-sm">
          <p className="opacity-0">filler</p>
        </td>
      </tr>
    ));
  }
};

export const MessageTable: React.FC<TableProps> = ({
  messages: messagesProps,
  onPageChange,
  totalPages,
  limit,
  isLoading = true,
}) => {
  const noMessages = (
    <tr>
      <td
        colSpan={4}
        className="px-6 py-4 text-center text-sm font-medium text-gray-800"
      >
        <p>You don't have any messages yet!</p>
      </td>
    </tr>
  );

  const messages = messagesProps.map((it) => (
    <tr
      key={it.id}
      className="border-b-1 border-gray-200 w-full hover:bg-gray-50"
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.email}
        </p>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.firstName}
        </p>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.lastName}
        </p>
      </td>
      <td className="hidden xs:table-cell px-6 py-4 text-sm text-gray-800">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {it.message}
        </p>
      </td>
    </tr>
  ));

  const content = messages.length > 0 ? messages : noMessages;

  if (isLoading && messages.length === 0)
    return <LoadingSpinner className="text-blue-600! border-4 size-14" />;

  return (
    <div className="flex flex-col w-full md:w-6/7">
      <div className="-m-1.5">
        <div className="p-1.5 w-full inline-block align-middle">
          <p className="text-xl font-medium mb-1">
            Messages
            {isLoading && (
              <LoadingSpinner className="text-blue-600! ml-2 size-3! border-2!" />
            )}
          </p>
          <div className="border border-gray-200 rounded-lg max-w-full overflow-auto bg-white shadow-xl">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-full xs:w-1/2 sm:w-1/3 md:w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    First name
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Last name
                  </th>
                  <th
                    scope="col"
                    className="hidden xs:table-cell w-1/2 sm:w-1/4 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="border-t-1 border-gray-200">
                {content}
                {addFillerRows(messages.length, limit)}
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
