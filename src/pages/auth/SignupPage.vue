<template>
  <q-page padding>
    <div class="q-mx-auto q-pa-lg text-center">
      <div class="q-my-md">
        <q-btn color="red" outline round icon="fab fa-google" />
      </div>
      <div class="text-subtitle2 q-mb-sm">or</div>
      <div class="text-h6">Sign up with email</div>
      <div class="q-gutter-y-md q-mt-lg">
        <q-input v-model="userDetails.email" filled type="email">
          <template v-slot:before>
            <q-icon name="mail" />
          </template>
        </q-input>
        <div class="q-gutter-y-md q-mt-lg">
          <q-input
            v-model="userDetails.password"
            :type="isPwd1 ? 'password' : 'text'"
            rounded
            outlined
            placeholder="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd1 ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd1 = !isPwd1"
              />
            </template>
          </q-input>

          <q-input
            v-model="userDetails.confirmPassword"
            :type="isPwd2 ? 'password' : 'text'"
            error-message="Password does not match."
            :error="!matched"
            rounded
            outlined
            placeholder="Confirm Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd2 ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd2 = !isPwd2"
              />
            </template>
          </q-input>
        </div>
        <q-separator class="q-mt-lg" />
        <q-input
          v-model="userDetails.displayName"
          filled
          label="What should we call you?"
        />
        <q-btn
          @click="signUp"
          :disable="
            !userDetails.email ||
            !userDetails.password ||
            !userDetails.displayName ||
            !matched
          "
          ripple
          rounded
          unelevated
          color="primary"
          label="SIGN UP"
          style="width: 150px"
        />
      </div>

      <div class="q-mt-xl">
        <div class="text-body1">
          Already have an account?
          <q-btn
            padding="none"
            no-caps
            to="/login"
            class="text-bold text-subtitle2"
            ripple
            flat
            color="primary"
            label="Log in"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const userDetails = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  displayName: "",
});

// Checking if password matched
const matched = ref(true),
  isPwd1 = ref(true),
  isPwd2 = ref(true);
watch(userDetails, () => {
  if (userDetails.password === userDetails.confirmPassword) {
    matched.value = true;
  } else {
    matched.value = false;
  }
});

const signUp = async () => {
  const user = await authStore.signUpUser(userDetails);
};
</script>
