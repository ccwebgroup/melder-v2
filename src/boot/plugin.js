import { boot } from "quasar/wrappers";

import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

export default boot(({ app }) => {
  app.component("vue-cropper", Cropper);
  app.component("circle-stencil", CircleStencil);
  app.component("QuillEditor", QuillEditor);
});
