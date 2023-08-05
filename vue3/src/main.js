import { createApp } from "vue";
import "./assets/reset.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import "vxe-table/lib/style.css";
import ElementPlus from "element-plus";
import VXETable from "vxe-table";
import piniaPersist from "pinia-plugin-persist";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const pinia = createPinia();

pinia.use(piniaPersist);
const app = createApp(App);
app.use(ElementPlus);
app.use(VXETable);
app.use(pinia);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
