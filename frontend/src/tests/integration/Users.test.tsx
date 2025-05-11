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
import { deleteNotFound, deleteServerError } from '../mocks/handlers';
import { UNKNOW_ERROR_MESSAGE } from '../../utils/constants';

describe('Users', () => {
  initMockServer();

  it('should render users correctly', async () => {
    const { getByText, getByTestId, queryAllByText, getByLabelText } =
      renderWithProviders();

    await waitFor(() => {
      expect(getByTestId('sidebar-btn')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByTestId('sidebar-btn'));
      await fireEvent.click(getByText('Users'));
    });

    await waitFor(() => {
      expect(getByText('ID')).toBeInTheDocument();
      expect(getByText('Email')).toBeInTheDocument();
      expect(getByText('First name')).toBeInTheDocument();
      expect(getByText('Last name')).toBeInTheDocument();
      expect(getByText('Role')).toBeInTheDocument();
      expect(queryAllByText('admin').length).toBeGreaterThan(0);
      expect(queryAllByText('user').length).toBeGreaterThan(0);
      expect(getByText('0')).toBeInTheDocument();
      expect(getByText('4')).toBeInTheDocument();
      expect(getByText('of').previousSibling).toHaveTextContent('1');
      expect(getByText('of').nextSibling).toHaveTextContent('2');
      expect(getByLabelText('Previous')).toBeDisabled();
      expect(getByLabelText('Next')).toBeEnabled();
    });
  });

  it('should change pages successfully', async () => {
    const { getByText, getByLabelText } = renderWithProviders('/users');

    await waitFor(() => {
      expect(getByLabelText('Previous')).toBeDisabled();
      expect(getByLabelText('Next')).toBeEnabled();
    });

    await act(async () => {
      await fireEvent.click(getByLabelText('Next'));
    });

    await waitFor(() => {
      expect(getByText('5')).toBeInTheDocument();
      expect(getByText('9')).toBeInTheDocument();

      expect(getByLabelText('Previous')).toBeEnabled();
      expect(getByLabelText('Next')).toBeDisabled();
    });
  });

  it('should render user details modal correctly', async () => {
    const { getByText, getByTestId } = renderWithProviders('/users');

    await waitFor(() => {
      expect(getByText('0')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByText('0'));
    });

    await waitFor(() => {
      const modal = getByTestId('modal');
      expect(modal).toBeInTheDocument();
      const inModal = within(modal);
      expect(inModal.getByText('User Details')).toBeInTheDocument();
      expect(inModal.getByText('ID')).toBeInTheDocument();
      expect(inModal.getByText('First Name')).toBeInTheDocument();
      expect(inModal.getByText('Last Name')).toBeInTheDocument();
      expect(inModal.getByText('Role')).toBeInTheDocument();
      expect(inModal.getByText('0')).toBeInTheDocument();
      expect(inModal.getByText('Test')).toBeInTheDocument();
      expect(inModal.getByText('Testov')).toBeInTheDocument();
      expect(inModal.getByText('test@gmail.com')).toBeInTheDocument();
      expect(inModal.getByText('admin')).toBeInTheDocument();
      expect(inModal.getByText('Close')).toBeInTheDocument();
      expect(inModal.getByText('Delete')).toBeInTheDocument();
      expect(inModal.getByText('Delete').closest('button')).toBeDisabled();
    });
  });

  describe('Deleting user', () => {
    const deleteUser = async () => {
      const { getByText, getByTestId, getAllByText } =
        renderWithProviders('/users');
      await waitFor(() => {
        expect(getAllByText('1')[0]).toBeInTheDocument();
      });

      await act(async () => {
        await fireEvent.click(getAllByText('1')[0]);
      });

      await waitFor(() => {
        const modal = getByTestId('modal');
        expect(modal).toBeInTheDocument();
        expect(getByText('Delete').closest('button')).toBeEnabled();
      });

      await act(async () => {
        await fireEvent.click(getByText('Delete'));
      });
    };

    it('should delete user successefully', async () => {
      await deleteUser();

      await waitFor(() => {
        expect(screen.getByText('User deleted!')).toBeInTheDocument();
      });
    });

    it('should display toast when user is not found', async () => {
      server.use(deleteNotFound('user'));
      await deleteUser();

      await waitFor(() => {
        expect(
          screen.getByText("We cound't find this user!"),
        ).toBeInTheDocument();
      });
    });

    it('should display toast when internal server error happens', async () => {
      server.use(deleteServerError('user'));
      await deleteUser();

      await waitFor(() => {
        expect(screen.getByText(UNKNOW_ERROR_MESSAGE)).toBeInTheDocument();
      });
    });
  });
});
