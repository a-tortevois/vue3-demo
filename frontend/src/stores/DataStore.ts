import queryString from "query-string";

import { defineStore } from "pinia";

import {
  OrderBy,
  SortMode,
  type OrderedByType,
  type SortModeType,
  SearchParams,
  type SearchParamsType
} from "../types/employees.js";

const BASE_URL = "127.0.0.1:3000";

type FilterProps = {
  countries: readonly string[];
  offices: readonly string[];
  departments: readonly string[];
  jobTitles: readonly string[];
};

interface DataState {
  count: number;
  data: any;
  filterProps: {
    jobTitles: string[];
    offices: string[];
  };
  searchParams: {
    orderedBy: OrderedByType | null;
    sortMode: SortModeType | null;
    page: number | null;
    limit: number | null;
    filters: string | null;
  };
}

const getObjectKeys = <O extends object>(obj: O): (keyof O)[] => {
  return Object.keys(obj) as (keyof O)[];
};

export const useData = defineStore("data", {
  state: (): DataState => ({
    count: 0,
    data: {},
    filterProps: {
      jobTitles: [],
      offices: [],
    },
    searchParams: {
      orderedBy: OrderBy.fullName,
      sortMode: SortMode.asc,
      page: 1,
      limit: 15,
      filters: null,
    },
  }),
  actions: {
    async fetchDataFilter() {
      try {
        const res = await window.fetch(
          `http://${BASE_URL}/api/v1/employeesFilterProps`
        );
        if (res.status === 200) {
          const filterProps = (await res.json()) as FilterProps;
          this.filterProps.jobTitles.push(...filterProps.jobTitles);
          this.filterProps.offices.push(...filterProps.offices);
        }
      } catch (e) {
        this.filterProps.jobTitles = [];
        this.filterProps.offices = [];
      }
    },
    async fetchData(searchParams: SearchParamsType | null = null) {
      let url = `http://${BASE_URL}/api/v1/employees`;
      if (searchParams != null) {
        for (const key of getObjectKeys(searchParams)) {
          // this.searchParams[key] = searchParams[key];
          switch (key) {
            case SearchParams.orderedBy: {
              const value = searchParams[key];
              if (value && Object.keys(OrderBy).includes(value)) {
                this.searchParams[key] = value;
              }
              break;
            }
            case SearchParams.sortMode: {
              const value = searchParams[key];
              if (value && Object.keys(SortMode).includes(value)) {
                this.searchParams[key] = value;
              }
              break;
            }
            case SearchParams.page:
            case SearchParams.limit: {
              const value = searchParams[key];
              if (value) {
                this.searchParams[key] = value;
              }
              break;
            }
            case SearchParams.filters: {
              const value = searchParams[key];
              if (value) {
                this.searchParams[key] = value;
              }
              break;
            }
          }
        }
      }
      const searchParamsString = queryString.stringify(this.searchParams, {
        skipNull: true,
      });
      if (searchParamsString.length > 0) {
        url += `?${searchParamsString}`;
      }
      console.log("fetch", url);
      try {
        const res = await window.fetch(url);
        if (res.status === 200) {
          const results = await res.json();
          this.count = results.count;
          this.data = results.data;
          console.log(results);
        }
      } catch (e) {
        this.count = 0;
        this.data = {};
      }
    },
  },
  getters: {
    getMaxPages: (state): number => {
      const limit = state.searchParams.limit || 20;
      return Math.ceil(state.count / limit);
    },

    getFullNameClass: (state): Record<string, boolean> => {
      const isOrderedByFullName =
        state.searchParams.orderedBy === OrderBy.fullName;
      return {
        asc:
          isOrderedByFullName && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedByFullName && state.searchParams.sortMode === SortMode.desc,
      };
    },

    getJobTitleClass: (state): Record<string, boolean> => {
      const isOrderedByJobTitle =
        state.searchParams.orderedBy === OrderBy.jobTitle;
      return {
        asc:
          isOrderedByJobTitle && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedByJobTitle && state.searchParams.sortMode === SortMode.desc,
      };
    },

    getOfficeClass: (state): Record<string, boolean> => {
      const isOrderedByOffice = state.searchParams.orderedBy === OrderBy.office;
      return {
        asc: isOrderedByOffice && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedByOffice && state.searchParams.sortMode === SortMode.desc,
      };
    },

    getBirthDateClass: (state): Record<string, boolean> => {
      const isOrderedByBirthDate =
        state.searchParams.orderedBy === OrderBy.birthDate;
      return {
        asc:
          isOrderedByBirthDate && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedByBirthDate && state.searchParams.sortMode === SortMode.desc,
      };
    },

    getStartDateClass: (state): Record<string, boolean> => {
      const isOrderedByStartDate =
        state.searchParams.orderedBy === OrderBy.startDate;
      return {
        asc:
          isOrderedByStartDate && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedByStartDate && state.searchParams.sortMode === SortMode.desc,
      };
    },

    getSalaryClass: (state): Record<string, boolean> => {
      const isOrderedBySalary = state.searchParams.orderedBy === OrderBy.salary;
      return {
        asc: isOrderedBySalary && state.searchParams.sortMode === SortMode.asc,
        desc:
          isOrderedBySalary && state.searchParams.sortMode === SortMode.desc,
      };
    },
  },
});
