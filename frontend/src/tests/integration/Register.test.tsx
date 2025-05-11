import { describe, it, expect } from 'vitest';
import { fireEvent, waitFor, act } from '@testing-library/react';
import { initMockServer, server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';

import { failVerifyAuthHandler, postServerError } from '../mocks/handlers';
import { UNKNOW_ERROR_MESSAGE } from '../../utils/constants';

describe('Register', () => {
  initMockServer();

  beforeEach(() => {
    server.use(failVerifyAuthHandler);
  });

  const renderRegister = () => renderWithProviders('/register');

  it('should succesfully register and redirect to log in', async () => {
    const { getByPlaceholderText, getByText, queryAllByText, queryByText } =
      renderRegister();

    await waitFor(async () => {
      expect(getByText('Submit')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('John'), {
        target: { value: 'Test' },
      });
      await fireEvent.change(getByPlaceholderText('Doe'), {
        target: { value: 'Testov' },
      });
      await fireEvent.change(getByPlaceholderText('john.doe@company.com'), {
        target: { value: 'admin@example.com' },
      });
      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      await fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(queryAllByText('Log in').length).toBeGreaterThan(1);
      expect(queryByText('Submit')).not.toBeInTheDocument();
      expect(
        getByText('Your registration was successfull!'),
      ).toBeInTheDocument();
    });
  });

  it('should show toast when registration fails', async () => {
    server.use(postServerError('auth/register'));
    const { getByPlaceholderText, getByText, queryByText } = renderRegister();

    await waitFor(async () => {
      expect(getByText('Submit')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('John'), {
        target: { value: 'Test' },
      });
      await fireEvent.change(getByPlaceholderText('Doe'), {
        target: { value: 'Testov' },
      });
      await fireEvent.change(getByPlaceholderText('john.doe@company.com'), {
        target: { value: 'admin@example.com' },
      });
      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      await fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(queryByText('Submit')).toBeInTheDocument();
      expect(getByText(UNKNOW_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it('should show validation messages', async () => {
    server.use(postServerError('auth/register'));
    const { getByPlaceholderText, getByText } = renderRegister();

    await waitFor(async () => {
      expect(getByText('Submit')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.change(getByPlaceholderText('John'), {
        target: { value: 'T' },
      });
      await fireEvent.change(getByPlaceholderText('Doe'), {
        target: { value: 'T' },
      });
      await fireEvent.change(getByPlaceholderText('john.doe@company.com'), {
        target: { value: 'admin' },
      });
      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: 'pa' },
      });
    });

    await waitFor(() => {
      expect(
        getByText('First name must be at least 2 characters.'),
      ).toBeInTheDocument();
      expect(
        getByText('Last name must be at least 2 characters.'),
      ).toBeInTheDocument();
      expect(
        getByText('Please provide a valid email address.'),
      ).toBeInTheDocument();
      expect(
        getByText('Password must be at least 4 characters.'),
      ).toBeInTheDocument();
      expect(
        getByText('Password must be at least 4 characters.'),
      ).toBeInTheDocument();
      expect(getByText('Submit').closest('button')).toBeDisabled();
    });
  });
});
