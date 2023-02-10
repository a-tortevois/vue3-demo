<script setup lang="ts">
import { useData } from '@/stores/DataStore';

import { OrderBy, SortMode, type OrderedByType, type SortModeType } from '@/types/employees';

const dataStore = useData();

async function handleClick(orderedBy: OrderedByType, sortMode: SortModeType) {
  console.log(orderedBy, sortMode);
  await dataStore.fetchData({ orderedBy, sortMode, page: 1 });
}
</script>

<template>
  <div class="table-head">
    <table>
      <thead>
        <tr>
          <th class="col-1 sorting" v-bind:class="dataStore.getFullNameClass">
            Nom
            <i class="asc" @click="handleClick(OrderBy.fullName, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.fullName, SortMode.desc)"></i>
          </th>
          <th class="col-2 sorting" v-bind:class="dataStore.getJobTitleClass">
            Fonction
            <i class="asc" @click="handleClick(OrderBy.jobTitle, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.jobTitle, SortMode.desc)"></i>
          </th>
          <th class="col-3 sorting" v-bind:class="dataStore.getOfficeClass">
            Bureau
            <i class="asc" @click="handleClick(OrderBy.office, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.office, SortMode.desc)"></i>
          </th>
          <th class="col-4 sorting" v-bind:class="dataStore.getBirthDateClass">
            Age
            <i class="asc" @click="handleClick(OrderBy.birthDate, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.birthDate, SortMode.desc)"></i>
          </th>
          <th class="col-5 sorting" v-bind:class="dataStore.getStartDateClass">
            Entrée
            <i class="asc" @click="handleClick(OrderBy.startDate, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.startDate, SortMode.desc)"></i>
          </th>
          <th class="col-6 sorting" v-bind:class="dataStore.getSalaryClass">
            Salaire
            <i class="asc" @click="handleClick(OrderBy.salary, SortMode.asc)"></i>
            <i class="desc" @click="handleClick(OrderBy.salary, SortMode.desc)"></i>
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style scoped></style>
