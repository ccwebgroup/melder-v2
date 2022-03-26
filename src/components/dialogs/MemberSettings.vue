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

      <q-card-section class="q-py-none">
        <q-list>
          <q-item clickable @click="leaveGroup">
            <q-item-section avatar>
              <q-icon color="negative" name="fas fa-person-through-window" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-negative text-subtitle1"
                >Leave group</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useGroupStore } from "src/stores/groups";

import { useDialogPluginComponent, useQuasar } from "quasar";
import { useRoute } from "vue-router";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

const $q = useQuasar();
const route = useRoute();

const groupStore = useGroupStore();

const leaveGroup = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to leave the group?",
    cancel: true,
  }).onOk(() => {
    groupStore.removeMember({
      userId: false,
      groupId: route.query.id,
    });
  });
};
</script>
