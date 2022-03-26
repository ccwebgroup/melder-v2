<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Verify yourself</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-gutter-y-sm">
        <q-input
          dense
          outlined
          rounded
          type="email"
          v-model="credentials.email"
          autofocus
          label="Email"
        />
        <q-input
          dense
          outlined
          rounded
          type="password"
          v-model="credentials.password"
          label="Password"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn no-caps flat label="Cancel" @click="onDialogCancel" />
        <q-btn no-caps @click="confirm" flat label="Confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from "quasar";
import { reactive } from "vue";
import { useAuthStore } from "src/stores/auth";

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const props = defineProps({
  user: Object,
});
const authStore = useAuthStore();

const credentials = reactive({
  email: "",
  password: "",
});

const confirm = () => {
  console.log("confimred");
  // authStore.reAuthenticateUser({
  //   credential: credentials,
  //   newDetails: props.user,
  // });

  onDialogOK();
};
</script>
