import { readFile } from 'node:fs/promises';

import { OrderBy, SortMode, FilteredBy, OrderedByType, SortModeType, FilteredByType, EmployeeFilterParams } from '../types/employees.js';

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

class EmployeeFilter {
  public readonly key: FilteredByType;
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
  orderedBy: OrderedByType | null;
  sortMode: SortModeType | null;
  sortedEmployees: Employee[] | null;
};

const cache: CacheType = {
  orderedBy: null,
  sortMode: null,
  sortedEmployees: null,
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
    const filePath = new URL('../../data/employees.db.txt', import.meta.url);
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

const sortEmployees = (orderedBy: OrderedByType, sortMode: SortModeType): Employee[] => {
  if (orderedBy !== cache.orderedBy || sortMode !== cache.sortMode || cache.sortedEmployees === null) {
    const sortedEmployees = JSON.parse(JSON.stringify(employees)) as Employee[]; // Deep copy
    sortedEmployees.sort((a, b) => {
      switch (orderedBy) {
        case OrderBy.fullName:
        case OrderBy.office:
        case OrderBy.jobTitle: {
          switch (sortMode) {
            case SortMode.asc: {
              return a[orderedBy].toLowerCase() < b[orderedBy].toLowerCase() ? -1 : 1;
            }
            case SortMode.desc: {
              return a[orderedBy].toLowerCase() < b[orderedBy].toLowerCase() ? 1 : -1;
            }
          }
          break;
        }
        case OrderBy.birthDate:
        case OrderBy.startDate: {
          switch (sortMode) {
            case SortMode.asc: {
              return b[orderedBy] - a[orderedBy];
            }
            case SortMode.desc: {
              return a[orderedBy] - b[orderedBy];
            }
          }
          break;
        }
        case OrderBy.salary: {
          switch (sortMode) {
            case SortMode.asc: {
              return a[orderedBy] - b[orderedBy];
            }
            case SortMode.desc: {
              return b[orderedBy] - a[orderedBy];
            }
          }
          break;
        }
      }
    });
    cache.orderedBy = orderedBy;
    cache.sortMode = sortMode;
    return sortedEmployees;
  } else {
    return cache.sortedEmployees;
  }
};

const filterEmployees = (employees: Employee[], filterParams: EmployeeFilter) => {
  const key = String(filterParams.key);
  const value = String(filterParams.value);
  const from = String(filterParams.from);
  const to = String(filterParams.to);
  switch (key) {
    case FilteredBy.birthDate:
    case FilteredBy.startDate: {
      const fromTime = new Date(from).getTime() / 1_000 || 0;
      const toTime = new Date(to).getTime() / 1_000 || Date.now();
      return employees.filter((employee) => employee[key] > fromTime && employee[key] < toTime);
    }
    case FilteredBy.office:
    case FilteredBy.jobTitle: {
      if (value !== null) {
        return employees.filter((employee) => employee[key] === value);
      }
      break;
    }
    case FilteredBy.salary: {
      const fromSalary = Number(from) || 0;
      const toSalary = Number(to) || Number.POSITIVE_INFINITY;
      return employees.filter((employee) => employee[key] > fromSalary && employee[key] < toSalary);
    }
  }
  return employees;
};

export const getEmployees = (orderedBy: OrderedByType, sortMode: SortModeType, page: number, limit: number, filters: EmployeeFilterParams[] | null) => {
  let _employees = sortEmployees(orderedBy, sortMode);
  const pageStart = (page - 1) * limit;
  const pageEnd = page * limit;
  if (filters === null) {
    return {
      count: _employees.length,
      data: _employees.slice(pageStart, pageEnd),
    };
  } else {
    filters.map((filter) => {
      _employees = filterEmployees(_employees, new EmployeeFilter(filter));
    });
    return {
      count: _employees.length,
      data: _employees.slice(pageStart, pageEnd),
    };
  }
};

export const exportEmployees = (orderedBy: OrderedByType, sortMode: SortModeType, filters: EmployeeFilterParams[] | null) => {
  let _employees = sortEmployees(orderedBy, sortMode);
  if (filters) {
    filters.map((filter) => {
      _employees = filterEmployees(_employees, new EmployeeFilter(filter));
    });
  }
  return _employees.map((value) => {
    return {
      fullName: value.fullName,
      jobTitle: value.jobTitle,
      office: value.office,
      birthDate: value.birthDate,
      startData: value.startDate,
      salary: value.salary,
    };
  });
};

const { employees, ...employeesFilterProps } = await loadEmployeeDatas();

export const getEmployeesFilterProps = () => {
  return employeesFilterProps;
};
