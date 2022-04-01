<template>
  <q-page>
    <div class="q-px-sm">
      <div class="q-pb-md">
        <div class="text-h6">What's new?</div>
        <div class="text-body2">Your groups latest news</div>
      </div>
      <div v-show="!loading">
        <!-- If there are no updates yet -->
        <div
          v-if="!allUpdates.length"
          class="q-mt-lg text-center text-body1 text-grey"
        >
          <q-icon size="lg" color="primary" name="las la-parachute-box" />
          <div class="text-body1">No groups yet.</div>
          <div>Make a group and gather your members!</div>
          <q-btn
            to="/group/create"
            class="q-mt-sm"
            unelevated
            rounded
            no-caps
            padding="xs xl"
            color="primary"
            label="Create or Join"
          />
        </div>

        <q-virtual-scroll
          v-if="allUpdates.length"
          :items="allUpdates"
          class="hide-scrollbar"
        >
          <template v-slot="{ item }">
            <q-card
              :dark="item.textWhite"
              class="q-mb-md"
              :class="item.bgColor"
            >
              <!-- Group Info -->
              <q-card-section class="q-pa-none">
                <q-item :dark="item.textWhite">
                  <q-item-section
                    @click="
                      $router.push({
                        path: '/group/' + item.group.name.split(' ').join(''),
                        query: { id: item.groupId },
                      })
                    "
                    avatar
                  >
                    <q-avatar>
                      <img :src="item.group.photoURL" alt="Group Avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle2"
                      >{{ item.group.name }}
                    </q-item-label>
                    <q-item-label style="font-size: 11px">
                      {{ relativeDate(item.createdAt) }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round icon="push_pin" />
                  </q-item-section>
                </q-item>
              </q-card-section>

              <!-- Highlights -->
              <q-card-section class="q-py-none">
                <span
                  v-for="(hot, i) in item.highlights"
                  :key="i"
                  class="text-caption"
                >
                  <span v-if="i > 0" class="q-mx-xs">&bull;</span>{{ hot }}
                </span>
              </q-card-section>

              <!-- Update Content -->
              <q-card-section
                @click="
                  $router.push({
                    path: '/update/view',
                    query: { id: item.id, groupId: item.groupId },
                  })
                "
                class="q-py-sm"
              >
                <div class="text-body2">{{ item.content }}</div>
              </q-card-section>

              <!-- Image Content -->
              <q-card-section v-show="item.image" class="flex flex-center">
                <q-img
                  :src="item.image"
                  fit="scale-down"
                  style="border-radius: 8px; max-width: 300px"
                />
              </q-card-section>

              <q-card-section
                class="q-py-none"
                :class="item.textWhite ? 'bg-overlay' : ''"
              >
                <div class="row q-gutter-x-sm q-py-xs">
                  <q-avatar v-if="item.creator.photoURL" size="sm">
                    <img :src="item.creator.photoURL" alt="" />
                  </q-avatar>
                  <div class="text-caption">{{ item.creator.displayName }}</div>
                  <q-badge class="bg-overlay" style="font-size: 10px">
                    Author
                  </q-badge>
                </div>
                <div class="row">
                  <q-btn size="small" round flat icon="favorite_border" />
                  <q-btn
                    v-if="item.auth"
                    @click="removeUpdate(item)"
                    size="small"
                    round
                    flat
                    icon="delete"
                  />
                </div>
              </q-card-section>
            </q-card>
          </template>
        </q-virtual-scroll>
      </div>
    </div>

    <!-- place QPageScroller at end of page -->
    <q-page-scroller position="top" :scroll-offset="150" :offset="[18, 40]">
      <q-btn
        rounded=""
        no-caps
        icon="keyboard_arrow_up"
        color="warning"
        label="Move to top..."
      />
    </q-page-scroller>

    <q-page-sticky expand position="bottom-right" :offset="[18, 18]">
      <q-btn @click="dialogCreate" fab icon="add" color="accent" />
    </q-page-sticky>

    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, computed } from "vue";
import { useQuasar } from "quasar";
// Import Components
import CreateUpdate from "src/components/dialogs/CreateUpdate.vue";

// Import Composables
import { useDateFns } from "src/composables/date-fns";

// Import Stores
import { useUpdateStore } from "src/stores/updates";

const $q = useQuasar();

const { relativeDate } = useDateFns();

const updateStore = useUpdateStore();
// Delete Update
const removeUpdate = (update) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete the post?",
    cancel: true,
  }).onOk(() => updateStore.deleteUpdate(update));
};

const allUpdates = computed(() => updateStore.getAllUpdates);
const dialogCreate = () => {
  $q.dialog({
    component: CreateUpdate,
  });
};
onBeforeMount(() => {
  updateStore.getAllUpdatesAllGroups();
  updateStore.getUpdatesJoinedGroups();
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
