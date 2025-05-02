import { useEffect, useState } from 'react';
import { TableProps } from '../../types/TableProps';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { Pagination } from '../Pagination';
import { Message } from '../../types/Message';
import { MessageDetails } from './MessageDetails';
import { MessageRow } from './MessageRow';
import { Button } from '../Button';
import { HasRole } from '../../decorators/HasRole';

const addFillerRows = (messagesLength: number, limit: number) => {
  if (messagesLength < limit) {
    return Array.from({ length: limit - messagesLength }).map((_, i) => (
      <tr key={`filler-${i}`} className="w-full border-b-1 border-gray-200">
        <td className="px-6 py-4 text-sm font-medium">
          <p className="whitespace-nowrap overflow-hidden opacity-0">filler</p>
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          <p className="whitespace-nowrap overflow-hidden opacity-0">filler</p>
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          <p className="whitespace-nowrap overflow-hidden opacity-0">filler</p>
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          <p className="whitespace-nowrap overflow-hidden opacity-0">filler</p>
        </td>
      </tr>
    ));
  }
};

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

export const MessageTable: React.FC<TableProps> = ({
  messages: messagesProps,
  onPageChange,
  onMessageDelete: onMessageDeleteProps,
  totalPages,
  limit,
  isLoading = true,
}) => {
  const [messages, setMessages] = useState<Message[]>(messagesProps);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onModalClose = () => {
    setIsModalOpened(false);

    setTimeout(() => setSelectedMessage(null), 200);
  };

  const onRowClick = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpened(true);
  };

  const onMessageDelete = async (id: string) => {
    setIsDeleteLoading(true);
    const res = await onMessageDeleteProps(id);
    if (res) {
      onModalClose();
      const index = messages.findIndex((it) => it.id === selectedMessage?.id);

      setMessages((prev) => {
        prev.splice(index, 1);
        return prev;
      });
    }

    setIsDeleteLoading(false);
  };

  const messageElements = messages.map((it) => (
    <MessageRow key={it.id} message={it} onRowClick={onRowClick} />
  ));

  const content = messageElements.length > 0 ? messageElements : noMessages;

  const deleteBtn = (
    <HasRole roles={['admin']}>
      <Button
        isLoading={isDeleteLoading}
        onClick={() => onMessageDelete(selectedMessage?.id || '')}
        className="text-white bg-red-400"
      >
        Delete
      </Button>
    </HasRole>
  );

  useEffect(() => {
    setMessages(messagesProps);
  }, [messagesProps]);

  if (isLoading && messageElements.length === 0)
    return <LoadingSpinner className="text-blue-600! border-4 size-14" />;

  return (
    <div className="flex flex-col w-full md:w-6/7">
      <Modal
        title="Message Details"
        isOpened={isModalOpened}
        onClose={onModalClose}
        footerElements={deleteBtn}
      >
        {selectedMessage && <MessageDetails message={selectedMessage} />}
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
              {messages.length >= 1 && addFillerRows(messages.length, limit)}
              <tr>
                <td colSpan={4}>
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
