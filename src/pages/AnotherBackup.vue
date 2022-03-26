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
          <q-icon v-if="!groupProfile.photoURL" name="fas fa-camera" />
          <img class="group_avatar" v-else :src="groupProfile.photoURL" />
        </q-avatar>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mx-md">
          <input
            @change="fileUploaded"
            type="file"
            id="fileInput"
            style="display: none"
          />
          <q-avatar @click="uploadFile" size="100px">
            <q-icon v-if="!groupProfile.photoURL" name="fas fa-camera" />
            <img class="group_avatar" v-else :src="groupProfile.photoURL" />
          </q-avatar>
          <div>
            <q-btn @click="uploadFile" flat no-caps label="Upload" />
          </div>

          <div class="q-gutter-y-lg">
            <q-input v-model="group.name" />
            <q-input
              v-model="group.description"
              placeholder="Description (optional)"
              filled
              type="textarea"
            />
          </div>
        </div>
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
import { useDialogPluginComponent, useQuad, useQuasar } from "quasar";
// Other Custom Composables
import { useImageUpload } from "src/composables/image-upload";

// Import Stores
import { useGroupStore } from "src/stores/groups";
// Define Stores
const groupStore = useGroupStore();

const $q = useQuasar();
const props = defineProps({
  groupProfile: Object,
});

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

// Edit Group Profile
const group = reactive({
  id: "",
  name: "",
  description: "",
  photoURL: "",
  private: null,
});
const editDialog = ref(false);
const editingMode = () => {
  editDialog.value = true;
  group.id = props.groupProfile.id;
  group.name = props.groupProfile.name;
  group.description = props.groupProfile.description;
  group.private = props.groupProfile.private;
};
const disableUpdateButton = ref(true); //Disable update Button
watch(group, () => {
  disableUpdateButton.value = false; // Enable if there are changes
});
const saveChanges = async () => {
  await groupStore.updateGroupProfile(group);
  group.photoURL = "";
};

/*
  Upload and Cropped Image
  ********************
  ********************
*/
const { getMimeType } = useImageUpload();

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
