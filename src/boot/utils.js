import { boot } from "quasar/wrappers";
import Vue3Lottie from "vue3-lottie";
import { date, openURL } from "quasar";

window.qDate = date;
window.openURL = openURL;

export default boot(async ({ app }) => {
  app.use(Vue3Lottie);
});
