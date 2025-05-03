import { User } from '../../types/User';

export const UserDetails: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-6 break-all">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">ID</label>
          <p className="mt-1 text-sm text-gray-800">{user.id}</p>
        </div>

        <div className="flex-2 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-800">{user.email}</p>
        </div>
        <div className="flex-2 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            Role
          </label>
          <p className="mt-1 text-sm text-gray-800">{user.role}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            First Name
          </label>
          <p className="mt-1 text-sm text-gray-800">{user.firstName}</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-xl p-4 shadow-md">
          <label className="block text-sm font-medium text-gray-500">
            Last Name
          </label>
          <p className="mt-1 text-sm text-gray-800">{user.lastName}</p>
        </div>
      </div>
    </div>
  );
};
