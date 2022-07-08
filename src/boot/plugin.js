import { boot } from "quasar/wrappers";

import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default boot(({ app }) => {
  app.component("vue-cropper", Cropper);
  app.component("circle-stencil", CircleStencil);
});
