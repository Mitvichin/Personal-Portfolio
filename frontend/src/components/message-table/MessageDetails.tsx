import { Message } from '../../types/Message';

export const MessageDetails: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="flex-1 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-800">{message.email}</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-xl p-4 mt-4 md:mt-0 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            First Name
          </label>
          <p className="mt-1 text-sm text-gray-800">{message.firstName}</p>
        </div>

        <div className="flex-1  border border-gray-300 rounded-xl p-4 mt-4 md:mt-0 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            Last Name
          </label>
          <p className="mt-1 text-sm text-gray-800">{message.lastName}</p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl p-4 shadow-md">
        <label className="block text-sm font-medium text-gray-500">
          Message
        </label>
        <p className="mt-1 text-sm text-gray-800 whitespace-pre-line overflow-auto max-h-72">
          {message.message}
        </p>
      </div>
    </div>
  );
};
