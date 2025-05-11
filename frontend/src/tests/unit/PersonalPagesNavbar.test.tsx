import { render, screen, fireEvent, act } from '@testing-library/react';
import { routes } from '../../router';
import { PersonalPagesNavbar } from '../../components/nav/PersonalPagesNavbar';
import { MemoryRouter } from 'react-router';

describe('PersonalPagesNavbar Component', () => {
  it('renders the navbar links correctly', () => {
    render(
      <MemoryRouter>
        <PersonalPagesNavbar />
      </MemoryRouter>,
    );

    const experienceLink = screen.getByText(/Experience/i);
    const sideProjectLink = screen.getByText(/Side Projects/i);
    const contactMeLink = screen.getByText(/Contact Me/i);

    expect(experienceLink).toBeInTheDocument();
    expect(sideProjectLink).toBeInTheDocument();
    expect(contactMeLink).toBeInTheDocument();
  });

  it('applies correct class to the active link', async () => {
    render(
      <MemoryRouter>
        <PersonalPagesNavbar />
      </MemoryRouter>,
    );

    const experienceLink = screen.getByText(/Experience/i);

    await act(async () => {
      fireEvent.click(experienceLink);
    });

    expect(experienceLink.closest('a')).toHaveClass('bg-blue-100');
  });

  it('applies hover effect on links', async () => {
    render(
      <MemoryRouter>
        <PersonalPagesNavbar />
      </MemoryRouter>,
    );

    const experienceLink = screen.getByText(/Experience/i);

    await act(async () => {
      fireEvent.mouseOver(experienceLink);
    });

    expect(experienceLink).toHaveClass('group-hover:scale-110');
  });

  it('renders links with correct paths based on routes', () => {
    render(
      <MemoryRouter>
        <PersonalPagesNavbar />
      </MemoryRouter>,
    );

    const experienceLink = screen.getByText(/Experience/i);
    expect(experienceLink.closest('a')).toHaveAttribute(
      'href',
      `/${routes.experience}`,
    );

    const sideProjectLink = screen.getByText(/Side Projects/i);
    expect(sideProjectLink.closest('a')).toHaveAttribute(
      'href',
      `/${routes.sideProject}`,
    );

    const contactMeLink = screen.getByText(/Contact Me/i);
    expect(contactMeLink.closest('a')).toHaveAttribute(
      'href',
      `/${routes.contactMe}`,
    );
  });
});
