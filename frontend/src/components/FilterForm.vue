<script setup lang="ts">
import { ref } from "vue";

import { type Filters, FilteredBy } from "@/types/employees";
import { useData } from "@/stores/DataStore";

const dataStore = useData();
const jobTitles = dataStore.filterProps.jobTitles;
const offices = dataStore.filterProps.offices;

const jobTitle = ref("");
const office = ref("");
const age_selector = ref("");
const age_value = ref("");
const date_from = ref("");
const date_to = ref("");
const salary_selector = ref("");
const salary_value = ref("");

const getFilters = (): Filters[] => {
  const filters = [];
  if (jobTitle.value != "" && jobTitles.includes(jobTitle.value)) {
    filters.push({ key: FilteredBy.jobTitle, value: jobTitle.value });
  }
  if (office.value != "" && offices.includes(office.value)) {
    filters.push({ key: FilteredBy.office, value: office.value });
  }
  if (age_selector.value != "" && age_value.value != "" && !isNaN(Number(age_value.value))) {
    const d = new Date();
    const birthDate = `${d.getFullYear() - Number(age_value.value)}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    switch (age_selector.value) {
      case "<": {
        filters.push({ key: FilteredBy.birthDate, to: birthDate });
        break;
      }
      case ">": {
        filters.push({ key: FilteredBy.birthDate, from: birthDate });
        break;
      }
    }
  }
  if (date_from.value != "" && date_to.value != "") {
    filters.push({ key: FilteredBy.startDate, from: date_from.value, to: date_to.value });
  } else if (date_from.value != "") {
    filters.push({ key: FilteredBy.startDate, from: date_from.value });
  } else if (date_to.value != "") {
    filters.push({ key: FilteredBy.startDate, to: date_to.value });
  }
  if (salary_selector.value != "" && salary_value.value != "" && !isNaN(Number(salary_value.value))) {
    switch (salary_selector.value) {
      case "<": {
        filters.push({ key: FilteredBy.salary, to: salary_value.value });
        break;
      }
      case ">": {
        filters.push({ key: FilteredBy.salary, from: salary_value.value });
        break;
      }
    }
  }
  return filters;
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const filters = getFilters();
  if (filters.length > 0) {
    await dataStore.fetchData({ page: null, filters: JSON.stringify(filters) });
  }
};

const handleReset = async (event: Event) => {
  event.preventDefault();
  jobTitle.value = "";
  office.value = "";
  age_selector.value = "";
  age_value.value = "";
  date_from.value = "";
  date_to.value = "";
  salary_selector.value = "";
  salary_value.value = "";
  await dataStore.fetchData({ page: null, filters: null });
};
</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <fieldset>
      <legend>Crières d'affichage</legend>
      <div>
        <label>Fonction :</label>
        <select name="position" v-model="jobTitle">
          <option value="">Toutes</option>
          <option v-for="jobTitle in jobTitles" key="{{ jobTitle }}">{{ jobTitle }}</option>
        </select>
      </div>
      <div>
        <label>Bureau :</label>
        <select name="office" v-model="office">
          <option value="">Tous</option>
          <option v-for="office in offices" key="{{ office }}">{{ office }}</option>
        </select>
      </div>
      <div>
        <label>Age:</label>
        <select name="age_selector" v-model="age_selector">
          <option value="">Tous</option>
          <option>&lt;</option>
          <option>&gt;</option></select
        ><input type="text" name="age_value" v-model="age_value" />
      </div>
      <div>
        <label>Date d'entrée :</label>
        <input type="date" name="date_from" v-model="date_from" /> to <input type="date" name="date_to" v-model="date_to" />
      </div>
      <div>
        <label>Salaire :</label>
        <select name="salary_selector" v-model="salary_selector">
          <option value="">Tous</option>
          <option>&lt;</option>
          <option>&gt;</option></select
        ><input type="text" name="salary_value" v-model="salary_value" />
      </div>
      <input type="reset" value="Reset" />
      <input type="submit" value="Submit" />
    </fieldset>
  </form>
</template>

<style scoped></style>
