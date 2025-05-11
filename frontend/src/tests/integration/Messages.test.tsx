import { describe, it, expect } from 'vitest';
import {
  act,
  fireEvent,
  waitFor,
  screen,
  within,
} from '@testing-library/react';
import { initMockServer, server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import {
  deleteNotFound,
  deleteServerError,
  verifyAuthHandlerWithUser,
} from '../mocks/handlers';
import { UNKNOW_ERROR_MESSAGE } from '../../utils/constants';

describe('Message', () => {
  initMockServer();

  it('should render messages correctly', async () => {
    const { getByText, getByTestId, getByLabelText } = renderWithProviders();

    await waitFor(() => {
      expect(getByTestId('sidebar-btn')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByTestId('sidebar-btn'));
      await fireEvent.click(getByText('Messages'));
    });

    await waitFor(() => {
      expect(getByText('Email')).toBeInTheDocument();
      expect(getByText('First name')).toBeInTheDocument();
      expect(getByText('Last name')).toBeInTheDocument();
      expect(getByText('Message')).toBeInTheDocument();
      expect(getByText('Test msg 0')).toBeInTheDocument();
      expect(getByText('Test msg 4')).toBeInTheDocument();
      expect(getByText('of').previousSibling).toHaveTextContent('1');
      expect(getByText('of').nextSibling).toHaveTextContent('2');
      expect(getByLabelText('Previous')).toBeDisabled();
      expect(getByLabelText('Next')).toBeEnabled();
    });
  });

  it('should change pages successfully', async () => {
    const { getByText, getByLabelText } = renderWithProviders('/messages');

    await waitFor(() => {
      expect(getByLabelText('Previous')).toBeDisabled();
      expect(getByLabelText('Next')).toBeEnabled();
    });

    await act(async () => {
      await fireEvent.click(getByLabelText('Next'));
    });

    await waitFor(() => {
      expect(getByText('Test msg 5')).toBeInTheDocument();
      expect(getByText('Test msg 9')).toBeInTheDocument();

      expect(getByLabelText('Previous')).toBeEnabled();
      expect(getByLabelText('Next')).toBeDisabled();
    });
  });

  it('should render message details modal correctly', async () => {
    const { getByText, getByTestId } = renderWithProviders('/messages');

    await waitFor(() => {
      expect(getByText('Test msg 0')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByText('Test msg 0'));
    });

    await waitFor(() => {
      const modal = getByTestId('modal');
      expect(modal).toBeInTheDocument();
      const inModal = within(modal);
      expect(inModal.getByText('Message Details')).toBeInTheDocument();
      expect(inModal.getByText('Email')).toBeInTheDocument();
      expect(inModal.getByText('First Name')).toBeInTheDocument();
      expect(inModal.getByText('Last Name')).toBeInTheDocument();
      expect(inModal.getByText('Test')).toBeInTheDocument();
      expect(inModal.getByText('Testov')).toBeInTheDocument();
      expect(inModal.getByText('test@gmail.com')).toBeInTheDocument();
      expect(inModal.getByText('Test msg 0')).toBeInTheDocument();
      expect(inModal.getByText('Close')).toBeInTheDocument();
      expect(inModal.getByText('Delete').closest('button')).toBeEnabled();
    });
  });

  describe('Deleting message', () => {
    const deleteMessage = async () => {
      const { getByText, getByTestId } = renderWithProviders('/messages');
      await waitFor(() => {
        expect(getByText('Test msg 0')).toBeInTheDocument();
      });

      await act(async () => {
        await fireEvent.click(getByText('Test msg 0'));
      });

      await waitFor(() => {
        const modal = getByTestId('modal');
        expect(modal).toBeInTheDocument();
        expect(getByText('Delete').closest('button')).toBeEnabled();
      });

      await act(async () => {
        await fireEvent.click(screen.getByText('Delete'));
      });
    };

    it('should delete message successefully', async () => {
      await deleteMessage();

      await waitFor(() => {
        expect(screen.getByText('Message deleted!')).toBeInTheDocument();
      });
    });

    it('should display toast when message is not found', async () => {
      server.use(deleteNotFound('message'));
      await deleteMessage();

      await waitFor(() => {
        expect(
          screen.getByText("We cound't find this message!"),
        ).toBeInTheDocument();
      });
    });

    it('should display toast when internal server error happens', async () => {
      server.use(deleteServerError('message'));
      await deleteMessage();

      await waitFor(() => {
        expect(screen.getByText(UNKNOW_ERROR_MESSAGE)).toBeInTheDocument();
      });
    });

    it('delete button should be disabled for users with role user', async () => {
      server.use(verifyAuthHandlerWithUser);
      const { getByText, getByTestId, queryByText } =
        renderWithProviders('/messages');
      await waitFor(() => {
        expect(getByText('Test msg 0')).toBeInTheDocument();
      });

      await act(async () => {
        await fireEvent.click(getByText('Test msg 0'));
      });

      await waitFor(() => {
        const modal = getByTestId('modal');
        expect(modal).toBeInTheDocument();
        expect(queryByText('Delete')).not.toBeInTheDocument();
      });
    });
  });
});
