export const FillerRow: React.FC<{
  dataLength: number;
  limit: number;
  colSpan: number;
}> = ({ dataLength, limit, colSpan }) => {
  if (dataLength < limit) {
    return Array.from({ length: limit - dataLength }).map((_, i) => (
      <tr key={`filler-${i}`} className="w-full border-b-1 border-gray-200">
        {Array.from({ length: colSpan }).map((_, i) => (
          <td key={`col-filler-${i}`} className="px-6 py-4 text-sm font-medium">
            <p className="whitespace-nowrap overflow-hidden opacity-0">
              filler
            </p>
          </td>
        ))}
      </tr>
    ));
  }

  return null;
};
