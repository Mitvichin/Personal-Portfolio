import { describe, it, expect } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { initMockServer } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('NotFound', () => {
  initMockServer();

  it('should render NotFound page correctly', async () => {
    const { getByText } = renderWithProviders('/forbidden');
    await waitFor(() => {
      expect(getByText('403')).toBeInTheDocument();
      expect(getByText('Access Denied')).toBeInTheDocument();
      expect(
        getByText(`You do not have permission to access this page.`),
      ).toBeInTheDocument();
      expect(getByText('Go Back')).toBeInTheDocument();
      expect(getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('should navigate to home page', async () => {
    const { getByText } = renderWithProviders('/forbidden');
    await waitFor(() => {
      expect(getByText('Home Page')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByText('Home Page'));
    });

    await waitFor(() => {
      expect(getByText('Contact Me')).toBeInTheDocument();
    });
  });
});
