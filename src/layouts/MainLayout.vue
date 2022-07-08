<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" /> -->
          </q-avatar>
          {{ $route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!$q.screen.lt.md"
      :breakpoint="400"
      show-if-above
      side="left"
      bordered
    >
      <q-list class="q-px-lg" style="margin-top: 100px">
        <EssentialLink v-bind="link" v-for="link in links" :key="link.path" />
        <q-separator spaced />
        <!-- User Profile link -->
        <q-item
          :class="$q.screen.lt.md ? 'round-border' : 'rounded-border'"
          to="/profile"
          class="q-mt-lg"
        >
          <q-item-section avatar>
            <q-avatar size="40px" :color="!authUser.photoURL ? 'grey-5' : ''">
              <img v-if="authUser.photoURL" :src="authUser.photoURL" alt="" />
              <q-icon v-else color="white" size="22px" name="fas fa-user" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1">{{
              authUser.displayName
            }}</q-item-label>
            <q-item-label
              @click="$router.push('/profile')"
              caption
              class="cursor-pointer text-primary"
              >Manage your profile</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Melder Logo -->
      <div class="absolute-top text-center q-pt-md">
        <q-avatar size="70px">
          <q-img src="png/melder-logo.png" />
        </q-avatar>
      </div>

      <!-- Log out Button -->
      <q-item class="absolute-bottom" style="bottom: 20px">
        <q-item-section v-show="$q.screen.lt.md" avatar>
          <q-btn
            round
            size="md"
            color="negative"
            icon="las la-sign-out-alt"
            @click="logOut"
          />
        </q-item-section>
        <q-item-section>
          <q-btn
            @click="logOut"
            padding="sm 70px"
            color="negative"
            no-caps
            rounded
            outline
            label="Log out"
          />
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-drawer show-if-above side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import EssentialLink from "src/components/EssentialLink.vue";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();

const links = [
  { path: "/home", name: "Home", icon: "las la-home" },
  { path: "/groups", name: "Groups", icon: "las la-users" },
];

const authUser = computed(() => authStore.authUser);

const logOut = () => {
  authStore.logoutUser();
};
</script>
