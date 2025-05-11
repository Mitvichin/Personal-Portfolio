import { describe, it, expect } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { initMockServer } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('Home', () => {
  initMockServer();

  it('should render home page correctly', async () => {
    const { getByText } = renderWithProviders();
    await waitFor(() => {
      expect(getByText('Experience')).toBeInTheDocument();
    });

    expect(getByText('TINQIN - Front-end developer')).toBeInTheDocument();
    expect(getByText('Y TREE - Front-end developer')).toBeInTheDocument();
    expect(getByText('Kallidus - Front-end developer')).toBeInTheDocument();
    expect(
      getByText(
        'Hi, I am Ilia Mitvichin a front-end developer with experience in creating user-friendly and responsive UI that meets business requirements, using modern JS frameworks.',
      ),
    ).toBeInTheDocument();
  });

  it('should successfully navigate to experience', async () => {
    const { getByText } = renderWithProviders();

    await waitFor(() => {
      expect(getByText('Side Projects')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByText('Side Projects'));
    });

    await waitFor(() => {
      expect(getByText('Crossword generator -')).toBeInTheDocument();
      expect(getByText('Sorting Visualise -')).toBeInTheDocument();
    });
  });

  it('should successfully navigate to contact me', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders();

    await waitFor(() => {
      expect(getByText('Contact Me')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(getByText('Contact Me'));
    });

    await waitFor(() => {
      expect(getByPlaceholderText('John')).toBeInTheDocument();
      expect(getByPlaceholderText('Doe')).toBeInTheDocument();
      expect(getByPlaceholderText('john.doe@company.com')).toBeInTheDocument();
      expect(
        getByPlaceholderText('Message to Ilia Mitvichin'),
      ).toBeInTheDocument();
    });
  });
});
