export type EntityRowProps<T> = {
  data: T;
  onRowClick: (msg: T) => void;
};
