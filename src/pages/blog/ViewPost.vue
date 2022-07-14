<template>
  <q-page padding>
    <div v-if="blog">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-card flat v-show="!loading" class="q-pb-xl">
          <q-card-actions
            align="center"
            class="fixed-bottom z-top q-mb-md q-pa-none"
            :class="$q.screen.lt.md ? 'floating-actions' : ''"
            v-show="!invisible"
          >
            <div
              class="rounded-border row bg-grey-1 shadow-1 q-px-lg q-gutter-x-md"
            >
              <div>
                <q-btn
                  flat
                  size="15px"
                  round
                  color="positive"
                  :disable="liked"
                  icon="las la-thumbs-up"
                  @click="likeOrDislike(blog.id, 'like')"
                />
                <span>{{ blog.likes }}</span>
              </div>

              <div>
                <q-btn
                  flat
                  size="15px"
                  round
                  color="negative"
                  :disable="disliked"
                  icon="las la-thumbs-down"
                  @click="likeOrDislike(blog.id, 'dislike')"
                />
                <span>{{ blog.dislikes }}</span>
              </div>
              <div>
                <q-btn
                  @click="handleCommentDialog"
                  size="15px"
                  flat
                  round
                  icon="las la-comment"
                />
                <span>{{ blog.commentsCount }}</span>
              </div>
            </div>
          </q-card-actions>

          <q-card-section class="q-py-none">
            <q-item dense class="q-mb-md">
              <q-item-section avatar>
                <q-avatar size="35px" color="grey-5">
                  <img
                    v-if="blog.author.photoURL"
                    :src="blog.author.photoURL"
                  />
                  <q-icon v-else color="white" size="20px" name="fas fa-user" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  @click="routeToUser(blog.author)"
                  class="cursor-pointer text-primary"
                  style="max-width: 150px"
                  >{{ blog.author.displayName }}</q-item-label
                >
                <q-item-label>{{
                  formatBlogDate(blog.createdAt)
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="q-gutter-sm">
                  <q-btn
                    @click="openLink(link)"
                    unelevated
                    size="sm"
                    round
                    outline
                    color="primary"
                    v-for="(link, i) in blog.author.social_links"
                    :key="i"
                    :icon="'ti-' + link.platform.toLowerCase()"
                  />
                </div>
              </q-item-section>
            </q-item>
            <div class="text-subtile2">{{ blog.title }}</div>
            <div class="text-grey">{{ blog.description }}</div>
          </q-card-section>
          <q-separator spaced />
          <q-card>
            <q-card-section v-html="blog.body" />
          </q-card>
          <q-card-actions class="q-gutter-x-md" v-intersection="onIntersection">
            <div>
              <q-btn
                flat
                size="15px"
                round
                color="positive"
                :disable="liked"
                icon="las la-thumbs-up"
                @click="likeOrDislike(blog.id, 'like')"
              />
              <span>{{ blog.likes }}</span>
            </div>

            <div>
              <q-btn
                flat
                size="15px"
                round
                color="negative"
                :disable="disliked"
                icon="las la-thumbs-down"
                @click="likeOrDislike(blog.id, 'dislike')"
              />
              <span>{{ blog.dislikes }}</span>
            </div>
            <div>
              <q-btn
                @click="handleCommentDialog"
                size="15px"
                flat
                round
                icon="las la-comment"
              />
              <span>{{ blog.commentsCount }}</span>
            </div>
          </q-card-actions>
        </q-card>
      </transition>
    </div>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<style lang="sass">
.ql-video
  width: 100%
  height: 56.25vw
  max-height: calc(800px / 16 * 9)

img
  width: 100%
  max-width: 750px
  height: auto

.floating-actions
  margin-bottom: 60px
</style>
<script setup>
import { computed, ref, onBeforeUnmount, watch } from "vue";
import { useBlogStore } from "stores/blogs";
import { useRoute, useRouter } from "vue-router";
import { useFilters } from "src/composables/filters";
import { useMeta, useQuasar } from "quasar";
import { useUserStore } from "stores/users";
import CommentsList from "components/dialogs/CommentsList.vue";

const $q = useQuasar();
const { formatBlogDate } = useFilters();
const blogStore = useBlogStore();
const userStore = useUserStore();
const $route = useRoute();
const $router = useRouter();
const loading = ref(true);
const invisible = ref(false);
const liked = ref(false);
const disliked = ref(false);

const likeOrDislike = (id, type) => {
  if (type == "like") liked.value = true;
  else disliked.value = true;
  blogStore.addLikeOrDislike(id, type);
};

const onIntersection = (entry) => {
  invisible.value = entry.isIntersecting;
};

const commentDialog = ref(null);
const handleCommentDialog = () => {
  if (!commentDialog.value) {
    commentDialog.value = $q
      .dialog({
        component: CommentsList,
        componentProps: { blog: blog.value },
      })
      .onDismiss(() => (commentDialog.value = null));
  } else {
    commentDialog.value.hide();
    commentDialog.value = null;
  }
};

onBeforeUnmount(() => {
  if (commentDialog.value) commentDialog.value.hide();
});

const routeToUser = (author) => {
  userStore.routeToUserProfile(author);
};

const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};

const blog = computed(() => blogStore.blog);
const getBlog = async () => {
  const res = await blogStore.getBlogViaSlug($route.params.slug);
  if (res) loading.value = false;
};

getBlog();

useMeta(() => {
  if (blog.value) {
    return {
      title: blog.value.title,
      meta: {
        description: {
          name: blog.value.description,
          content: blog.value.description,
        },
        keywords: { name: "keywords", content: "Melder website" },
        author: { name: "author", content: blog.value.author.displayName },
        ogTitle: {
          property: "og:title",
          // optional; similar to titleTemplate, but allows templating with other meta properties
          content: blog.value.title,
        },
        twitterTitle: {
          property: "twitter:title",
          // optional; similar to titleTemplate, but allows templating with other meta properties
          content: blog.value.title,
        },
      },

      noscript: {
        default: "This is content for browsers with no JS (or disabled JS)",
      },
    };
  }
});
</script>
