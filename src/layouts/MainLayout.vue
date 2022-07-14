<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar
            v-if="$q.screen.lt.md && $route.name == 'Blogs'"
            size="34px"
            color="white"
          >
            <q-img width="32px" src="/png/melder-logo.png" />
          </q-avatar>
          <q-btn
            v-if="$q.screen.lt.md && $route.name !== 'Blogs'"
            flat
            icon="arrow_back"
            @click="$router.go(-1)"
          />
          <span class="q-ml-sm"> {{ $route.name }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!$q.screen.lt.md"
      :breakpoint="400"
      :width="260"
      show-if-above
      side="left"
      bordered
      class="q-px-sm"
    >
      <q-list style="margin-top: 100px">
        <EssentialLink v-bind="link" v-for="link in links" :key="link.path" />
      </q-list>

      <q-separator spaced inset />

      <div v-if="!authUser" class="text-center q-mt-lg q-gutter-sm">
        <q-btn
          to="/auth/login"
          padding="xs 70px"
          no-caps
          rounded
          outline
          label="Sign in"
        />
        <div>or</div>
        <q-btn
          to="/auth/signup"
          color="primary"
          flat
          no-caps
          rounded
          label="Create an account"
        />
      </div>

      <q-list dense v-if="authUser">
        <!-- User Profile link -->
        <q-item
          :class="$q.screen.lt.md ? 'round-border' : 'rounded-border'"
          to="/profile"
          class="q-mt-lg"
        >
          <q-item-section avatar>
            <q-avatar size="40px" :color="!authUser.photoURL ? 'grey-5' : ''">
              <q-img
                loading="eager"
                spinner-size="20px"
                v-if="authUser.photoURL"
                :src="authUser.photoURL"
                alt=""
              />
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
        <div class="q-ml-lg q-py-md">
          <q-item dense clickable to="/manage/blogs">
            <q-item-section avatar>
              <q-icon size="xs" name="tag" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Your blogs</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>

      <!-- Melder Logo -->
      <div class="absolute-top text-center q-pt-md">
        <q-avatar size="70px">
          <q-img src="/png/melder-logo.png" />
        </q-avatar>
      </div>

      <!-- Log out Button -->
      <q-item v-if="authUser" class="absolute-bottom" style="bottom: 20px">
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
            padding="xs 70px"
            color="negative"
            no-caps
            rounded
            outline
            label="Log out"
          />
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-drawer
      v-if="!$q.screen.lt.md"
      show-if-above
      side="right"
      bordered
      :breakpoint="400"
      :width="240"
    >
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      v-if="$q.screen.lt.md"
      class="bg-white shadow-2 text-dark q-py-none"
    >
      <q-toolbar class="justify-between">
        <q-btn
          dense
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          round
          size="20px"
          flat
          :icon="link.icon"
        />
        <q-btn
          dense
          @click="userMenu = true"
          round
          size="20px"
          flat
          :icon="authUser ? 'las la-user-circle' : 'las la-sign-in-alt'"
        />
      </q-toolbar>
    </q-footer>

    <q-dialog v-model="userMenu" position="bottom" class="rounded-top">
      <q-card class="rounded-top q-pb-sm">
        <q-card-section>
          <q-list v-if="authUser">
            <!-- User Profile link -->
            <q-item to="/profile" class="q-my-sm">
              <q-item-section avatar>
                <q-avatar
                  size="40px"
                  :color="!authUser.photoURL ? 'grey-5' : ''"
                >
                  <q-img
                    loading="eager"
                    spinner-size="20px"
                    v-if="authUser.photoURL"
                    :src="authUser.photoURL"
                    alt=""
                  />
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
            <q-item clickable to="/manage/blogs">
              <q-item-section avatar>
                <q-icon size="xs" name="tag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Your blogs</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              dense
              clickable
              @click="logOut"
              class="text-negative"
              v-close-popup
            >
              <q-item-section avatar>
                <q-icon size="xs" name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sign Out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list v-else class="q-gutter-y-sm text-center" separator>
            <q-item clickable to="/auth/login" class="text-h6">
              <q-item-section>
                <q-item-label>Log in</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/auth/signup" class="text-h6">
              <q-item-section>
                <q-item-label class="text-primary"
                  >Create an account</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import EssentialLink from "src/components/EssentialLink.vue";
import { useAuthStore } from "src/stores/auth";
import { useUserStore } from "src/stores/users";

const authStore = useAuthStore();
const userStore = useUserStore();
const links = [
  // { path: "/home", name: "Home", icon: "las la-home" },
  { path: "/blogs", name: "Blogs", icon: "las la-blog" },
  { path: "/discussions", name: "Discussions", icon: "las la-comments" },
  { path: "/questions", name: "Ask!", icon: "las la-question-circle" },
  { path: "/tutorials", name: "Tutorials", icon: "las la-feather" },
  // { path: "/groups", name: "Groups", icon: "las la-users" },
];
const userMenu = ref(false);
const authUser = computed(() => authStore.authUser);

const logOut = () => {
  authStore.logoutUser();
};
</script>
