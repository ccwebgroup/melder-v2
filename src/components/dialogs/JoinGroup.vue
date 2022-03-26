<template>
  <q-dialog
    ref="dialogRef"
    full-width
    transition-show="slide-up"
    transition-hide="slide-down"
    position="bottom"
  >
    <q-card class="border-top-rounded">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Join a group</div>
        <q-input
          ref="codeInput"
          v-model="inviteCode"
          dense
          rounded
          outlined
          placeholder="Enter invite code"
          error-message="Invite code is invalid"
          :error="isInvalid"
        />
      </q-card-section>
      <q-card-actions class="q-mb-lg" align="center">
        <q-btn
          class="text-bold"
          no-caps
          padding="xs xl"
          v-close-popup
          flat
          dense
          rounded
          label="Cancel"
        />
        <q-btn
          :disable="!inviteCode"
          @click="joinGroup"
          class="text-bold"
          no-caps
          padding="xs xl"
          unelevated
          color="primary"
          dense
          rounded
          label="Submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useCodeStore } from "src/stores/invite-codes";

import { useDialogPluginComponent } from "quasar";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

const codeInput = ref();
const inviteCode = ref("");
const isInvalid = ref(false);
const codeStore = useCodeStore();
const joinGroup = async () => {
  const result = await codeStore.joinGroupViaCode(inviteCode.value);
  if (result == "invalid") {
    isInvalid.value = true;
  }
};
</script>
