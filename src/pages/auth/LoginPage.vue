<template>
  <q-page class="column items-center justify-center bg-primary-dark">
    <q-card dark flat class="bg-transparent">
      <div class="text-center">
        <q-avatar size="100px">
          <q-img src="/png/melder-logo.png" />
        </q-avatar>
      </div>
      <q-card-section class="q-pt-md">
        <q-form @submit="login" class="q-gutter-y-md" style="max-width: 250px">
          <q-input
            dense
            rounded
            outlined
            v-model="credentials.email"
            bg-color="white"
            type="email"
            placeholder="Email"
          />
          <q-input
            dense
            rounded
            outlined
            v-model="credentials.password"
            :type="isPwd ? 'password' : 'text'"
            placeholder="Password"
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            @submit="login"
            :disable="!credentials.email || !credentials.password"
            type="submit"
            ripple
            rounded
            unelevated
            no-caps
            color="primary"
            label="Log in"
            padding="xs 100px"
          />
        </q-form>
      </q-card-section>

      <div class="text-center text-h6 text-bold">or</div>

      <q-card-actions align="center" class="q-pt-md">
        <q-btn
          @click="signinGoogle"
          round
          size="16px"
          color="red"
          icon="fab fa-google"
        />
      </q-card-actions>

      <q-card-section class="q-pb-xl">
        <div class="q-mt-lg">
          <span>Not registered?</span>
          <span
            @click="$router.push('/auth/signup')"
            class="q-ml-sm text-warning text-bold cursor-pointer"
            >Create an account.</span
          >
        </div>

        <div class="text-body2 text-center text-grey-3 q-mt-lg">
          Developed by Clint Clarido
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();
const isPwd = ref(true);
const credentials = reactive({
  email: "",
  password: "",
});
// Log in User
const login = async () => {
  const user = await authStore.loginUser(credentials);
};

const signinGoogle = async () => {
  authStore.singInWithProvider("google");
};
</script>
