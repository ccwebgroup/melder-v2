<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-avatar size="30px" class="q-mr-lg">
          <img src="~assets/melder-logo.svg" />
        </q-avatar>
        <q-space />
        <div class="q-gutter-x-sm q-my-md">
          <q-btn
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
            padding="none"
            @click="menuDialog = true"
            dense
            flat
            round
            size="lg"
            icon="las la-user-circle"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Melder Logo</q-item-label>

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />-->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <q-footer :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'">
      <q-tabs
        indicator-color="transparent"
        :active-color="$q.dark.isActive ? 'secondary' : 'primary'"
      >
        <q-route-tab
          to="/updates"
          no-caps
          name="update"
          icon="ti-announcement"
          label="Updates"
        />
        <q-route-tab
          to="/groups"
          no-caps
          name="groups"
          icon="ti-id-badge"
          label="Groups"
        />
        <q-route-tab
          to="/files"
          no-caps
          name="files"
          icon="ti-folder"
          label="Files"
        />
        <q-route-tab
          to="/home"
          no-caps
          name="home"
          icon="ti-home"
          label="Home"
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
import UserNotifs from "src/components/dialogs/UserNotifs.vue";

// Import Stores
import { useAuthStore } from "src/stores/auth";
import { useNotifStore } from "src/stores/notifs";
import { useCodeStore } from "src/stores/invite-codes";

const leftDrawerOpen = ref(false),
  menuDialog = ref(false),
  $q = useQuasar();

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
