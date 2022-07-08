<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 450px">
      <q-card-section class="text-center text-h6">
        Confirm log in details.
      </q-card-section>

      <div v-if="data.provider">
        <q-card-actions align="center" class="q-pa-none">
          <q-btn
            @click="signinGoogle"
            round
            size="16px"
            color="red"
            icon="fab fa-google"
          />
        </q-card-actions>

        <div class="text-center text-h6">or</div>
      </div>
      <q-card-section>
        <q-form @submit="reauth" class="q-gutter-md">
          <q-input
            v-model="creds.email"
            type="email"
            placeholder="Email"
            dense
            outlined
            :rules="[(val) => !!val || 'Email is required!']"
          />
          <q-input
            v-model="creds.password"
            type="password"
            placeholder="Password"
            dense
            outlined
            :rules="[(val) => !!val || 'Password is required!']"
          />
          <q-card-actions align="right" class="q-gutter-sm">
            <q-btn
              dense
              flat
              no-caps
              label="Cancel"
              color="negative"
              @click="onDialogCancel"
            />
            <q-btn
              dense
              flat
              no-caps
              type="submit"
              label="Log in"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from "quasar";
import { reactive } from "vue";
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();

const props = defineProps({
  data: Object,
});

const creds = reactive({
  email: "",
  password: "",
});

const reauth = () => onDialogOK({ ...creds });

const signinGoogle = async () => {
  const res = await authStore.singInWithProvider("google", {
    password: props.data.password,
  });
  if (res) onDialogCancel();
};
</script>
