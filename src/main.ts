import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast, { type PluginOptions } from "vue-toastification";
import { vMaska } from "maska";
import App from "./App.vue";
import router from "./app/router";
import vuetify from "./app/plugins/vuetify";
import { startMockWorker } from "./app/msw";
import "vue-toastification/dist/index.css";
import "./style.css";

async function bootstrap() {
  if (import.meta.env.DEV) {
    await startMockWorker();
  }

  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(vuetify);
  app.directive("maska", vMaska);
  app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  } as PluginOptions);

  app.mount("#app");
}

void bootstrap();
