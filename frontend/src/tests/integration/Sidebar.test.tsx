import { describe, it, expect } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { initMockServer, server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { failVerifyAuthHandler } from '../mocks/handlers';

describe('Sidebar', () => {
  initMockServer();

  it('should update sidebar state correctly', async () => {
    server.use(failVerifyAuthHandler);
    const {
      getByText,
      queryAllByText,
      queryByText,
      getByTestId,
      getByPlaceholderText,
    } = renderWithProviders('');

    await waitFor(() => {
      expect(getByText('Experience')).toBeInTheDocument();
    });

    expect(queryAllByText('Hello, Admin Adminov!').length).toBe(0);
    expect(queryByText('Users')).not.toBeInTheDocument();
    expect(queryByText('Messages')).not.toBeInTheDocument();
    expect(queryByText('Log out')).not.toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(getByTestId('sidebar-btn'));
      await fireEvent.click(getByText('Log in'));
    });

    await waitFor(async () => {
      expect(getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText(/your@email.com/i), {
        target: { value: 'admin@example.com' },
      });
      await fireEvent.change(getByPlaceholderText(/Password/i), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      await fireEvent.click(getByTestId('login-submit-btn'));
    });

    await waitFor(() => {
      expect(queryAllByText('Hello, Admin Adminov!').length).greaterThan(0);
      expect(getByText('Users')).toBeInTheDocument();
      expect(getByText('Messages')).toBeInTheDocument();
      expect(getByText('Log out')).toBeInTheDocument();
    });
  });
});
