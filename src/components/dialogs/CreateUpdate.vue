<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-toolbar class="fixed-top" :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-btn v-close-popup no-caps flat icon="arrow_back" />
        <q-space />
        <q-btn
          @click="postUpdate"
          :disable="!update.group || !update.content"
          no-caps
          unelevated
          dense
          padding="xs xl"
          color="primary"
          rounded
          label="Post"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-mt-xl">
        <!-- Group Selections -->
        <q-select
          filled
          v-model="update.group"
          :options="groupsManage"
          clearable
          label="Select Group"
          options-selected-class="bg-primary text-white"
        >
          <template v-slot:selected-item="scope">
            <q-item v-if="scope.opt.name" dense>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="scope.opt.photoURL" alt="Group Avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2">{{
                  scope.opt.name
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="scope.opt.photoURL" alt="Group Avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2">{{
                  scope.opt.name
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Highlights -->
        <div class="text-caption q-my-sm">Highlights</div>
        <q-select
          v-model="update.highlights"
          outlined
          rou
          dense
          use-chips
          use-input
          multiple
          hide-dropdown-icon
          new-value-mode="add-unique"
          hint="Example: Event, Meetings, Urgent, Podcast etc."
        />

        <!-- Content -->
        <q-input
          class="q-mt-sm q-px-md"
          style="border-radius: 5px"
          v-model="update.content"
          :dark="update.textWhite"
          :class="update.bgColor"
          borderless
          autogrow
          placeholder="What's on your mind?"
          counter
          maxlength="180"
        />

        <q-img
          v-if="imagePreview"
          class="q-mt-sm"
          fit="scale-down"
          :src="imagePreview"
          style="border-radius: 8px; max-height: 250px"
        >
          <q-btn
            class="absolute all-pointer-events"
            @click="removeImage"
            fab-mini
            round
            icon="close"
            color="dark"
            style="top: 8px; left: 8px"
          />
        </q-img>
      </q-card-section>

      <q-card-section class="fixed-bottom q-gutter-y-md">
        <q-virtual-scroll
          :items="backgrounds"
          virtual-scroll-horizontal
          class="hide-scrollbar"
        >
          <template v-slot="{ item, index }">
            <q-card
              @click="setBgColor(item.color)"
              :class="item.color"
              :key="index"
              style="
                max-width: 50px;
                height: 40px;
                margin-right: 5px;
                border-radius: 8px;
              "
            >
              <q-card-section> </q-card-section>
            </q-card>
          </template>
        </q-virtual-scroll>

        <input
          @change="fileUploaded"
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
        />
        <q-separator />
        <q-btn
          @click="uploadImage"
          round
          outline
          size="sm"
          icon="las la-photo-video"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
// Import Stores
import { useGroupStore } from "src/stores/groups";
import { useUpdateStore } from "src/stores/updates";

import { useDialogPluginComponent, useQuasar } from "quasar";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

const $q = useQuasar();

const backgrounds = [
  { color: "bg-indigo" },
  { color: "bg-teal" },
  { color: "bg-red" },
  { color: "bg-blue" },
  { color: "bg-purple" },
  { color: "bg-brown" },
  { color: "bg-white" },
];

const updateStore = useUpdateStore();
const update = reactive({
  bgColor: "bg-white",
  textWhite: false,
  content: "",
  image: "",
  type: "regular",
  group: "",
  highlights: [],
});
const removeImage = () => {
  imagePreview = "";
  fileInput.value.value = "";
};
const setBgColor = (bgColor) => {
  update.bgColor = bgColor;
  if (bgColor == "bg-white") {
    update.textWhite = false;
  } else {
    update.textWhite = true;
  }
};
const imagePreview = ref("");
const fileInput = ref();
const uploadImage = () => {
  fileInput.value.click();
};
const fileUploaded = (e) => {
  let file = e.target.files[0];
  const allowedExtension = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];

  if (allowedExtension.indexOf(file.type) > -1) {
    imagePreview.value = URL.createObjectURL(file);
    update.image = file;
  } else {
    $q.dialog({
      title: "Error",
      message: "File is not a valid image.",
    });
  }
};

const postUpdate = () => updateStore.addGroupUpdate(update);

const groupStore = useGroupStore();
const groupsManage = computed(() => groupStore.groupsManage);
onBeforeMount(() => {
  groupStore.getGroupsManage();
});
</script>
