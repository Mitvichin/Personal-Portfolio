import { describe, it, expect } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { initMockServer } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('Forbidden', () => {
  initMockServer();

  it('should render Forbidden page correctly', async () => {
    const { getByText } = renderWithProviders('/random-page');
    await waitFor(() => {
      expect(getByText('404')).toBeInTheDocument();
      expect(getByText('Page Not Found')).toBeInTheDocument();
      expect(
        getByText(
          `The page you're looking for doesn’t exist or has been moved.`,
        ),
      ).toBeInTheDocument();
      expect(getByText('Go Back')).toBeInTheDocument();
      expect(getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('should navigate to home page', async () => {
    const { getByText } = renderWithProviders('/random-page');
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
