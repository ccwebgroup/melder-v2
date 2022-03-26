<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-left"
    transition-hide="fade-right"
  >
    <q-card>
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-btn v-close-popup no-caps flat icon="arrow_back" />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6 text-bold">Group Settings</div>

        <q-list>
          <q-item @click="editingMode" v-close-popup clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="primary" name="ti-pencil-alt" />
            </q-item-section>
            <q-item-section class="text-subtitle1"
              >Group Profile</q-item-section
            >
          </q-item>
          <!-- <q-item
            :class="$q.dark.isActive ? 'text-warning' : 'text-negative'"
            @click="confirmDialog = true"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="ti-trash" />
            </q-item-section>
            <q-item-section class="text-subtitle1">Delete Group</q-item-section>
          </q-item> -->
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Edit Dialog -->
  <q-dialog
    v-model="editDialog"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-toolbar class="text-dark">
        <q-btn v-close-popup no-caps flat icon="arrow_back" />
      </q-toolbar>
      <!-- Avatar Section -->
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
          <q-icon
            v-show="!groupData.photoURL && !croppedImage"
            name="fas fa-camera"
          />
          <img
            class="group-avatar"
            v-show="groupData.photoURL && !croppedImage"
            :src="groupData.photoURL"
          />
          <img
            class="group-avatar"
            v-if="croppedImage"
            :src="croppedImage.toDataURL()"
          />
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

      <q-card-actions class="q-mt-md q-pa-lg">
        <q-space />
        <q-btn class="text-bold" v-close-popup no-caps flat label="Cancel" />
        <q-btn
          class="text-bold"
          v-close-popup
          @click="saveChanges"
          :disable="disableUpdateButton"
          flat
          rounded
          no-caps
          label="Save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
// Other Custom Composables
import { useImageUpload } from "src/composables/image-upload";
import AvatarCropper from "src/components/dialogs/AvatarCropper.vue";

// Import Stores
import { useGroupStore } from "src/stores/groups";
import { async } from "@firebase/util";
// Define Stores
const groupStore = useGroupStore();

const $q = useQuasar();
const props = defineProps({
  groupData: Object,
});

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

// Edit Group Profile
const group = reactive({
  id: "",
  name: "",
  description: "",
  photo: {
    src: "",
    type: "",
  },
  private: null,
});
const editDialog = ref(false);
const editingMode = () => {
  editDialog.value = true;
  group.id = props.groupData.id;
  group.name = props.groupData.name;
  group.description = props.groupData.description;
  group.private = props.groupData.private;
};

const disableUpdateButton = ref(true); //Disable update Button
watch(group, () => {
  disableUpdateButton.value = false; // Enable if there are changes
});
const saveChanges = () => {
  if (croppedImage.value) {
    const canvas = croppedImage.value;
    canvas.toBlob(async (blob) => {
      group.photo.src = await blob;
      await groupStore.updateGroupProfile(group);
    }, image.type);
  } else {
    groupStore.updateGroupProfile(group);
  }
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
