import { readFile } from 'node:fs/promises';

export const AllowedOrderedByFields = {
  fullName: 'fullName',
  birthDate: 'birthDate',
  startDate: 'startDate',
  office: 'office',
  jobTitle: 'jobTitle',
  salary: 'salary',
} as const;

export const SortModes = {
  asc: 'asc',
  desc: 'desc',
} as const;

export const AllowedFilteredByFields = {
  startDate: 'startDate',
  office: 'office',
  jobTitle: 'jobTitle',
} as const;

type AllowedOrderedByFieldsType = keyof typeof AllowedOrderedByFields;

type SortModesType = keyof typeof SortModes;

type AllowedFilteredByFieldsType = keyof typeof AllowedFilteredByFields;

type EmployeeQueryStringParams = {
  orderedBy: AllowedOrderedByFieldsType;
  sort: SortModesType;
  page: number;
  limit: number;
  filters: string;
};

export type EmployeeQueryString = {
  [T in keyof EmployeeQueryStringParams]?: EmployeeQueryStringParams[T];
};

type EmployeeProps = {
  id: string;
  gender: string;
  firstName: string;
  lastName: string;
  birthDate: number;
  startDate: number;
  country: string;
  office: string;
  department: string;
  jobTitle: string;
  salary: number;
};

class Employee {
  public readonly id: string;
  public readonly gender: string;
  public readonly fullName: string;
  public readonly birthDate: number;
  public readonly startDate: number;
  public readonly country: string;
  public readonly office: string;
  public readonly department: string;
  public readonly jobTitle: string;
  public readonly salary: number;

  constructor(props: EmployeeProps) {
    this.id = props.id;
    this.gender = props.gender;
    this.fullName = `${props.lastName} ${props.firstName}`;
    this.birthDate = props.birthDate;
    this.startDate = props.startDate;
    this.office = props.office;
    this.country = props.country;
    this.jobTitle = props.jobTitle;
    this.department = props.department;
    this.salary = props.salary;
  }
}

type EmployeeFilterParams = {
  key: AllowedFilteredByFieldsType;
  value: string | null;
  from: string | null;
  to: string | null;
};

class EmployeeFilter {
  public readonly key: AllowedFilteredByFieldsType;
  public readonly value: string | null;
  public readonly from: string | null;
  public readonly to: string | null;

  constructor(params: EmployeeFilterParams) {
    this.key = params.key;
    this.value = params.value || null;
    this.from = params.from || null;
    this.to = params.to || null;
  }
}

type EmployeesSearchParams = {
  orderedBy: AllowedOrderedByFieldsType;
  sort: SortModesType;
  page: number;
  limit: number;
  filters: EmployeeFilterParams[];
};

/*
type EmployeeFilterParamsAsNullable = {
  [T in keyof EmployeeFilterParams]: EmployeeFilterParams[T] | null;
};
*/

type CacheType = {
  orderedBy: AllowedOrderedByFieldsType | null;
  mode: SortModesType | null;
};

const cache: CacheType = {
  orderedBy: null,
  mode: null,
};

const loadEmployees = async () => {
  const employees: Employee[] = [];
  try {
    const filePath = new URL('../data/employees.db.txt', import.meta.url);
    const lines = (await readFile(filePath, { encoding: 'utf8' })).trim().split('\n');
    for (const line of lines) {
      const props = line.split(';');
      const employee = new Employee({
        id: props[0],
        gender: props[1],
        firstName: props[2],
        lastName: props[3],
        birthDate: new Date(props[4]).getTime() / 1_000,
        startDate: new Date(props[5]).getTime() / 1_000,
        country: props[6],
        office: props[7],
        department: props[8],
        jobTitle: props[9],
        salary: Number(props[10]),
      });
      employees.push(employee);
    }
  } catch (err) {
    console.error(err);
  }
  return employees;
};

const sortEmployees = (key: AllowedOrderedByFieldsType, mode: SortModesType) => {
  if (key !== cache.orderedBy || mode !== cache.mode) {
    employees.sort((a, b) => {
      switch (key) {
        case 'fullName':
        case 'office':
        case 'jobTitle': {
          switch (mode) {
            case 'asc': {
              return a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1;
            }
            case 'desc': {
              return a[key].toLowerCase() < b[key].toLowerCase() ? 1 : -1;
            }
          }
          break;
        }
        case 'birthDate':
        case 'startDate':
        case 'salary': {
          switch (mode) {
            case 'asc': {
              return a[key] - b[key];
            }
            case 'desc': {
              return b[key] - a[key];
            }
          }
          break;
        }
      }
    });

    cache.orderedBy = key;
    cache.mode = mode;
  }
};

const filterEmployees = (employees: Employee[], filterParams: EmployeeFilter) => {
  const key = filterParams.key;
  const value = filterParams.value;
  const from = filterParams.from;
  const to = filterParams.to;
  switch (key) {
    case 'startDate': {
      const fromTime = from !== null ? new Date(from).getTime() / 1_000 : 0;
      const toTime = to !== null ? new Date(to).getTime() / 1_000 : Date.now();
      return employees.filter((employee) => employee[key] > fromTime && employee[key] < toTime);
    }
    case 'office':
    case 'jobTitle': {
      if (value !== null) {
        return employees.filter((employee) => employee[key] === value);
      }
    }
  }
  return employees;
};

export const getEmployees = (searchParams: EmployeesSearchParams) => {
  sortEmployees(searchParams.orderedBy, searchParams.sort);
  const pageStart = (searchParams.page - 1) * searchParams.limit;
  const pageEnd = searchParams.page * searchParams.limit;
  if (searchParams.filters === null) {
    return {
      count: employees.length,
      data: employees.slice(pageStart, pageEnd),
    };
  } else {
    let employeesFiltered = employees.slice();
    searchParams.filters.map((filter) => {
      employeesFiltered = filterEmployees(employeesFiltered, new EmployeeFilter(filter));
    });
    return {
      count: employeesFiltered.length,
      data: employeesFiltered.slice(pageStart, pageEnd),
    };
  }
};

const employees = await loadEmployees();
