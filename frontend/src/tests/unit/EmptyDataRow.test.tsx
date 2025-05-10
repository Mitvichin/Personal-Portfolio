import { render, screen } from '@testing-library/react';
import { EmptyDataRow } from '../../components/shared/EmptyDataRow';

describe('EmptyDataRow', () => {
  it('renders a row with the correct colSpan and children', () => {
    const colSpan = 5;
    const message = 'No data available';

    render(
      <table>
        <tbody>
          <EmptyDataRow colSpan={colSpan}>{message}</EmptyDataRow>
        </tbody>
      </table>,
    );

    const cell = screen.getByText(message);
    expect(cell).toBeInTheDocument();
    expect(cell.tagName).toBe('TD');
    expect(cell).toHaveAttribute('colspan', colSpan.toString());
    expect(cell).toHaveClass('text-center', 'text-sm', 'font-medium');
  });
});
