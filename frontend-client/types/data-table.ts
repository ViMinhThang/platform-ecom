export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ExtendedColumnSort<TData> {
  id: string;
  desc: boolean;
}

export type ExtendedColumnFilter<TData> = {
  id: keyof TData | string;
  value: unknown;
  operator?: string;
  variant?: string;
};

export type FilterVariant = 
  | 'text'
  | 'number'
  | 'range'
  | 'select'
  | 'multiSelect'
  | 'boolean'
  | 'date'
  | 'dateRange'
  | 'custom';

export type FilterConfig<TData> = {
  column: keyof TData;
  variant: FilterVariant;
  label: string;
  options?: { label: string; value: string }[];
};
