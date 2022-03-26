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
          <q-btn-group outline>
            <q-btn
              no-caps
              @click="copyCode(defaultInviteCode)"
              outline
              padding="md lg"
              :label="defaultInviteCode.id"
            />

            <q-btn-dropdown auto-close outline icon="settings">
              <q-list>
                <q-item-label header class="text-subtitle1"
                  >Expiration</q-item-label
                >
                <q-item @click="setExpiration(false)" clickable>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-icon name="las la-times-circle" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">No Limit</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item @click="setExpiration(7)" clickable>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-icon name="las la-stopwatch" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">7 Days</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item @click="setExpiration(1)" clickable>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-icon name="las la-stopwatch" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">1 Day</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-btn-group>
          <div class="text-caption">
            <span class="q-mr-msmd">Expiration: </span>{{ expirationLabel }}
          </div>
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
const defaultInviteCode = ref("");
const inviteCodes = computed(() => codeStore.inviteCodes);
// Copy invite code to clipboard
const copyCode = (code) => {
  copyToClipboard(code).then(() => {
    $q.notify({
      message: "Invite code copied",
      color: "positive",
    });
  });
};
// Get invite codes
onBeforeMount(() => {
  codeStore.getInviteCodes({
    groupId: route.params.id,
  });
});
// Set Invite Code Expiration
const setExpiration = async (expiration) => {
  // Check if code exist
  const index = inviteCodes.value.findIndex(
    (code) => code.expiration == expiration
  );
  if (index >= 0) {
    defaultInviteCode.value = inviteCodes.value[index];
  } else {
    let newCode = await codeStore.addInviteCode({
      expiration: expiration,
      groupId: route.params.id,
    });
    defaultInviteCode.value = { id: newCode.id, expiration: expiration };
  }
};
const expirationLabel = computed(() => {
  if (!defaultInviteCode.value.expiration) {
    return "No Limit";
  } else {
    if (defaultInviteCode.value.expiration == 1) {
      return 1 + " Day";
    } else {
      return defaultInviteCode.value.expiration + " Days";
    }
  }
});
onMounted(() => {
  if (!inviteCodes.value.length) {
    setExpiration(1);
  } else {
    defaultInviteCode.value = inviteCodes.value[0];
  }
});
/*
Invite Codes Section
**************
**************
*/
</script>
