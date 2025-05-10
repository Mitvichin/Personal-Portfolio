import {
  screen,
  fireEvent,
  waitFor,
  act,
  render,
} from '@testing-library/react';
import { Modal } from '../../components/shared';
import { addAppContainerDiv } from '../test-utils/addApplicationContainers';

addAppContainerDiv();

describe('Modal component', () => {
  const titleText = 'Test Modal Title';
  const contentText = 'Modal body content';
  const footerText = 'Footer Content';

  it('does not render when isOpened is false', async () => {
    render(
      <Modal isOpened={false} onClose={vi.fn()} title={titleText}>
        {contentText}
      </Modal>,
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();

    await waitFor(() => {
      expect(modal?.className).toContain('hidden');
    });
  });

  it('renders title and content when open', async () => {
    render(
      <Modal isOpened={true} onClose={vi.fn()} title={titleText}>
        {contentText}
      </Modal>,
    );

    await waitFor(() => {
      expect(screen.getByText(titleText)).toBeInTheDocument();
      expect(screen.getByText(contentText)).toBeInTheDocument();
    });
  });

  it('renders footer elements', async () => {
    render(
      <Modal
        isOpened={true}
        onClose={vi.fn()}
        title={titleText}
        footerElements={<div>{footerText}</div>}
      >
        {contentText}
      </Modal>,
    );

    await waitFor(() => {
      expect(screen.getByText(footerText)).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpened={true} onClose={onClose} title={titleText}>
        {contentText}
      </Modal>,
    );

    const closeButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent === 'Close');

    expect(closeButton).toBeDefined();

    await act(async () => {
      await fireEvent.click(closeButton!);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpened={true} onClose={onClose} title={titleText}>
        {contentText}
      </Modal>,
    );

    const modal = screen.getByText(titleText);

    await act(async () => {
      await fireEvent.keyDown(modal, { key: 'Escape' });
    });
    expect(onClose).toHaveBeenCalled();
  });
});
