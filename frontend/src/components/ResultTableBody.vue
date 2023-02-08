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
</script>

<template>
  <div class="table-body">
    <table>
      <tbody>
        <tr v-for="row of dataStore.data">
          <td class="col-1">{{ row.fullName }}</td>
          <td class="col-2">{{ row.jobTitle }}</td>
          <td class="col-3">{{ row.office }}</td>
          <td class="col-4">{{ formatBirthDate(row.birthDate) }}</td>
          <td class="col-5">{{ formatStartDate(row.startDate) }}</td>
          <td class="col-6">{{ row.salary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
