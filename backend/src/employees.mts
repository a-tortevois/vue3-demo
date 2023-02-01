import { readFile } from 'node:fs/promises';

export const AllowedOrderedBy = {
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

export const AllowedFilteredBy = {
  startDate: 'startDate',
  office: 'office',
  jobTitle: 'jobTitle',
} as const;

type AllowedOrderedByType = keyof typeof AllowedOrderedBy;

type SortModeType = keyof typeof SortMode;

type AllowedFilteredByType = keyof typeof AllowedFilteredBy;

type EmployeesQueryStringParams = {
  orderedBy: AllowedOrderedByType;
  sortMode: SortModeType;
  page: number;
  limit: number;
  filters: string;
};

export type EmployeesQueryString = {
  [T in keyof EmployeesQueryStringParams]?: EmployeesQueryStringParams[T];
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
    this.country = props.country;
    this.office = props.office;
    this.department = props.department;
    this.jobTitle = props.jobTitle;
    this.salary = props.salary;
  }
}

export type EmployeeFilterParams = {
  key: AllowedFilteredByType;
  value: string | null;
  from: string | null;
  to: string | null;
};

class EmployeeFilter {
  public readonly key: AllowedFilteredByType;
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

type CacheType = {
  orderedBy: AllowedOrderedByType | null;
  sortMode: SortModeType | null;
};

const cache: CacheType = {
  orderedBy: null,
  sortMode: null,
};

type EmployeeDatasType = {
  employees: Array<Employee>;
  countries: ReadonlyArray<string>;
  offices: ReadonlyArray<string>;
  departments: ReadonlyArray<string>;
  jobTitles: ReadonlyArray<string>;
};

const loadEmployeeDatas = async (): Promise<EmployeeDatasType> => {
  const employees: Employee[] = [];
  const countries = new Set<string>();
  const offices = new Set<string>();
  const departments = new Set<string>();
  const jobTitles = new Set<string>();

  try {
    const filePath = new URL('../data/employees.db.txt', import.meta.url);
    const lines = (await readFile(filePath, { encoding: 'utf8' })).trim().split('\n');
    for (const line of lines) {
      const props = line.split(';');
      countries.add(props[6]);
      offices.add(props[7]);
      departments.add(props[8]);
      jobTitles.add(props[9]);
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

  return {
    employees,
    countries: Array.from(countries).sort(),
    offices: Array.from(offices).sort(),
    departments: Array.from(departments).sort(),
    jobTitles: Array.from(jobTitles).sort(),
  };
};

const sortEmployees = (orderedBy: AllowedOrderedByType, sortMode: SortModeType) => {
  if (orderedBy !== cache.orderedBy || sortMode !== cache.sortMode) {
    employees.sort((a, b) => {
      switch (orderedBy) {
        case 'fullName':
        case 'office':
        case 'jobTitle': {
          switch (sortMode) {
            case 'asc': {
              return a[orderedBy].toLowerCase() < b[orderedBy].toLowerCase() ? -1 : 1;
            }
            case 'desc': {
              return a[orderedBy].toLowerCase() < b[orderedBy].toLowerCase() ? 1 : -1;
            }
          }
          break;
        }
        case 'birthDate':
        case 'startDate':
        case 'salary': {
          switch (sortMode) {
            case 'asc': {
              return a[orderedBy] - b[orderedBy];
            }
            case 'desc': {
              return b[orderedBy] - a[orderedBy];
            }
          }
          break;
        }
      }
    });
    cache.orderedBy = orderedBy;
    cache.sortMode = sortMode;
  }
};

const filterEmployees = (employees: Employee[], filterParams: EmployeeFilter) => {
  const key = String(filterParams.key);
  const value = String(filterParams.value);
  const from = String(filterParams.from);
  const to = String(filterParams.to);
  switch (key) {
    case 'startDate': {
      const fromTime = new Date(from).getTime() / 1_000 || 0;
      const toTime = new Date(to).getTime() / 1_000 || Date.now();
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

export const getEmployees = (orderedBy: AllowedOrderedByType, sortMode: SortModeType, page: number, limit: number, filters: EmployeeFilterParams[] | null) => {
  sortEmployees(orderedBy, sortMode);
  const pageStart = (page - 1) * limit;
  const pageEnd = page * limit;
  if (filters === null) {
    return {
      count: employees.length,
      data: employees.slice(pageStart, pageEnd),
    };
  } else {
    let employeesFiltered = employees.slice();
    filters.map((filter) => {
      employeesFiltered = filterEmployees(employeesFiltered, new EmployeeFilter(filter));
    });
    return {
      count: employeesFiltered.length,
      data: employeesFiltered.slice(pageStart, pageEnd),
    };
  }
};

const { employees, ...employeesFilterProps } = await loadEmployeeDatas();

export const getEmployeesFilterProps = () => {
  return employeesFilterProps;
};
