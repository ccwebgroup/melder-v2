<template>
  <q-page class="bg-primary-dark">
    <!-- <img class="absolute fit" src="~assets/svg/bg-signup.svg" alt="" /> -->
    <div class="row">
      <div v-show="!$q.screen.lt.md" class="col column items-center">
        <div class="text-center q-mt-lg">
          <q-avatar size="120px">
            <q-img src="/png/melder-logo.png" />
          </q-avatar>
          <div class="text-h3 text-white">Melder</div>
        </div>
        <div style="width: 400px">
          <Vue3Lottie :animationData="groupGears" />
        </div>
      </div>
      <div class="col-12 col-md-4 q-pt-md">
        <div v-show="$q.screen.lt.md" class="text-center">
          <q-avatar size="120px">
            <q-img src="/png/melder-logo.png" />
          </q-avatar>
          <div class="text-white text-h4">Melder</div>
        </div>
        <q-card
          flat
          dark
          class="bg-transparent q-mx-auto"
          style="max-width: 380px"
        >
          <div class="text-h6 text-center q-px-sm q-mt-lg">
            Get started with your account.
          </div>
          <q-card-actions align="center" class="q-pt-md">
            <q-btn
              @click="signinGoogle"
              round
              size="16px"
              color="red"
              icon="fab fa-google"
            />
          </q-card-actions>
          <div class="text-center text-bold text-subtitle1">or</div>
          <q-card-section class="q-gutter-y-md">
            <q-input
              dark
              dense
              v-model="userDetails.email"
              type="email"
              placeholder="Email"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              dense
              dark
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
              dark
              dense
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

            <q-separator spaced dark />
            <q-input
              dark
              filled
              v-model="userDetails.displayName"
              label="What should we call you?"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="signUp"
              :disable="
                !userDetails.email ||
                !userDetails.password ||
                !userDetails.displayName ||
                !matched
              "
              no-caps
              ripple
              rounded
              unelevated
              color="primary"
              label="Sign up"
              padding="xs 90px"
            />
          </q-card-actions>

          <div class="q-py-xl text-center">
            <span>Already have an account?</span>
            <span
              class="q-ml-sm cursor-pointer text-bold text-warning"
              @click="$router.push('/auth/login')"
              >Log in</span
            >
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import groupGears from "src/lottie/group-gears.json";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();
const isPwd1 = ref(true),
  isPwd2 = ref(true),
  matched = ref(true);

const userDetails = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  displayName: "",
});

watch(userDetails, () => {
  if (userDetails.password === userDetails.confirmPassword) {
    matched.value = true;
  } else {
    matched.value = false;
  }
});

const signUp = () => {
  authStore.signUpUser(userDetails);
};

const signinGoogle = async () => {
  authStore.singInWithProvider("google");
};
</script>
