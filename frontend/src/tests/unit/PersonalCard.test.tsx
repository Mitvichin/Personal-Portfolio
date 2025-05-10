import { render, screen, fireEvent, act } from '@testing-library/react';
import { PersonalCard } from '../../components/about-me/PersonalCard';
import { WithRedirectionToSourceFileProps } from '../../types/WithRedirectionToSourceFileProps';

const mockRedirect = vi.fn();
vi.mock('../../decorators/withRedirectionToSourceFile', () => ({
  withRedirectionToSourceFiles: <P extends WithRedirectionToSourceFileProps>(
    WrappedComponent: React.FC<P>,
  ) => {
    return (props: P) => {
      return (
        <WrappedComponent
          {...props}
          redirectToLineInSourceFile={mockRedirect}
        />
      );
    };
  },
}));

describe('PersonalCard Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the personal card content correctly', () => {
    render(<PersonalCard />);

    // Check if the image is rendered correctly
    const image = screen.getByAltText('me');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/me.jpg');

    // Check if the text content is rendered correctly
    const textContent = screen.getByText(
      /Hi, I am Ilia Mitvichin a front-end developer with experience in creating user-friendly and responsive UI that meets business requirements, using modern JS frameworks./,
    );
    expect(textContent).toBeInTheDocument();
  });

  it('triggers redirectToLineInSourceFile on double click', async () => {
    render(<PersonalCard />);

    const textContent = screen.getByText(
      /Hi, I am Ilia Mitvichin a front-end developer with experience in creating user-friendly and responsive UI that meets business requirements, using modern JS frameworks./,
    );

    await act(async () => {
      await fireEvent.doubleClick(textContent);
    });

    expect(mockRedirect).toHaveBeenCalled();
  });
});
