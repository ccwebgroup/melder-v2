<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card>
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-btn v-close-popup no-caps flat icon="arrow_back" />
      </q-toolbar>
      <div class="q-pa-sm">
        <div v-show="!notifs.length" class="text-center">
          <q-icon size="lg" color="secondary" name="fas fa-cloud-sun" />
          <div class="text-subtitle1 q-mt-sm text-grey">
            Everything is clear.
          </div>
        </div>

        <!-- Notifications List -->
        <q-card
          class="q-mb-md"
          flat
          v-for="notif in notifs"
          :key="notif.id"
          :class="!notif.viewed ? 'bg-grey-2' : ''"
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

              <q-item-label caption>
                {{ relativeDate(notif.createdAt) }}
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
            </q-item-section>

            <q-item-section side top :class="notif.viewed ? 'text-white' : ''">
              <q-icon name="las la-ellipsis-h" />
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
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useNotifStore } from "src/stores/notifs";
import { useCodeStore } from "src/stores/invite-codes";

// Import Composables
import { useDateFns } from "src/composables/date-fns";

import { useDialogPluginComponent } from "quasar";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

const { relativeDate } = useDateFns();
// Inivite
const codeStore = useCodeStore();
const accept = (notif) => codeStore.acceptInvite(notif),
  decline = (notif) => codeStore.declineInvite(notif);

// Notifications
const notifStore = useNotifStore();
const notifs = computed(() => notifStore.notifications);
</script>
