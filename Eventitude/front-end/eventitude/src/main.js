import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Import the plugin
import "vuetify/styles"; // Vuetify styles
import router from "./router";
import "@/assets/tailwind.css"; // Import the Tailwind CSS

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  console.error("Global error:", err);
  console.log("Vue instance:", vm);
  console.log("Error info:", info);
};

app.use(router).use(vuetify).mount("#app");
