<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :position="$q.screen.lt.md ? 'standard' : 'right'"
    seamless
    full-height
    square
    :maximized="$q.screen.lt.md"
    transition-show="slide-left"
    transition-hide="slide-right"
    class="z-max"
  >
    <q-card :class="$q.screen.lt.md ? '' : 'side-drawer'">
      <q-card-actions class="q-pb-none">
        <span class="q-ml-sm text-subtitle1"
          >Comments({{ blog.commentsCount }})</span
        >
        <q-space />
        <q-btn round flat icon="close" v-close-popup />
      </q-card-actions>
      <q-card-section class="q-py-none">
        <q-card class="shadow-1">
          <q-card-section v-if="authStore.authUser" class="q-py-xs">
            <div>
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="35px" color="grey-5">
                    <img
                      v-if="authStore.authUser.photoURL"
                      :src="authStore.authUser.photoURL"
                    />
                    <q-icon
                      v-else
                      color="white"
                      size="20px"
                      name="fas fa-user"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    authStore.authUser.displayName
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-form @submit="saveComment">
              <q-input
                v-model="commentData.text"
                flat
                dense
                borderless
                type="textarea"
                rows="3"
                placeholder="What's on your mind?"
              />
              <q-card-actions align="right">
                <q-btn
                  :disable="!commentData.text"
                  type="submit"
                  no-caps
                  outline
                  padding="xs md"
                  rounded
                  icon-right="send"
                  color="primary"
                  label="Send"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div v-for="(comment, i) in blog.comments" :key="i">
          <q-separator spaced="13px" v-show="i" />
          <q-item class="q-pa-none">
            <q-item-section avatar>
              <q-avatar size="34px" color="grey-5">
                <img
                  v-if="comment.author.photoURL"
                  :src="comment.author.photoURL"
                />
                <q-icon v-else color="white" size="20px" name="fas fa-user" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ comment.author.displayName }}</q-item-label>
              <q-item-label caption>{{
                formatFns(comment.createdAt)
              }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="comment.canUpdate" side>
              <q-icon name="more_horiz" class="cursor-pointer">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section>Edit this comment</q-item-section>
                    </q-item>
                    <q-item
                      @click="removeComment(comment.id)"
                      clickable
                      v-close-popup
                    >
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-item-section>
          </q-item>
          <div class="text-caption">
            {{ comment.text }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="sass">
.q-dialog__inner--minimized
  padding: 0px

.side-drawer
  width: 414px
</style>
<script setup>
import { useDialogPluginComponent } from "quasar";
import { reactive } from "vue";
import { useAuthStore } from "stores/auth";
import { useBlogStore } from "src/stores/blogs";
import { useFilters } from "src/composables/filters";

const { formatFns } = useFilters();
const blogStore = useBlogStore();
const props = defineProps({
  blog: Object,
});

const removeComment = (commentId) => {
  blogStore.deleteComment(props.blog.id, commentId);
};

const commentData = reactive({
  blogId: props.blog.id,
  text: "",
});
const saveComment = async () => {
  const res = await blogStore.addComment({ ...commentData });
  if (res) commentData.text = "";
};

const authStore = useAuthStore();
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();
</script>
