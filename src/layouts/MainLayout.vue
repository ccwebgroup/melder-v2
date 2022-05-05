<template>
  <q-layout view="lHr LpR lFr">
    <q-header reveal :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-toolbar-title>
          <q-avatar
            v-if="$q.platform.is.mobile"
            v-show="$route.name == 'Home'"
            size="40px"
            class="q-mr-lg"
          >
            <img src="~assets/melder-logo.svg" />
          </q-avatar>
          <span v-show="$route.name != 'Home'"> {{ $route.name }}</span>
        </q-toolbar-title>
        <q-btn
          v-if="$q.platform.is.mobile"
          @click="notifDialog"
          padding="none"
          size="lg"
          dense
          flat
          round
          icon="las la-bell"
        >
          <q-badge
            v-if="notifs.length"
            floating
            color="red"
            rounded
            :label="notifs.length"
          />
        </q-btn>
        <q-btn
          v-if="$q.platform.is.mobile"
          padding="none"
          @click="menuDialog = true"
          dense
          flat
          round
          size="lg"
          icon="las la-user-circle"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="q-pl-xl">
        <q-item class="q-mx-md">
          <q-item-label header>
            <q-avatar size="40px" class="q-mr-lg">
              <img src="~assets/melder-logo.svg" />
            </q-avatar>
          </q-item-label>
        </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.path"
          v-bind="link"
        />

        <q-item
          class="q-mt-xl q-mx-md curve-borders"
          clickable
          to="/user/profile"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="authUser.photoURL" alt="" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1">{{
              authUser.displayName
            }}</q-item-label>
            <q-item-label
              caption
              :class="$q.dark.isActive ? 'text-secondary' : 'text-primary'"
              >Manage Your Profile</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn
        class="q-mx-xl absolute-bottom"
        style="bottom: 60px"
        padding="xs 60px"
        @click="logOut"
        outline
        rounded
        no-caps
        color="primary"
        label="Sign Out"
      />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <q-footer
      v-if="$q.platform.is.mobile"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'"
    >
      <q-tabs
        indicator-color="transparent"
        :active-color="$q.dark.isActive ? 'secondary' : 'primary'"
      >
        <q-route-tab
          v-for="link in essentialLinks"
          :key="link.path"
          :to="link.path"
          no-caps
          name="update"
          icon="ti-announcement"
          label="Updates"
        />
      </q-tabs>
    </q-footer>

    <!-- User Menu Dialog -->
    <q-dialog
      full-width
      v-model="menuDialog"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="border-top-rounded">
        <q-card-section>
          <q-item to="/user/profile">
            <q-item-section avatar>
              <q-avatar v-if="authUser.photoURL">
                <img :src="authUser.photoURL + Date.now()" alt="Avatar" />
              </q-avatar>
              <q-avatar
                v-else
                color="teal"
                text-color="white"
                class="text-bold"
                >{{ authUser.displayName.charAt(0).toUpperCase() }}</q-avatar
              >
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-bold">{{
                authUser.displayName
              }}</q-item-label>
              <q-item-label
                caption
                :class="$q.dark.isActive ? 'text-secondary' : 'text-primary'"
                >Manage Your Profile</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="text-center">
          <q-separator />
          <q-btn
            padding="md"
            @click="
              settingsDialog = true;
              dialog = false;
            "
            flat
            no-caps
            label="Settings"
          />
          <q-separator />
          <q-btn
            padding="md"
            @click="logOut"
            flat
            no-caps
            color="negative"
            label="Sign Out"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";

// Import components
import EssentialLink from "src/components/EssentialLink.vue";
import UserNotifs from "src/components/dialogs/UserNotifs.vue";

// Import Stores
import { useAuthStore } from "src/stores/auth";
import { useNotifStore } from "src/stores/notifs";
import { useCodeStore } from "src/stores/invite-codes";

const leftDrawerOpen = ref(false),
  rightDrawerOpen = ref(false),
  menuDialog = ref(false),
  $q = useQuasar();

const essentialLinks = [
  { path: "/home", title: "Home", icon: "las la-home" },
  { path: "/updates", title: "Updates", icon: "las la-bullhorn" },
  { path: "/groups", title: "Groups", icon: "las la-users" },
];

/* Notifications Section
 ************************
 ************************
 */
const notifStore = useNotifStore();
const notifs = computed(() => notifStore.notifications);
onBeforeMount(() => {
  notifStore.getNotifications();
});

const notifDialog = () => {
  $q.dialog({
    component: UserNotifs,
  });
};
/* Notifications Section
 ************************
 ************************
 */

/* Authentication Section
 ************************
 ************************
 */
const authStore = useAuthStore();
const authUser = computed(() => authStore.getAuthProfile);
const logOut = async () => {
  const status = await authStore.logoutUser();
};
</script>
