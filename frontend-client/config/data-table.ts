export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  textOperators: [
    { label: 'Chứa', value: 'iLike' as const },
    { label: 'Không chứa', value: 'notILike' as const },
    { label: 'Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'ne' as const },
    { label: 'Đang trống', value: 'isEmpty' as const },
    { label: 'Không trống', value: 'isNotEmpty' as const }
  ],
  numericOperators: [
    { label: 'Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'ne' as const },
    { label: 'Nhỏ hơn', value: 'lt' as const },
    { label: 'Nhỏ hơn hoặc bằng', value: 'lte' as const },
    { label: 'Lớn hơn', value: 'gt' as const },
    { label: 'Lớn hơn hoặc bằng', value: 'gte' as const },
    { label: 'Nằm trong khoảng', value: 'isBetween' as const },
    { label: 'Đang trống', value: 'isEmpty' as const },
    { label: 'Không trống', value: 'isNotEmpty' as const }
  ],
  dateOperators: [
    { label: 'Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'ne' as const },
    { label: 'Trước ngày', value: 'lt' as const },
    { label: 'Sau ngày', value: 'gt' as const },
    { label: 'Vào hoặc trước ngày', value: 'lte' as const },
    { label: 'Vào hoặc sau ngày', value: 'gte' as const },
    { label: 'Nằm trong khoảng', value: 'isBetween' as const },
    { label: 'Tương đối với hôm nay', value: 'isRelativeToToday' as const },
    { label: 'Đang trống', value: 'isEmpty' as const },
    { label: 'Không trống', value: 'isNotEmpty' as const }
  ],
  selectOperators: [
    { label: 'Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'ne' as const },
    { label: 'Đang trống', value: 'isEmpty' as const },
    { label: 'Không trống', value: 'isNotEmpty' as const }
  ],
  multiSelectOperators: [
    { label: 'Có bất kỳ giá trị nào', value: 'inArray' as const },
    { label: 'Không có giá trị nào', value: 'notInArray' as const },
    { label: 'Đang trống', value: 'isEmpty' as const },
    { label: 'Không trống', value: 'isNotEmpty' as const }
  ],
  booleanOperators: [
    { label: 'Là', value: 'eq' as const },
    { label: 'Không phải là', value: 'ne' as const }
  ],
  sortOrders: [
    { label: 'Tăng dần', value: 'asc' as const },
    { label: 'Giảm dần', value: 'desc' as const }
  ],
  filterVariants: [
    'text',
    'number',
    'range',
    'date',
    'dateRange',
    'boolean',
    'select',
    'multiSelect'
  ] as const,
  operators: [
    'iLike',
    'notILike',
    'eq',
    'ne',
    'inArray',
    'notInArray',
    'isEmpty',
    'isNotEmpty',
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween',
    'isRelativeToToday'
  ] as const,
  joinOperators: ['and', 'or'] as const
};
