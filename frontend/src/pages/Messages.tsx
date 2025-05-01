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

export const Messages: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { getMessages } = useMessageService();
    const [messages, setMessages] = useState<Message[]>([]);
    const [totalPages, setTotaPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const loadMessages = useCallback(
      async (page: number, limit: number) => {
        try {
          setIsLoading(true);
          const { messages, totalPages } = await getMessages(page, limit);
          setMessages(messages);
          setTotaPages(totalPages);
        } catch (err: unknown) {
          if (err instanceof AppError) {
            toast.error(err.message);
            return;
          }

          toast.error('Loading messages failes!');
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
          messages={messages}
          onPageChange={(page) => loadMessages(page, MESSAGE_PER_PAGE_LIMIT)}
          totalPages={totalPages}
          limit={MESSAGE_PER_PAGE_LIMIT}
          isLoading={isLoading}
        />
      </div>
    );
  });
