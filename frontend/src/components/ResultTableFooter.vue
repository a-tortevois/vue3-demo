<script setup lang="ts">
import { ref, computed } from "vue";

import { useData } from "@/stores/DataStore";

const dataStore = useData();

const page = ref(dataStore.searchParams.page || 1);
const limit = ref(dataStore.searchParams.limit || 15);

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
  <div class="table-footer">
    <div class="left">
      Lignes par pages :
      <div class="select">
        <select name="limit" v-model="limit" @change="handleSizeChange">
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span class="focus"></span>
      </div>
      Nombre total de lignes : <span> {{ dataStore.count }}</span>
    </div>
    <div class="right">
      <a role="link" class="icon i-first" v-bind:class="{ disable: isFirstPageDisabled }" @click="handlePageClick(1, isFirstPageDisabled)">&nbsp;</a>
      <a role="link" class="icon i-previous" v-bind:class="{ disable: isPreviousPageDisabled }" @click="handlePageClick(previousPage, isPreviousPageDisabled)">&nbsp;</a>
      Page <input name="page" min="1" v-bind:max="dataStore.getMaxPages" v-model="page" @blur="handlePageBlur" /> / {{ dataStore.getMaxPages }}
      <a role="link" class="icon i-next" v-bind:class="{ disable: isNextPageDisabled }" @click="handlePageClick(nextPage, isNextPageDisabled)">&nbsp;</a>
      <a role="link" class="icon i-last" v-bind:class="{ disable: isLastPageDisabled }" @click="handlePageClick(dataStore.getMaxPages, isLastPageDisabled)">&nbsp;</a>
    </div>
  </div>
</template>

<style scoped>
.table-footer {
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
}

.left {
  width: 50%;
}

.right {
  width: 50%;
  text-align: right;
}
.icon {
  height: 1.8rem;
  width: 1.8rem;
  display: inline-block;
  background-color: rgba(58, 134, 255, 0.9);
}

.i-first {
  mask: url("/last.svg") no-repeat 50% 50%;
  transform: rotate(180deg);
}

.i-previous {
  mask: url("/next.svg") no-repeat 50% 50%;
  mask-size: 63%;
  transform: rotate(180deg);
}

.i-next {
  mask: url("/next.svg") no-repeat 50% 50%;
  mask-size: 63%;
}

.i-last {
  mask: url("/last.svg") no-repeat 50% 50%;
}

a {
  margin: 0 0.25rem;
  text-decoration: none;
  cursor: pointer;
}

a.disable {
  text-decoration: none;
  cursor: default;
  background-color: rgba(58, 134, 255, 0.15);
}

input {
  width: 4rem;
  text-align: right;
}
</style>
