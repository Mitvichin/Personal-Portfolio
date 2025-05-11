import { describe, it, expect } from 'vitest';
import { fireEvent, waitFor, act } from '@testing-library/react';
import { initMockServer, server } from '../mocks/server';
import { backendErrorsMap } from '../../utils/backendErrorsMap';
import { renderWithProviders } from '../test-utils/renderWithProviders';

import { failVerifyAuthHandler } from '../mocks/handlers';

describe('Login', () => {
  initMockServer();

  const renderLogin = () => renderWithProviders('/login');

  it('should succesfully log in and redirect to /home/experience', async () => {
    server.use(failVerifyAuthHandler);
    const { getByPlaceholderText, getByTestId, getByText } = renderLogin();

    await waitFor(async () => {
      expect(getByTestId('login-submit-btn')).toBeInTheDocument();
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
      expect(getByText('Experience')).toBeInTheDocument();
    });
  });

  it('should show error toast if credentials are invalid', async () => {
    server.use(failVerifyAuthHandler);
    const { getByPlaceholderText, getByTestId, getByText } = renderLogin();

    await waitFor(async () => {
      expect(getByTestId('login-submit-btn')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText(/your@email.com/i), {
        target: { value: 'invalid@example.com' },
      });
      await fireEvent.change(getByPlaceholderText(/Password/i), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      await fireEvent.click(getByTestId('login-submit-btn'));
    });

    await waitFor(() => {
      expect(
        getByText(backendErrorsMap.INVALID_CREDENTIALS()),
      ).toBeInTheDocument();
    });
  });

  it('should show validation messages', async () => {
    server.use(failVerifyAuthHandler);
    const { getByPlaceholderText, getByTestId, getByText } = renderLogin();

    await waitFor(async () => {
      expect(getByTestId('login-submit-btn')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText(/your@email.com/i), {
        target: { value: 'invalid' },
      });
      await fireEvent.change(getByPlaceholderText(/Password/i), {
        target: { value: 'pa' },
      });
    });

    await waitFor(() => {
      expect(
        getByText('Please provide a valid email address.'),
      ).toBeInTheDocument();
      expect(
        getByText('Password must be at least 4 characters.'),
      ).toBeInTheDocument();
      expect(getByTestId('login-submit-btn')).toBeDisabled();
    });
  });
});
