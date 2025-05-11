import { render, screen } from '@testing-library/react';
import { FillerRow } from '../../components/shared/FillerRow';

describe('FillerRow', () => {
  it('renders correct number of filler rows and columns', () => {
    const dataLength = 3;
    const limit = 5;
    const colSpan = 4;

    render(
      <table>
        <tbody>
          <FillerRow dataLength={dataLength} limit={limit} colSpan={colSpan} />
        </tbody>
      </table>,
    );

    const expectedRows = limit - dataLength;

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(expectedRows);

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(colSpan);
    });
  });

  it('renders nothing when dataLength >= limit', () => {
    const { container } = render(
      <table>
        <tbody>
          <FillerRow dataLength={5} limit={5} colSpan={4} />
        </tbody>
      </table>,
    );

    expect(container.querySelectorAll('tr')).toHaveLength(0);
  });
});
