<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="scale"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section>
        <vue-cropper
          :src="blob"
          :stencil-props="{
            handlers: {},
            movable: false,
            scalable: false,
          }"
          :stencil-size="{
            width: 280,
            height: 280,
          }"
          image-restriction="stencil"
          stencil-component="circle-stencil"
          ref="cropper"
        >
        </vue-cropper>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          no-caps
          label="Cancel"
          color="negative"
          @click="onCancelClick"
        />
        <q-btn
          flat
          no-caps
          color="primary"
          label="Crop"
          @click="saveCropImage"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const onCancelClick = () => onDialogCancel();

defineProps({
  blob: String,
});

const cropper = ref();
const saveCropImage = () => {
  const { canvas } = cropper.value.getResult();
  if (canvas) {
    onDialogOK(canvas);
  }
};
</script>
