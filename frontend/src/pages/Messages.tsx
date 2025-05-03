import { useCallback, useEffect, useState } from 'react';
import { MessageTable } from '../components/message-table/MessageTable';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { useMessageService } from '../services/message';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { Message } from '../types/Message';
import { AppError } from '../types/AppError';
import { toast } from 'react-toastify';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const MESSAGE_PER_PAGE_LIMIT = 5;

const Messages: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { getMessages, deleteMessage } = useMessageService();
    const [messages, setMessages] = useState<Message[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const onDeleteMessage = async (id: string) => {
      try {
        await deleteMessage(id);
        loadMessages(currentPage, MESSAGE_PER_PAGE_LIMIT);
        toast.success('Message deleted!');
        return true;
      } catch (err: unknown) {
        if (err instanceof AppError) {
          if (err.code === 404) {
            toast.error("We cound't find this message!");
          } else {
            toast.error(err.message);
          }
        } else {
          toast.error('Deleting message failed!');
        }

        return false;
      }
    };

    const loadMessages = useCallback(
      async (page: number, limit: number) => {
        setCurrentPage(page);
        try {
          setIsLoading(true);
          const { messages, totalPages } = await getMessages(page, limit);
          setMessages(messages);
          setTotalPages(totalPages);
        } catch (err: unknown) {
          if (err instanceof AppError) {
            toast.error(err.message);
            return;
          }

          toast.error('Loading messages failed!');
        } finally {
          setIsLoading(false);
        }
      },
      [getMessages],
    );

    useEffect(() => {
      loadMessages(1, MESSAGE_PER_PAGE_LIMIT);
    }, [loadMessages]);

    return (
      <div
        className="w-full py-2 min-h-screen flex flex-col items-center justify-center "
        onDoubleClick={(e) =>
          redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
        }
      >
        <MessageTable
          data={messages}
          totalPages={totalPages}
          limit={MESSAGE_PER_PAGE_LIMIT}
          isLoading={isLoading}
          onPageChange={(page) => loadMessages(page, MESSAGE_PER_PAGE_LIMIT)}
          onDelete={onDeleteMessage}
        />
      </div>
    );
  });

export default Messages;
