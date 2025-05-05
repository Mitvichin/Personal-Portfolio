import { PropsWithChildren } from 'react';

export const EmptyDataRow: React.FC<PropsWithChildren<{ colSpan: number }>> = ({
  children,
  colSpan,
}) => (
  <tr>
    <td
      colSpan={colSpan}
      className="px-6 py-4 text-center text-sm font-medium text-gray-800"
    >
      {children}
    </td>
  </tr>
);
