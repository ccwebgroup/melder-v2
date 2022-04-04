<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card>
      <q-toolbar class="fixed-top" :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-btn v-close-popup no-caps flat icon="arrow_back" />
        <div class="text-h6">Notifications</div>
      </q-toolbar>

      <div class="q-mt-xl">
        <div v-show="!notifs.length" class="text-center">
          <q-icon size="lg" color="secondary" name="fas fa-cloud-sun" />
          <div class="text-subtitle1 q-mt-sm text-grey">
            Everything is clear.
          </div>
        </div>
        <!-- Notifications List -->
        <q-card
          square
          v-touch-hold.mouse="manageHandler"
          class="q-mb-xs"
          flat
          v-for="notif in notifs"
          :key="notif.id"
          :class="!notif.viewed ? 'bg-grey-4' : ''"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar size="60px" v-if="notif.from.photoURL">
                <img :src="notif.from.photoURL" alt="Avatar" />
              </q-avatar>
              <q-avatar
                size="60px"
                v-else
                color="primary"
                text-color="white"
                class="text-bold"
                >{{ notif.from.displayName[0].toUpperCase() }}</q-avatar
              >
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">
                {{ notif.from.displayName }}
              </q-item-label>
              <q-item-label :class="notif.unread ? 'text-white' : ''">
                <span v-show="notif.type == 'group-invite'"
                  >you are invited to join in
                </span>
                <span v-show="notif.type == 'group-update'"
                  >posted a new update in
                </span>
                <span
                  @click="
                    $router.push({
                      path: '/group/' + notif.group.name.split(' ').join(''),
                      query: { id: notif.group.id },
                    })
                  "
                  class="text-primary"
                  >{{ notif.group.name }}</span
                >
              </q-item-label>

              <q-item-label caption>
                {{ relativeDate(notif.createdAt) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn
                @click="openMenuDialog(notif)"
                round
                flat
                icon="more_horiz"
              />
            </q-item-section>
          </q-item>

          <div v-if="notif.type == 'group-invite'" class="q-pa-sm text-center">
            <q-btn
              @click="accept(notif)"
              class="q-mr-sm"
              padding="xs lg"
              rounded
              unelevated
              dense
              outline
              no-caps
              icon="las la-user-plus"
              label="Accept"
            />
            <q-btn
              @click="decline(notif)"
              padding="xs lg"
              rounded
              unelevated
              dense
              outline
              no-caps
              label="Decline"
            />
          </div>
        </q-card>
      </div>
    </q-card>

    <q-dialog
      v-model="menuDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      full-width
      position="bottom"
    >
      <q-card class="border-top-rounded">
        <q-card-section>
          <div class="flex flex-center">
            <q-avatar size="45px" v-if="notifData.from.photoURL">
              <img :src="notifData.from.photoURL" alt="Avatar" />
            </q-avatar>
            <q-avatar
              size="60px"
              v-else
              color="primary"
              text-color="white"
              class="text-bold"
              >{{ notifData.from.displayName[0].toUpperCase() }}</q-avatar
            >
          </div>
          <div class="q-pa-sm">
            <span v-show="notifData.type == 'group-invite'"
              >You are invited to join in
            </span>
            <span v-show="notifData.type == 'group-update'"
              >Posted a new update in
            </span>
            <span
              @click="
                $router.push({
                  path: '/group/' + notifData.group.name.split(' ').join(''),
                  query: { id: notifData.group.id },
                })
              "
              class="text-primary"
              >{{ notifData.group.name }}</span
            >
          </div>
          <q-list>
            <q-item @click="removeNotif(notifData)" clickable v-close-popup>
              <q-item-section avatar>
                <q-icon size="md" name="delete" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1"
                  >Remove notification</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item @click="viewed(notifData)" clickable v-close-popup>
              <q-item-section avatar>
                <q-icon size="md" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1"
                  >Mark as viewed</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<style lang="sass" scoped>
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>

<script setup>
import { computed, reactive, ref } from "vue";
import { useNotifStore } from "src/stores/notifs";
import { useCodeStore } from "src/stores/invite-codes";
import { useGroupStore } from "src/stores/groups";

// Import Composables
import { useDateFns } from "src/composables/date-fns";

import { useDialogPluginComponent } from "quasar";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

// Define some stores
const groupStore = useGroupStore();

const { relativeDate } = useDateFns();
// Inivite
const codeStore = useCodeStore();
const accept = (notif) => codeStore.acceptInvite(notif),
  decline = (notif) => codeStore.declineInvite(notif);

// Notifications
const notifStore = useNotifStore();
const notifs = computed(() => notifStore.notifications);

// Manage Notif
const notifData = ref();
const menuDialog = ref(false);
const openMenuDialog = (notif) => {
  menuDialog.value = true;
  notifData.value = notif;
};
const removeNotif = (notif) => {
  if (notif.type == "group-invite") {
    groupStore.deleteInviteList({
      groupId: notif.groupId,
    });
  }
  notifStore.deleteNotif({ id: notif.id });
};
const viewed = (notif) => notifStore.markAsViewed({ id: notif.id });
</script>
