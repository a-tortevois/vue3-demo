<script setup lang="ts">
import { useData } from '@/stores/DataStore';

const dataStore = useData();

function formatBirthDate(birthDate: string) {
  const d = Date.now() - new Date(Number(birthDate) * 1_000).getTime();
  return (d / 3.15576e10).toFixed(1); // 365.25 * 24 * 60 * 60 * 1000
}

function formatStartDate(startDate: string) {
  const d = new Date(Number(startDate) * 1_000);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

function formatSalary(salary: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(salary);
}
</script>

<template>
  <div class="table-body">
    <table>
      <tbody>
        <tr v-for="row of dataStore.data">
          <td class="col-1" v-bind:class="dataStore.getFullNameClass">{{ row.fullName }}</td>
          <td class="col-2" v-bind:class="dataStore.getJobTitleClass">{{ row.jobTitle }}</td>
          <td class="col-3" v-bind:class="dataStore.getOfficeClass">{{ row.office }}</td>
          <td class="col-4" v-bind:class="dataStore.getBirthDateClass">{{ formatBirthDate(row.birthDate) }}</td>
          <td class="col-5" v-bind:class="dataStore.getStartDateClass">{{ formatStartDate(row.startDate) }}</td>
          <td class="col-6" v-bind:class="dataStore.getSalaryClass">{{ formatSalary(row.salary) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
