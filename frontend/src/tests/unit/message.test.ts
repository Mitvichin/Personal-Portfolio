import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { Message } from '../../types/Message';
import { useMessageService } from '../../services/message';

const mockAppFetch = vi.fn();

vi.mock('../../hooks/useAppFetch', () => ({
  useAppFetch: () => mockAppFetch,
}));

describe('useMessageService', () => {
  const message: Message = {
    id: '1',
    email: 'msg@test.com',
    firstName: 'Test',
    lastName: 'Testov',
    message: 'Hello',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sendMessage sends POST request and returns response json', async () => {
    const fakeResponse = { json: vi.fn() };
    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useMessageService());

    await act(async () => {
      await result.current.sendMessage({
        firstName: 'Test',
        lastName: 'Testov',
        email: 'msg@test.com',
        message: 'Hello',
      });
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/message'),
      {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'Testov',
          email: 'msg@test.com',
          message: 'Hello',
        }),
      },
    );

    expect(fakeResponse.json).toHaveBeenCalled();
  });

  it('getMessages fetches paginated messages', async () => {
    const paginatedResponse = {
      data: [message],
      pagination: { totalPages: 2 },
    };

    const fakeResponse = new Response(JSON.stringify(paginatedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useMessageService());

    let resultData;
    await act(async () => {
      resultData = await result.current.getMessages(1, 10);
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/message?page=1&limit=10'),
      expect.objectContaining({ method: 'GET' }),
    );

    expect(resultData).toEqual({
      messages: [message],
      totalPages: 2,
      limit: 10,
    });
  });

  it('deleteMessage sends DELETE request and returns message', async () => {
    const fakeResponse = new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useMessageService());

    let deleted;
    await act(async () => {
      deleted = await result.current.deleteMessage('1');
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/message'),
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({ id: '1' }),
      }),
    );

    expect(deleted).toEqual({ message });
  });

  it('sendMessage throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Send failed'));

    const { result } = renderHook(() => useMessageService());

    await expect(
      result.current.sendMessage({
        firstName: 'X',
        lastName: 'X',
        email: 'x@x.com',
        message: 'fail',
      }),
    ).rejects.toThrow('Send failed');
  });

  it('getMessages throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Fetch messages failed'));

    const { result } = renderHook(() => useMessageService());

    await expect(result.current.getMessages(1, 5)).rejects.toThrow(
      'Fetch messages failed',
    );
  });

  it('deleteMessage throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Delete failed'));

    const { result } = renderHook(() => useMessageService());

    await expect(result.current.deleteMessage('1')).rejects.toThrow(
      'Delete failed',
    );
  });
});
