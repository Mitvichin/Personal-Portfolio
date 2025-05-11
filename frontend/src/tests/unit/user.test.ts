import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { User } from '../../types/User';
import { Role } from '../../types/Roles';
import { useUserService } from '../../services/user';

const mockAppFetch = vi.fn();

vi.mock('../../hooks/useAppFetch', () => ({
  useAppFetch: () => mockAppFetch,
}));

describe('useUserService', () => {
  const user: User = {
    id: '1',
    email: 'user@test.com',
    role: Role.USER,
    firstName: 'Test',
    lastName: 'Testov',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUsers fetches paginated users', async () => {
    const paginatedResponse = {
      data: [user],
      pagination: { totalPages: 3 },
    };

    const fakeResponse = new Response(JSON.stringify(paginatedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useUserService());

    let resultData;
    await act(async () => {
      resultData = await result.current.getUsers(1, 10);
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/user?page=1&limit=10'),
      expect.objectContaining({ method: 'GET' }),
    );

    expect(resultData).toEqual({
      users: [user],
      totalPages: 3,
      limit: 10,
    });
  });

  it('deleteUser sends DELETE request and returns user', async () => {
    const fakeResponse = new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useUserService());

    let deleted;
    await act(async () => {
      deleted = await result.current.deleteUser('1');
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/user'),
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({ id: '1' }),
      }),
    );

    expect(deleted).toEqual({ user });
  });

  it('getUsers throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Get users failed'));

    const { result } = renderHook(() => useUserService());

    await expect(result.current.getUsers(1, 5)).rejects.toThrow(
      'Get users failed',
    );
  });

  it('deleteUser throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Delete user failed'));

    const { result } = renderHook(() => useUserService());

    await expect(result.current.deleteUser('1')).rejects.toThrow(
      'Delete user failed',
    );
  });
});
