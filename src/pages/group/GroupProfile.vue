<template>
  <q-page>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card v-if="!loading" flat>
        <!-- Avatar Section -->
        <q-card-section class="q-py-none">
          <q-avatar size="90px" v-show="groupData.photoURL">
            <img id="group-avatar" :src="groupData.photoURL" />
          </q-avatar>
          <q-avatar
            v-show="!groupData.photoURL"
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
          >
            {{ groupData.name[0].toUpperCase() }}
          </q-avatar>

          <!-- Role Buttons -->
          <div v-if="groupData.isMember" class="q-gutter-sm float-right">
            <q-btn
              v-if="groupData.hasRole && groupData.hasRole.settings.all"
              @click="adminDialog"
              dense
              outline
              round
              icon="admin_panel_settings"
            />
            <q-btn
              v-if="
                groupData.hasRole &&
                (groupData.hasRole.settings.all ||
                  groupData.hasRole.settings.canAdd)
              "
              @click="inviteDialog"
              dense
              outline
              round
              icon="person_add"
            />
            <q-btn dense outline round icon="notifications_none" />
            <q-btn @click="memberDialog" dense flat round icon="ti-more-alt" />
          </div>
        </q-card-section>

        <!-- Profile Details -->
        <q-card-section class="q-py-none">
          <div class="profile-caption">
            <div class="text-subtitle1 text-bold">
              {{ groupData.name }}
            </div>
            <div class="text-caption">
              <q-icon class="q-mr-sm" name="fas fa-users" color="primary" />
              <span>{{ groupData.membersCount }} Members</span>
            </div>
            <div class="text-caption q-mb-md">
              <q-icon
                class="q-mr-sm"
                :name="groupData.private ? 'fas fa-lock' : 'fas fa-lock-open'"
                color="primary"
              />
              <span>{{ groupData.private ? "Private" : "Public" }} group</span>
            </div>
            <div class="text-caption">
              {{ groupData.description }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </transition>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
// Import Stores
import { useGroupStore } from "src/stores/groups";
// Import Components
import GroupAdmin from "src/components/dialogs/GroupAdmin.vue";
import InviteUser from "src/components/dialogs/InviteUser.vue";
import MemberSettings from "src/components/dialogs/MemberSettings.vue";

const $q = useQuasar();
const route = useRoute();

// Define Stores
const groupStore = useGroupStore();

// Invite users
const inviteDialog = () => {
  $q.dialog({
    component: InviteUser,
  });
};

// Member Settings Dialog
const memberDialog = () => {
  $q.dialog({
    component: MemberSettings,
  });
};

// GroupAdmin Dialog
const adminDialog = () => {
  $q.dialog({
    component: GroupAdmin,
    componentProps: {
      groupData: groupData.value,
    },
  });
};

// Get Group Profile
const groupData = computed(() => groupStore.groupProfile);
onBeforeMount(() => {
  groupStore.getGroupProfile(route.query.id);
});

//Loading State
const loading = ref(true);
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
onMounted(() => {
  showLoading();
});
</script>
