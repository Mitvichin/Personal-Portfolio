export const LoadingSpinner: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <span
      data-testid="loading-spiner"
      className={`animate-spin inline-block size-4 border-3 border-current border-t-transparent text-white rounded-full transition-all ${className}`.trim()}
    ></span>
  );
};
