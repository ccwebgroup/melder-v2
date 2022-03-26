<template>
  <q-page>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card v-if="!loading" flat>
        <q-card-section>
          <!-- Avatar Section -->
          <q-avatar size="90px" v-if="groupProfile.photoURL">
            <img id="group-avatar" :src="groupProfile.photoURL" />
          </q-avatar>
          <q-avatar
            v-else
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
            >{{ groupProfile.name[0].toUpperCase() }}</q-avatar
          >
          <!-- Role Buttons -->
          <div v-if="groupProfile.hasRole" class="q-gutter-md float-right">
            <q-btn
              v-show="groupProfile.hasRole.settings.all"
              @click="adminDialog"
              dense
              outline
              round
              icon="admin_panel_settings"
            />
            <q-btn
              v-show="
                groupProfile.hasRole.settings.all ||
                groupProfile.hasRole.settings.canAdd
              "
              dense
              outline
              round
              icon="person_add"
            />
            <q-btn dense outline round icon="notifications_none" />
          </div>

          <!-- Profile Details -->
          <div class="profile-caption">
            <div class="text-subtitle1 text-bold">
              {{ groupProfile.name }}
            </div>
            <div class="text-subtitle2 q-mb-md">
              <q-icon class="q-mr-sm" name="fas fa-users" color="primary" />
              <span>{{ groupProfile.membersCount }} Members</span>
            </div>
            <div class="text-caption">
              {{ groupProfile.description }}
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
import { useQuasar, useMeta } from "quasar";

// Import Components
import GroupAdmin from "src/components/dialogs/GroupAdmin.vue";

// Import Stores
import { useGroupStore } from "src/stores/groups";

const $q = useQuasar();
const route = useRoute();

// Define Stores
const groupStore = useGroupStore();

// GroupAdmin Dialogs
const adminDialog = () => {
  $q.dialog({
    component: GroupAdmin,
    componentProps: {
      groupProfile: groupProfile.value,
    },
  });
};

// Get Group Profile
const groupProfile = computed(() => groupStore.groupProfile);
onBeforeMount(() => {
  groupStore.getGroupProfile(route.params.id);
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

// SEO FRIENDLY
// const metaData = {
//   title: groupProfile.value.name,
// };
// onMounted(() => {
//   useMeta(metaData);
// });
</script>
