import {
  screen,
  fireEvent,
  getByTestId,
  act,
  render,
} from '@testing-library/react';
import { Sidebar } from '../../components/shared/Sidebar';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ReactNode } from 'react';
import { addAppContainerDiv } from '../test-utils/addApplicationContainers';

const mockLogout = vi.fn();
const mockDeleteUser = vi.fn();

vi.mock('../../services/auth', () => ({
  useAuthService: () => ({
    logout: mockLogout,
  }),
}));

vi.mock('../../providers/auth/AuthContext', async () => {
  const actual = await vi.importActual('../../providers/auth/AuthContext');

  return {
    ...actual,
    useAuthContext: () => ({
      user: { firstName: 'Test', lastName: 'User' },
      deleteUser: mockDeleteUser,
    }),
  };
});

addAppContainerDiv();

afterEach(() => {
  vi.clearAllMocks();
});

describe('Sidebar', () => {
  const renderSiderbar = (node: ReactNode) =>
    render(<MemoryRouter>{node}</MemoryRouter>);

  it('renders the menu button', () => {
    renderSiderbar(<Sidebar />);
    expect(screen.getByTestId('sidebar-btn')).toBeInTheDocument();
  });

  it('toggles menu open and close', async () => {
    renderSiderbar(<Sidebar />);
    const toggleButton = screen.getByTestId('sidebar-btn');

    await act(async () => {
      await fireEvent.click(toggleButton);
    });

    expect(
      await screen.findByRole('button', { name: /log out/i }),
    ).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(screen.getByTestId('left-arrow'));
    });

    await new Promise((r) => setTimeout(r, 100));

    expect(screen.getByTestId('sidebar').className).toContain('left-[-101%]');
  });

  it('calls logout and deletes user on log out', async () => {
    mockLogout.mockResolvedValue(undefined);

    renderSiderbar(<Sidebar />);

    await act(async () => {
      await fireEvent.click(getByTestId(document.body, 'sidebar-btn'));
    });

    const logoutButton = await screen.findByRole('button', {
      name: /log out/i,
    });

    await act(async () => {
      await fireEvent.click(logoutButton);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockDeleteUser).toHaveBeenCalled();
  });
});
