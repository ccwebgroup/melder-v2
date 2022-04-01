<template>
  <q-page id="container" :class="updateData.bgColor">
    <div v-if="!loading">
      <q-splitter v-model="splitterModel" horizontal style="height: 650px">
        <!-- Update Content Section -->
        <template v-slot:before>
          <q-card
            square
            :dark="updateData.textWhite"
            :class="updateData.bgColor"
          >
            <q-item :dark="updateData.textWhite">
              <q-item-section
                @click="
                  $router.push({
                    path: '/group/' + updateData.group.name.split(' ').join(''),
                    query: { id: updateData.groupId },
                  })
                "
                avatar
              >
                <q-avatar>
                  <img :src="updateData.group.photoURL" alt="Group Avatar" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle2"
                  >{{ updateData.group.name }}
                </q-item-label>
                <q-item-label style="font-size: 11px">
                  {{ relativeDate(updateData.createdAt.toDate()) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round icon="push_pin" />
              </q-item-section>
            </q-item>

            <!-- Highlights -->
            <q-card-section class="q-py-none">
              <span
                v-for="(hot, i) in updateData.highlights"
                :key="i"
                class="text-caption"
              >
                <span v-if="i > 0" class="q-mx-xs">&bull;</span>{{ hot }}
              </span>
            </q-card-section>

            <!-- Update Content -->
            <q-card-section class="q-py-sm">
              <div class="text-body2">{{ updateData.content }}</div>
            </q-card-section>

            <!-- Image Content -->
            <q-card-section
              v-show="updateData.image"
              class="flex flex-center q-py-sm"
            >
              <q-img
                :src="updateData.image"
                fit="scale-down"
                style="border-radius: 8px; max-width: 300px"
              />
            </q-card-section>

            <!-- Author Details -->
            <q-card-section class="q-py-sm">
              <div class="row q-gutter-x-sm q-py-xs">
                <q-avatar v-if="updateData.creator.photoURL" size="sm">
                  <img :src="updateData.creator.photoURL" alt="" />
                </q-avatar>
                <div class="text-caption">
                  {{ updateData.creator.displayName }}
                </div>
                <q-badge class="bg-overlay" style="font-size: 10px">
                  Author
                </q-badge>
              </div>
            </q-card-section>
          </q-card>
        </template>

        <template v-slot:separator>
          <q-avatar
            :color="$q.dark.isActive ? 'white' : 'dark'"
            :text-color="$q.dark.isActive ? 'dark' : 'white'"
            size="35px"
            icon="drag_indicator"
          />
        </template>

        <!-- Messages Displayed -->
        <template v-slot:after>
          <q-card
            square
            :dark="updateData.textWhite"
            :class="updateData.bgColor ? 'bg-overlay' : ''"
          >
            <q-card-section v-show="!messagesData.length">
              <div class="flex flex-center text-subtitle1 q-mt-xl">
                <q-icon
                  class="q-mr-sm"
                  size="30px"
                  name="las la-comment-slash"
                />
                No discussions yet...
              </div>
            </q-card-section>

            <!-- messages -->
            <q-card-section
              ref="messagesDiv"
              style="overflow-y: auto; height: 600px"
            >
              <q-chat-message
                v-for="message in messagesData"
                :key="message.id"
                :name="message.author.displayName"
                :text="message.text"
                :sent="message.sent"
                :bg-color="
                  updateData.bgColor && !message.sent ? 'transparent' : 'grey-4'
                "
                :text-color="updateData.bgColor && !message.sent ? 'white' : ''"
              >
                <template v-slot:avatar>
                  <q-avatar size="md">
                    <img :src="message.author.photoURL" alt="" />
                  </q-avatar>
                </template>
                <template v-slot:stamp>
                  <div style="font-size: 10px">
                    {{ relativeDate(message.createdAt) }}
                  </div>
                </template>
              </q-chat-message>
            </q-card-section>

            <q-btn
              class="absolute"
              style="bottom: 40px; left: 10px"
              padding="xs xs"
              fab
              icon="keyboard_arrow_down"
              color="accent"
            />
          </q-card>
        </template>
      </q-splitter>
    </div>

    <!-- Messageing Input -->
    <div
      class="q-pa-sm fixed-bottom"
      :class="$q.dark.isActive ? 'bg-dark text-dark' : 'bg-white'"
    >
      <q-form ref="messageForm" @submit="sendMessage(updateData)">
        <q-input
          v-model="message.text"
          rounded
          outlined
          dense
          placeholder="Discusions"
        >
          <template v-slot:after>
            <q-btn
              :disable="!message.text"
              type="submit"
              @click="sendMessage(updateData)"
              round
              flat
              icon="send"
            />
          </template>
        </q-input>
      </q-form>
    </div>

    <!-- Loading Design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
// Import Composables
import { useDateFns } from "src/composables/date-fns";
// import stores
import { useUpdateStore } from "src/stores/updates";
import { useRoute } from "vue-router";
import { scroll } from "quasar";

const { getScrollHeight } = scroll;
const route = useRoute();

const { relativeDate } = useDateFns();

const updateStore = useUpdateStore();
const updateData = computed(() => updateStore.update);
const messagesData = computed(() => updateStore.getAllMessages);
const splitterModel = ref(60);

// Create Messages
const message = reactive({
  text: "",
});
const messageForm = ref();
const sendMessage = (update) => {
  updateStore.addMessage({
    ...message,
    updateId: update.id,
    groupId: update.groupId,
  });
  message.text = "";
  messageForm.value.reset();
};

const messagesDiv = ref();

updateStore.$subscribe((state) => {
  scrollToBottom();
});

const scrollToBottom = () => {
  let container = document.querySelector("#container");
  if (messagesDiv.value) {
    setTimeout(() => {
      messagesDiv.value.$el.scrollTop = messagesDiv.value.$el.scrollHeight;
    }, 20);
  }
  // if (container) {

  // }
};

onBeforeMount(() => {
  updateStore.getUpdate(route.query);
  updateStore.getMessages(route.query);
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
