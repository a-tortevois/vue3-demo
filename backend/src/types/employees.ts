export const OrderBy = {
  fullName: 'fullName',
  birthDate: 'birthDate',
  startDate: 'startDate',
  office: 'office',
  jobTitle: 'jobTitle',
  salary: 'salary',
} as const;

export const SortMode = {
  asc: 'asc',
  desc: 'desc',
} as const;

export const FilteredBy = {
  birthDate: 'birthDate',
  startDate: 'startDate',
  office: 'office',
  jobTitle: 'jobTitle',
  salary: 'salary',
} as const;

export const FilterParams = {
  key: 'key',
  value: 'value',
  from: 'from',
  to: 'to',
} as const;

export type OrderedByType = keyof typeof OrderBy;

export type SortModeType = keyof typeof SortMode;

export type FilteredByType = keyof typeof FilteredBy;

export type FilterParamsType = keyof typeof FilterParams;

type EmployeesQueryStringParams = {
  orderedBy: OrderedByType;
  sortMode: SortModeType;
  page: number;
  limit: number;
  filters: string;
};

export type EmployeesQueryString = {
  [T in keyof EmployeesQueryStringParams]?: EmployeesQueryStringParams[T];
};

export type EmployeeFilterParams = {
  key: FilteredByType;
  value: string | null;
  from: string | null;
  to: string | null;
};
