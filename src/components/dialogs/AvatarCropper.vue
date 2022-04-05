<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    full-width
    transition-show="scale"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-lg">Crop Image</div>
        <vue-cropper
          :src="props.imageFile.src"
          :stencil-props="{
            handlers: {},
            movable: false,
            scalable: false,
          }"
          :stencil-size="{
            width: 280,
            height: 280,
          }"
          style="max-height: 400px"
          image-restriction="stencil"
          stencil-component="circle-stencil"
          ref="cropper"
          class="cropper"
        ></vue-cropper>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          class="text-bold"
          flat
          no-caps
          label="Cancel"
          @click="onCancelClick"
        />
        <q-btn
          class="text-bold"
          flat
          no-caps
          label="Crop"
          @click="saveCropImage"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useDialogPluginComponent } from "quasar";

const $q = useQuasar();
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogCancel, onDialogHide, onDialogOK } =
  useDialogPluginComponent();

const props = defineProps({
  imageFile: Object,
});

const cropper = ref();
const onCancelClick = () => onDialogCancel();

const saveCropImage = () => {
  const { canvas } = cropper.value.getResult();
  if (canvas) {
    onDialogOK(canvas);
  }
};
</script>
