import { ref } from "vue";

export const useImageUpload = () => {
  function getMimeType(file, fallback = null) {
    const byteArray = new Uint8Array(file).subarray(0, 4);
    let header = "";
    for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
    }
    switch (header) {
      case "89504e47":
        return "image/png";
      case "47494638":
        return "image/gif";
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
      case "ffd8ffe3":
      case "ffd8ffe8":
        return "image/jpeg";
      default:
        return fallback;
    }
  }

  function convertToBase64(file) {
    const allowedExtension = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];

    if (allowedExtension.indexOf(file.type) > -1) {
      const reader = new FileReaderSync();
      reader.onload = (file) => {
        let image = file.target.result;
        return image;
      };
      reader.readAsDataURL(file);
    }
  }

  return { convertToBase64, getMimeType };
};
