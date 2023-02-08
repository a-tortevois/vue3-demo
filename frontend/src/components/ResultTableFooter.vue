<script setup lang="ts">
import { ref, computed } from "vue";

import { useData } from "@/stores/DataStore";

const dataStore = useData();

const page = ref(dataStore.searchParams.page || 1);
const limit = ref(dataStore.searchParams.page || 20);

const currentPage = page.value;

const isFirstPageDisabled = computed(() => page.value < 3);
const isPreviousPageDisabled = computed(() => page.value < 2);
const isNextPageDisabled = computed(() => page.value > dataStore.getMaxPages - 1);
const isLastPageDisabled = computed(() => page.value > dataStore.getMaxPages - 2);

const previousPage = computed(() => page.value - 1);
const nextPage = computed(() => page.value + 1);

const handleSizeChange = async () => {
  if (!isNaN(limit.value)) {
    const maxPages = Math.ceil(dataStore.count / Number(limit.value));
    if (page.value > maxPages) {
      await dataStore.fetchData({ page: maxPages, limit: limit.value });
      page.value = maxPages;
    } else {
      await dataStore.fetchData({ limit: limit.value });
    }
  }
};

const handlePageBlur = async () => {
  if (!isNaN(page.value) && page.value >= 1 && page.value <= dataStore.getMaxPages) {
    await dataStore.fetchData({ page: page.value });
  } else {
    page.value = currentPage;
  }
};

const handlePageClick = async (p: number, disabled: boolean) => {
  if (disabled) {
    return;
  }
  if (!isNaN(p) && p >= 1 && p <= dataStore.getMaxPages) {
    await dataStore.fetchData({ page: p });
    page.value = p;
  }
};
</script>

<template>
  <select name="limit" v-model="limit" @change="handleSizeChange">
    <option value="20">20</option>
    <option value="50">50</option>
  </select>

  <a role="link" v-bind:aria-disabled="isFirstPageDisabled" v-bind:class="{ disable: isFirstPageDisabled }" @click="handlePageClick(1, isFirstPageDisabled)">&lt;&lt;</a>
  &nbsp;
  <a role="link" v-bind:aria-disabled="isPreviousPageDisabled" v-bind:class="{ disable: isPreviousPageDisabled }" @click="handlePageClick(previousPage, isPreviousPageDisabled)">&lt;</a>
  Page <input name="page" min="1" v-bind:max="dataStore.getMaxPages" v-model="page" @blur="handlePageBlur" /> / {{ dataStore.getMaxPages }}
  <a role="link" v-bind:aria-disabled="isNextPageDisabled" v-bind:class="{ disable: isNextPageDisabled }" @click="handlePageClick(nextPage, isNextPageDisabled)">&gt;</a>
  &nbsp;
  <a role="link" v-bind:aria-disabled="isLastPageDisabled" v-bind:class="{ disable: isLastPageDisabled }" @click="handlePageClick(dataStore.getMaxPages, isLastPageDisabled)">&gt;&gt;</a>
</template>

<style scoped>
a {
  text-decoration: underline;
  cursor: pointer;
}

a.disable {
  text-decoration: none;
  cursor: default;
}
</style>
