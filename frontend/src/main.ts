import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import { useData } from "./stores/DataStore";

const app = createApp(App);
app.use(createPinia());

const dataStore = useData();

Promise.all([dataStore.fetchDataFilter(), dataStore.fetchData()]).then(() => {
  app.use(router);
  app.mount("#app");
});
