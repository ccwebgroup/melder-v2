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
        <q-input v-model="search" rounded outlined dense>
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>
      </q-card-section>

      <!-- Search Result Section -->
      <q-card-section v-show="searchMode" class="q-py-sm">
        <q-list>
          <q-item v-for="user in searchResults" :key="user.id">
            <q-item-section avatar>
              <q-avatar size="50px" color="primary">
                <img
                  v-if="user.photoURL"
                  :src="user.photoURL"
                  alt="User Avatar"
                />
                <span v-else class="text-bold text-white">{{
                  user.displayName[0]
                }}</span>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{
                user.displayName
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                :disable="user.alreadyMember"
                @click="toggleInvite(user)"
                round
                flat
              >
                <q-icon
                  v-if="user.alreadyMember"
                  size="20px"
                  name="fas fa-check"
                  color="positive"
                />
                <q-icon
                  v-else
                  :name="
                    user.invited ? 'las la-user-minus' : 'las la-user-plus'
                  "
                  size="md"
                  :color="user.invited ? 'negative' : ''"
                />
                <!--
                <q-icon v-else name="las la-user-plus" /> -->
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Invite Codes Section -->
      <q-card
        class="fixed-bottom q-py-md border-top-rounded bg-primary text-white"
      >
        <q-card-section>
          <div class="text-body1 q-mb-sm">Get invite code</div>
          <q-field
            v-if="defaultCode"
            color="white"
            dark
            dense
            rounded
            outlined
            bottom-slots
          >
            <template v-slot:control>
              <div
                @click="copyCode(defaultCode)"
                class="self-center full-width no-outline text-right"
                tabindex="0"
              >
                {{ defaultCode.id }}
              </div>
            </template>
            <template v-slot:after>
              <q-btn round dense flat icon="settings">
                <q-menu transition-show="jump-down" transition-hide="jump-up">
                  <q-list style="min-width: 100px">
                    <q-item clickable @click="setNewCode(false)" v-close-popup>
                      <q-item-section>No Limit</q-item-section>
                    </q-item>
                    <q-item clickable @click="setNewCode(7)" v-close-popup>
                      <q-item-section>7 Days</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable @click="setNewCode(1)" v-close-popup>
                      <q-item-section>1 Day</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
            <template v-slot:hint>
              Expiration:
              <span v-show="!defaultCode.expiration">No Limit</span>
              <span v-show="defaultCode.expiration">{{
                defaultCode.expiration == 1 ? "1 Day" : "7 Days"
              }}</span>
            </template>
          </q-field>
        </q-card-section>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";
//Import Stores
import { useCodeStore } from "src/stores/invite-codes";
import { useSearchStore } from "src/stores/search";
import { useGroupStore } from "src/stores/groups";

import { useDialogPluginComponent, copyToClipboard, useQuasar } from "quasar";
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef } = useDialogPluginComponent();

const $q = useQuasar();
const route = useRoute();
const search = ref("");

/* Invite User Section
 **************
 **************
 */
const groupStore = useGroupStore();
const toggleInvite = (user) => {
  if (user.invited) {
    groupStore.cancelGroupInvite({
      userId: user.id,
      groupId: route.query.id,
    });
  } else {
    groupStore.sendGroupInvite({
      userId: user.id,
      groupId: route.query.id,
    });
  }
};
/* Invite User Section
 **************
 **************
 */

/* Search Section
 **************
 **************
 */
const searchStore = useSearchStore();
const searchMode = ref(false);
const searchResults = computed(() => searchStore.searchResults);
watch(search, (keyword, oldKeyword) => {
  if (keyword) {
    searchMode.value = false;
    searchStore.getUserOnSearch({
      keyword: keyword,
      groupId: route.query.id,
    });
    setTimeout(() => {
      searchMode.value = true;
    }, 1000);
  }
  if (!keyword) {
    searchStore.searchResults = null;
  }
});
/* Search Section
 **************
 **************
 */

/* Invite Codes Section
 **************
 **************
 */
const codeStore = useCodeStore();
const defaultCode = computed(() => codeStore.defaultCode);
// Copy invite code to clipboard
const copyCode = (code) => {
  copyToClipboard(code.id).then(() => {
    $q.notify({
      message: "Invite code copied",
      color: "positive",
      icon: "thumb_up",
    });
  });
};

const getCode = async (expiration) => {
  await codeStore.getDefaultCode({
    expiration: expiration,
    groupId: route.query.id,
  });
};

// Get invite codes
onBeforeMount(() => {
  getCode(false);
});

// Set Invite Code Expiration
const setNewCode = (expiration) => {
  if (expiration) {
    codeStore.addInviteCode({
      expiration: expiration,
      groupId: route.query.id,
    });
  } else {
    getCode(false);
  }
};
/*
Invite Codes Section
**************
**************
*/
</script>
