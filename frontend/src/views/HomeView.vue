<script setup lang="ts">
import FilterForm from "@/components/FilterForm.vue";

async function handleSubmit(payload: any) {
  console.log("HomeView.handleSubmit", payload);
}
</script>

<template>
  <main>
    <h1>Home</h1>
    <FilterForm @submit="handleSubmit" />
  </main>
</template>

<style scoped></style>
