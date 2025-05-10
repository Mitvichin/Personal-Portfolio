import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { GetFileContentResponse } from '../../types/api/responses';
import { useGithubService } from '../../services/github';
import { BASE_API_ULR } from '../../utils/constants';

const mockAppFetch = vi.fn();
vi.mock('../../hooks/useAppFetch', () => ({
  useAppFetch: () => mockAppFetch,
}));

describe('useGithubService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls appFetch with correct params and returns file content', async () => {
    const mockResponse: GetFileContentResponse = {
      content: 'Sample file content',
      url: 'src/index.ts',
    };

    const fakeFetchResponse = new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockAppFetch.mockResolvedValue(fakeFetchResponse);

    const { result } = renderHook(() => useGithubService());

    const data = {
      searchWord: 'test',
      filePath: 'src/index.ts',
    };

    const response = await result.current.getFileContent(data);

    const expectedUrl = `${BASE_API_ULR}/github/get-file-content?searchWord=test&filePath=src%2Findex.ts`;

    expect(mockAppFetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET',
    });

    expect(response).toEqual(mockResponse);
  });
});
