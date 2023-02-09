<script setup lang="ts">
import { ref, onMounted } from 'vue';

import FilterForm from '@/components/FilterForm.vue';
import ResultTable from '@/components/ResultTable.vue';

/*
async function handleSubmit(payload: any) {
  console.log('HomeView.handleSubmit', payload);
}
*/
</script>

<template>
  <main>
    <h1>Home</h1>
    <FilterForm />
    <ResultTable />
  </main>
</template>

<style scoped></style>
