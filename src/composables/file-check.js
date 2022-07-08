import { Dialog } from "quasar";

export function fileCheck() {
  function isImage(file) {
    const allowedExtension = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];
    if (allowedExtension.indexOf(file.type) > -1) {
      return true;
    } else {
      return true;
    }
  }

  return { isImage };
}
