<template>
  <q-page class="flex flex-center">
    <div class="q-pa-lg text-center">
      <img
        class="logo"
        alt="Melder Logo"
        src="~assets/melder-logo.svg"
        style="width: 120px"
      />
      <q-form @submit="login" class="q-gutter-y-md q-mt-md">
        <q-input
          dense
          rounded
          outlined
          v-model="credentials.email"
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
          class="text-bold"
          @submit="login"
          type="submit"
          ripple
          rounded
          unelevated
          color="primary"
          label="LOG IN"
          style="width: 150px"
        />
      </q-form>

      <div class="q-mt-xl">
        <div class="text-body1">
          Not registered?
          <q-btn
            class="text-bold text-primary"
            to="/signup"
            no-caps
            padding="none"
            size="1rem"
            flat
            label="Sign Up"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

// Import Stores
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();

const router = useRouter();

const isPwd = ref(true);
const credentials = reactive({
  email: "",
  password: "",
});

// Log in User
const login = async () => {
  const user = await authStore.loginUser(credentials);
};
</script>
