export type EntityTableProps<T> = {
  data: T[];
  limit: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<boolean>;
};
