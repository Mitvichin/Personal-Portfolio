import { describe, it, expect } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { initMockServer, server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { postServerError } from '../mocks/handlers';
import { UNKNOW_ERROR_MESSAGE } from '../../utils/constants';

describe('Contact me', () => {
  initMockServer();

  it('should send message successfully', async () => {
    const { getByText, getByPlaceholderText } =
      renderWithProviders('/home/contact-me');

    await waitFor(() => {
      expect(getByText('Contact Me')).toBeInTheDocument();
      expect(getByText('Submit').closest('button')).toBeDisabled();
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
      await fireEvent.change(
        getByPlaceholderText('Message to Ilia Mitvichin'),
        {
          target: { value: 'test message' },
        },
      );
    });
    const submit = getByText('Submit');
    expect(submit.closest('button')).toBeEnabled();

    await act(async () => {
      await fireEvent.click(submit);
    });

    await waitFor(() => {
      expect(
        getByText('Your message was sent successfully!'),
      ).toBeInTheDocument();
    });
  });

  it('should display toast if sending message fails', async () => {
    server.use(postServerError('message'));
    const { getByText, getByPlaceholderText } =
      renderWithProviders('/home/contact-me');

    await waitFor(() => {
      expect(getByText('Contact Me')).toBeInTheDocument();
      expect(getByText('Submit').closest('button')).toBeDisabled();
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
      await fireEvent.change(
        getByPlaceholderText('Message to Ilia Mitvichin'),
        {
          target: { value: 'test message' },
        },
      );
    });
    const submit = getByText('Submit');
    expect(submit.closest('button')).toBeEnabled();

    await act(async () => {
      await fireEvent.click(submit);
    });

    await waitFor(() => {
      expect(getByText(UNKNOW_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it('should show validation messages', async () => {
    const { getByText, getByPlaceholderText } =
      renderWithProviders('/home/contact-me');

    await waitFor(() => {
      expect(getByText('Contact Me')).toBeInTheDocument();
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
      await fireEvent.change(
        getByPlaceholderText('Message to Ilia Mitvichin'),
        {
          target: { value: 't' },
        },
      );
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
        getByText('Message must be at least 2 characters.'),
      ).toBeInTheDocument();
      expect(getByText('Submit').closest('button')).toBeDisabled();
    });
  });
});
