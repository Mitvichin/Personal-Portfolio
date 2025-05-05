import { useCallback } from 'react';
import { useAppFetch } from '../hooks/useAppFetch';
import { BASE_API_ULR } from '../utils/constants';
import { GetPaginatedDataResponse } from '../types/api/GetPaginatedDataResponse';
import { User } from '../types/User';

export const useUserService = () => {
  const appFetch = useAppFetch();

  const getUsers = useCallback(
    async (
      page: number,
      limit: number,
    ): Promise<{ users: User[]; totalPages: number; limit: number }> => {
      const res = await appFetch(
        `${BASE_API_ULR}/user?page=${page}&limit=${limit}`,
        {
          method: 'GET',
        },
      );

      const {
        data,
        pagination: { totalPages },
      }: GetPaginatedDataResponse<User> = await res.json();

      return { users: data, totalPages, limit };
    },
    [appFetch],
  );

  const deleteUser = async (id: string): Promise<{ user: User }> => {
    const res = await appFetch(`${BASE_API_ULR}/user`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    return res.json();
  };

  return { getUsers, deleteUser };
};
