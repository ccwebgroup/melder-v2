<template>
  <q-page padding>
    <div class="text-h6">Pinned Post</div>

    <div v-if="pinnedUpdates.length">
      <q-carousel
        v-model="slide"
        class="rounded-borders"
        :autoplay="2800"
        swipeable
        animated
        infinite
        height="150px"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        navigation
        arrows
      >
        <q-carousel-slide
          :name="i"
          v-for="(item, i) in pinnedUpdates"
          :key="item.id"
          :class="item.bgColor"
        >
          <q-item :dark="item.textWhite">
            <q-item-section avatar>
              <q-avatar>
                <img :src="item.group.photoURL" alt="" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1">{{
                item.group.name
              }}</q-item-label>
              <q-item-label caption>{{
                relativeDate(item.createdAt)
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <div :class="item.textWhite ? 'text-white' : ''">
            {{ item.content }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div v-else>
      <!-- No Pinned post? Show illustration -->
      <q-img
        class="q-mt-md"
        src="~assets/illu/augmented_reality_re_f0qd.svg"
        style="max-width: 600px"
      />
      <div class="flex flex-center">
        <q-btn
          class="q-mt-md"
          color="primary"
          to="/updates"
          rounded
          unelevated
          no-caps
          label="Check latest news"
        />
      </div>
      <div class="text-center text-h6 text-grey q-mt-sm">
        Nothing to display...
      </div>
    </div>

    <q-card flat v-if="pinnedUpdates.length">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          Manage <q-icon size="15px" name="push_pin" />
        </div>
        <q-list dense>
          <q-item v-for="item in pinnedUpdates" :key="item.id">
            <q-item-section avatar>
              <q-avatar size="md">
                <img :src="item.group.photoURL" alt="" />
              </q-avatar>
            </q-item-section>
            <q-item-section
              @click="
                $router.push({
                  path: '/update/view',
                  query: { id: item.id, groupId: item.groupId },
                })
              "
            >
              <q-item-label>{{ item.group.name }}</q-item-label>
              <q-item-label lines="1" class="text-caption">
                {{ item.content }}
              </q-item-label>
              <q-item-label caption>
                <span v-for="(hi, i) in item.highlights" :key="i"
                  ><span class="q-ml-sm" v-show="i">&bull;</span> {{ hi }}
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn @click="unpin(item)" round flat icon="cancel" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onBeforeMount, computed, ref } from "vue";
// Import Composables
import { useQuasar } from "quasar";
import { useDateFns } from "src/composables/date-fns";

// Import Stores
import { useUpdateStore } from "src/stores/updates";
// Define Stores
const updateStore = useUpdateStore();

const { relativeDate } = useDateFns();
const $q = useQuasar();

// Manage Pinned
const unpin = (update) => {
  $q.dialog({
    title: "Confirm",
    message: "Unpin the post?",
    cancel: true,
  }).onOk(() => updateStore.deletePinnedUpdate(update));
};

// Get Pinned Upadtes
const slide = ref(0);
const pinnedUpdates = computed(() => updateStore.pinnedUpdates);

onBeforeMount(() => {
  updateStore.getPinnedUpdates();
});
</script>
