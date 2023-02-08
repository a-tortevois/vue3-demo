export const OrderBy = {
  fullName: "fullName",
  birthDate: "birthDate",
  startDate: "startDate",
  office: "office",
  jobTitle: "jobTitle",
  salary: "salary",
} as const;

export const SortMode = {
  asc: "asc",
  desc: "desc",
} as const;

export const FilteredBy = {
  birthDate: "birthDate",
  startDate: "startDate",
  office: "office",
  jobTitle: "jobTitle",
  salary: "salary",
} as const;

export const FilterParams = {
  key: "key",
  value: "value",
  from: "from",
  to: "to",
} as const;

export type OrderedByType = keyof typeof OrderBy;

export type SortModeType = keyof typeof SortMode;

export type FilteredByType = keyof typeof FilteredBy;

export type FilterParamsType = keyof typeof FilterParams;

// ---------------------------------------------------------------------------------------------------------------------------------------------------

export type Filters = {
  key: string;
  value?: string;
  from?: string;
  to?: string;
};

export const SearchParams = {
  orderedBy: "orderedBy",
  sortMode: "sortMode",
  page: "page",
  limit: "limit",
  filters: "filters",
} as const;

export type SearchParamsType = {
  orderedBy?: OrderedByType | null;
  sortMode?: SortModeType | null;
  page?: number | null;
  limit?: number | null;
  filters?: string | null;
};
