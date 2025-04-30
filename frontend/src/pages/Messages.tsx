import { useCallback, useEffect, useState } from 'react';
import { Table } from '../components/message-table/MessageTableTable';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { useMessageService } from '../services/message';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { Message } from '../types/Message';
import { AppError } from '../types/AppError';
import { toast } from 'react-toastify';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;

export const Messages: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { getMessages } = useMessageService();
    const [messages, setMessages] = useState<Message[]>([]);

    const loadMessages = useCallback(
      async (page: number, limit: number) => {
        try {
          const { messages } = await getMessages(page, limit);
          setMessages(messages);
        } catch (err: unknown) {
          if (err instanceof AppError) {
            toast.error(err.message);
            return;
          }

          toast.error('Loading messages failes!');
        }
      },
      [getMessages],
    );

    useEffect(() => {
      loadMessages(1, 2);
    }, [loadMessages]);

    return (
      <div
        className="w-full py-2 min-h-screen flex flex-col items-center "
        onDoubleClick={(e) =>
          redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
        }
      >
        <Table
          messages={messages}
          onPageChange={(page) => loadMessages(page, 2)}
        />
      </div>
    );
  });
