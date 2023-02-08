<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { useData } from '@/stores/DataStore';
import ResultTableHeader from './ResultTableHeader.vue';
import ResultTableBody from './ResultTableBody.vue';
import ResultTableFooter from './ResultTableFooter.vue';

const dataStore = useData();

/*
onMounted(async () => {
  await dataStore.fetchData();
});
*/
</script>

<template>
  <div class="table-container">
    <ResultTableHeader />
    <ResultTableBody />
    <ResultTableFooter />
  </div>
</template>

<style scoped></style>
