<template>
  <q-page>
    <q-card flat>
      <q-card-actions align="center">
        <q-btn
          to="/group/create"
          no-caps
          rounded
          padding="xs md"
          unelevated
          outline
          icon="las la-plus-circle"
          label="Create"
        />
        <q-btn
          @click="joinDialog"
          no-caps
          rounded
          padding="xs md"
          unelevated
          outline
          label="Join a group"
        />
      </q-card-actions>
      <q-card-section>
        <div class="text-subtitle1 text-bold">Groups you manage</div>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-show="!loading">
            <div
              v-show="!groupsManage.length"
              class="q-mt-lg text-center text-body1 text-grey"
            >
              <q-icon size="lg" color="primary" name="las la-parachute-box" />
              <div class="text-body1">No groups yet.</div>
              <div>Create and invite people!</div>
            </div>

            <!-- List of Groups manage  -->
            <q-virtual-scroll :items="groupsManage">
              <template v-slot="{ item, index }">
                <q-item :key="index" :class="item.class">
                  <q-item-section avatar>
                    <q-avatar
                      @click="
                        $router.push({
                          path: '/group/' + item.name.split(' ').join(''),
                          query: { id: item.id },
                        })
                      "
                      size="60px"
                    >
                      <img :src="item.photoURL" alt="Group Avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      @click="
                        $router.push({
                          path: '/group/' + item.name.split(' ').join(''),
                          query: { id: item.id },
                        })
                      "
                      class="text-subtitle2 text-bold"
                    >
                      {{ item.name }}
                    </q-item-label>
                    <q-item-label caption
                      >{{ item.membersCount }}
                      <span>Members</span></q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
            <!-- List of joined Groups  -->
            <div v-if="joinedGroups.length" class="q-mt-md">
              <div class="text-subtitle2">Joined groups</div>
              <q-virtual-scroll :items="joinedGroups">
                <template v-slot="{ item, index }">
                  <q-item :key="index" :class="item.class">
                    <q-item-section avatar>
                      <q-avatar
                        @click="
                          $router.push({
                            path: '/group/' + item.name.split(' ').join(''),
                            query: { id: item.id },
                          })
                        "
                        size="60px"
                      >
                        <img :src="item.photoURL" alt="Group Avatar" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        @click="
                          $router.push({
                            path: '/group/' + item.name.split(' ').join(''),
                            query: { id: item.id },
                          })
                        "
                        class="text-subtitle2 text-bold"
                      >
                        {{ item.name }}
                      </q-item-label>
                      <q-item-label caption
                        >{{ item.membersCount }}
                        <span>Members</span></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-virtual-scroll>
            </div>
          </div>
        </transition>
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, computed } from "vue";
import { useQuasar } from "quasar";
// Import Component
import JoinGroup from "src/components/dialogs/JoinGroup.vue";

// Import Stores
import { useGroupStore } from "src/stores/groups";
// Define Stores
const groupStore = useGroupStore();

const $q = useQuasar();

const joinDialog = () => {
  $q.dialog({
    component: JoinGroup,
  });
};

// Get Groups Manage and Joined Groups
const groupsManage = computed(() => groupStore.groupsManage);
const joinedGroups = computed(() => groupStore.joinedGroups);
onBeforeMount(async () => {
  groupStore.getGroupsManage();
  groupStore.getJoinedGroups();
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
