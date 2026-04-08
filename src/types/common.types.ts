export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface Filter {
  field: string;
  value: string | number | boolean;
}

export interface Sort {
  field: string;
  direction: "asc" | "desc";
}
