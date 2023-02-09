<script setup lang="ts">
import { useData } from "@/stores/DataStore";
import ResultTableHeader from "./ResultTableHeader.vue";
import ResultTableBody from "./ResultTableBody.vue";
import ResultTableFooter from "./ResultTableFooter.vue";

const dataStore = useData();
</script>

<template>
  <div class="table-container">
    <ResultTableHeader />
    <ResultTableBody />
    <ResultTableFooter />
  </div>
</template>

<style>
div.table-container {
  margin: 0 auto;
  width: 100rem;
  /* border-radius: 1rem; */
  overflow: hidden;
}

div.table-head > table,
div.table-body > table {
  width: 100%;
  clear: both;
  border-collapse: separate;
  border-spacing: 0;
}

.col-1 {
  width: 25%;
}

.col-2 {
  width: 30%;
}

.col-3 {
  width: 13.5%;
}
.col-4 {
  width: 8%;
}
.col-5 {
  width: 13.5%;
}
.col-6 {
  width: 10%;
}

thead > tr > th {
  padding: 1rem;
  background-color: rgba(58, 134, 255, 0.8);
  color: rgba(255, 255, 255, 1);
  /* border-bottom: 1px solid rgba(0, 0, 255, 0.3); */
  border-bottom: 1px solid rgba(58, 134, 255, 0.8);
}

thead > tr > th:not(:last-child),
tbody > tr > td:not(:last-child) {
  border-right: solid 1px rgba(255, 255, 255, 1);
}

tbody > tr > td {
  padding: 0.5rem 1rem;
}

th.sorting {
  position: relative;
  padding-right: 2.6rem;
  font-size: 1.4rem;
}

th.sorting > i.asc {
  bottom: 50%;
}

th.sorting > i.desc {
  top: 50%;
}

th.sorting > i {
  height: 1.4rem;
  width: 1rem;
  position: absolute;
  display: block;
  right: 1rem;
  cursor: pointer;
  z-index: 1;
}

th.sorting::before {
  content: "△";
  bottom: 50%;
}

th.sorting::after {
  content: "▽";
  top: 50%;
}

th.sorting::before,
th.sorting::after {
  position: absolute;
  display: block;
  right: 1rem;
  line-height: 1.4rem;
  font-size: 1.2rem;
  /* cursor: pointer; */
  color: rgba(255, 255, 255, 1);
}

th.asc,
th.desc {
  background-color: rgba(58, 134, 255, 0.9);
}

th.asc::before {
  content: "▲";
}

th.desc::after {
  content: "▼";
}

tr:nth-of-type(odd) {
  background-color: rgba(58, 134, 255, 0.1);
}

tr:nth-of-type(even) {
  background-color: rgba(58, 134, 255, 0.05);
}

tr:nth-of-type(odd) > td.asc,
tr:nth-of-type(odd) > td.desc {
  background-color: rgba(58, 134, 255, 0.25);
}

tr:nth-of-type(even) > td.asc,
tr:nth-of-type(even) > td.desc {
  background-color: rgba(58, 134, 255, 0.15);
}

tbody > tr:hover {
  /* background-color: rgba(0, 0, 0, 0.035); */
  background-color: rgba(58, 134, 255, 0.15);
}

tbody > tr:not(:first-child) > td {
  /* border-top: 1px solid rgba(0, 0, 0, 0.15); */
  border-top: 1px solid rgba(58, 134, 255, 0.6);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --select-border: rgba(58, 134, 255, 0.8);
  --select-focus: rgba(58, 134, 255, 1);
  --select-arrow: var(--select-border);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  z-index: 1;
  outline: none;
}
select::-ms-expand {
  display: none;
}

.select {
  display: inline-grid;
  grid-template-areas: "select";
  align-items: center;
  position: relative;
  width: fit-content;
  min-width: 6ch;
  max-width: 30ch;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
}
.select select,
.select::after {
  grid-area: select;
}
.select::after {
  content: "";
  justify-self: end;
  width: 0.8em;
  height: 0.5em;
  background-color: var(--select-arrow);
  -webkit-clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

select:focus + .focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 2px solid var(--select-focus);
  border-radius: inherit;
}

input {
  padding: 0.2em 0.5em !important;
  border: 1px solid rgba(58, 134, 255, 0.8);
  border-radius: 0.25em;
}

input:focus {
  outline: 2px solid rgba(58, 134, 255, 1);
}
</style>
