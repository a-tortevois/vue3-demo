<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  (event: "submit", payload: any): void;
}>();

const positions = ref<string[]>([]);
const position = ref("");
const offices = ref<string[]>([]);
const office = ref("");
const age_selector = ref("");
const age_value = ref("");
const date_from = ref("");
const date_to = ref("");
const salary_selector = ref("");
const salary_value = ref("");

onMounted(async () => {
  const res = await window.fetch("http://127.0.0.1:3000/api/v1/employeesFilterProps");
  if (res.status === 200) {
    const employeesFilterProps = await res.json();
    console.log(employeesFilterProps);
    positions.value.push(...employeesFilterProps.jobTitles);
    offices.value.push(...employeesFilterProps.offices);
  } else {
    // error
  }
});

const getFilter = () => {
  /*
    key
    value
    from
    to
  */

  return {
    position: position.value,
    office: office.value,
    age_selector: age_selector.value,
    age_value: age_value.value,
    date_from: date_from.value,
    date_to: date_to.value,
    salary_selector: salary_selector.value,
    salary_value: salary_value.value,
  };
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  console.log("FilterForm.handleSubmit");

  const filter = getFilter();
  console.log("filter", filter);

  try {
    emit("submit", filter);
  } catch (e) {}
};

const handleReset = async (event: Event) => {
  event.preventDefault();
  console.log("FilterForm.handleReset");
  position.value = "";
  office.value = "";
  age_selector.value = "";
  age_value.value = "";
  date_from.value = "";
  date_to.value = "";
  salary_selector.value = "";
  salary_value.value = "";

  const filter = getFilter();
  console.log("filter", filter);

  try {
    emit("submit", filter);
  } catch (e) {}
};
</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <fieldset>
      <legend>Crières d'affichage</legend>
      <div>
        <label>Fonction :</label>
        <select name="position" v-model="position">
          <option value="">Toutes</option>
          <option v-for="position in positions" value="{{ position }}">{{ position }}</option>
        </select>
      </div>
      <div>
        <label>Bureau :</label>
        <select name="office" v-model="office">
          <option value="">Tous</option>
          <option v-for="office in offices">{{ office }}</option>
        </select>
      </div>
      <div>
        <label>Age:</label>
        <select name="age_selector" v-model="age_selector">
          <option value="">Tous</option>
          <option>&lt;</option>
          <option>&equals;</option>
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
          <option>&equals;</option>
          <option>&gt;</option></select
        ><input type="text" name="salary_value" v-model="salary_value" />
      </div>
      <input type="reset" value="Reset" />
      <input type="submit" value="Submit" />
    </fieldset>
  </form>
</template>

<style scoped></style>
