import { render, fireEvent } from '@testing-library/react';
import React, { act } from 'react';
import { vi } from 'vitest';
import { withRedirectionToSourceFiles } from '../../decorators/withRedirectionToSourceFile';
import { AppError } from '../../types/AppError';
import { WithRedirectionToSourceFileProps } from '../../types/WithRedirectionToSourceFileProps';

const windowOpenMock = vi.fn();
globalThis.open = windowOpenMock;

const { toastErrorMock, toastMock } = vi.hoisted(() => {
  const toastErrorMock = vi.fn();
  const toastMock = {
    toast: { error: toastErrorMock },
  };

  return { toastErrorMock, toastMock };
});

const { mockGetFileContent, fileContentMock } = vi.hoisted(() => {
  const mockGetFileContent = vi.fn();
  const fileContentMock = {
    useGithubService: () => ({
      getFileContent: mockGetFileContent,
    }),
  };

  return { mockGetFileContent, fileContentMock };
});

vi.mock('../../services/github', () => fileContentMock);
vi.mock('react-toastify', () => toastMock);

const DummyComponent: React.FC<
  WithRedirectionToSourceFileProps & { text?: string }
> = ({ redirectToLineInSourceFile, text }) => (
  <div
    onClick={(e) => {
      return redirectToLineInSourceFile?.(e, 'dummy/path');
    }}
  >
    Test content {text}
  </div>
);

describe('withRedirectionToSourceFiles HOC', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  function mockSelection(text: string, offset = 0) {
    const selection = {
      toString: () => text,
      anchorOffset: offset,
    };
    vi.spyOn(window, 'getSelection').mockReturnValue(
      selection as unknown as Selection,
    );
  }

  it('redirects to correct line when word is found', async () => {
    const fileContent = `const a = 1;\nconst b = 2;\nconst c = 'target';\n`;
    mockGetFileContent.mockResolvedValue({
      content: fileContent,
      url: 'https://github.com/repo/file.tsx',
    });

    mockSelection('target');

    const Wrapped = withRedirectionToSourceFiles(DummyComponent);
    const { getByText } = render(<Wrapped text="target" />);

    await act(async () => {
      await fireEvent.click(getByText('Test content target'));
    });

    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://github.com/repo/file.tsx#L3',
      '_newtab-#L3',
    );
  });

  it('shows not found toast when search string not found', async () => {
    const fileContent = `const a = 1;\nconst b = 2;\n`;
    mockGetFileContent.mockResolvedValue({
      content: fileContent,
      url: 'https://github.com/repo/file.tsx',
    });

    mockSelection('missing');

    const Wrapped = withRedirectionToSourceFiles(DummyComponent);
    const { getByText } = render(<Wrapped />);

    await act(async () => {
      await fireEvent.click(getByText('Test content'));
    });

    expect(toastErrorMock).toHaveBeenCalledWith(
      'Could not find a match for the clicked word.',
    );
  });

  it('shows toast for AppError other than 404', async () => {
    mockGetFileContent.mockRejectedValue(new AppError(500, 'Internal Error'));
    mockSelection('target');

    const Wrapped = withRedirectionToSourceFiles(DummyComponent);
    const { getByText } = render(<Wrapped />);

    await act(async () => {
      await fireEvent.click(getByText('Test content'));
    });

    expect(toastErrorMock).toHaveBeenCalledWith('Internal Error');
  });

  it('shows generic toast for unknown error', async () => {
    mockGetFileContent.mockRejectedValue(new Error('Unknown'));
    mockSelection('Test');

    const Wrapped = withRedirectionToSourceFiles(DummyComponent);
    const { getByText } = render(<Wrapped />);

    await act(async () => {
      await fireEvent.click(getByText('Test content'));
    });

    expect(mockGetFileContent).toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith(
      'Could not find a match for the clicked word.',
    );
  });
});
