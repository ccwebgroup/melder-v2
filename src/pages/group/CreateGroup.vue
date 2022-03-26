<template>
  <q-page>
    <q-card flat>
      <q-card-section class="flex flex-center">
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="uploadFile"
          accept="image/*"
        />
        <q-avatar
          @click="$refs.fileInput.click()"
          size="100px"
          font-size="52px"
          color="grey-4"
        >
          <q-btn v-if="!croppedImage" flat round icon="fas fa-camera" />
          <img v-else :src="croppedImage.toDataURL()" />
        </q-avatar>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input dense v-model="group.name" rounded outlined label="Name" />
        <q-input
          type="textarea"
          dense
          v-model="group.description"
          rows="4"
          outlined
          label="Description (optional)"
        />
        <q-toggle label="Private" v-model="group.private" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="createGroup"
          :disable="!group.name"
          unelevated
          class="q-mb-sm"
          dense
          padding="sm"
          style="width: 150px"
          color="primary"
          rounded
          no-caps
          label="Create"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
// Import Composables
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useImageUpload } from "src/composables/image-upload";
// Import Other Components
import AvatarCropper from "src/components/dialogs/AvatarCropper.vue";
// Import Stores
import { useGroupStore } from "src/stores/groups";
// Define Stores
const groupStore = useGroupStore();

const $q = useQuasar();
const router = useRouter();

const group = reactive({
  name: "",
  description: "",
  photo: {
    src: "",
    type: "",
  },
  private: false,
});

// Create Group
const createGroup = () => {
  const canvas = croppedImage.value;
  canvas.toBlob(async (blob) => {
    group.photo.src = blob;
    const data = await groupStore.addGroup(group);
    router.push({
      path: "/group/" + data.name.split(" ").join(""),
      query: { id: data.id },
    });
  }, image.type);
};

/*
  Upload and Cropped Image
  ********************
  ********************
*/
const { getMimeType } = useImageUpload();
const fileInput = ref();
const image = reactive({
  src: "",
  type: "",
});
const croppedImage = ref();
watch(image, () => {
  openCropper();
});
const openCropper = () => {
  $q.dialog({
    component: AvatarCropper,
    componentProps: {
      imageFile: image,
    },
  }).onOk((result) => {
    croppedImage.value = result;
    group.photo.type = image.type;
  });
  fileInput.value = "";
};
const uploadFile = (event) => {
  const { files } = event.target;
  const allowedExtension = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];
  if (files && files[0]) {
    if (allowedExtension.indexOf(files[0].type) > -1) {
      // Revoke the object URL
      const blob = URL.createObjectURL(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = blob;
        image.type = getMimeType(e.target.result, files[0].type);
      };
      reader.readAsArrayBuffer(files[0]);
    } else {
      $q.dialog({
        title: "We're sorry",
        message: "The file type is not allowed.",
      });
    }
  }
};
/*
  Upload and Cropped Image
  ********************
  ********************
*/
</script>
