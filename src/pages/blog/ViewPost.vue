<template>
  <q-page padding>
    <div v-if="blog">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-card flat v-show="!loading">
          <q-card-section class="q-py-none">
            <q-item dense class="q-mb-md">
              <q-item-section avatar>
                <q-avatar size="30px">
                  <img :src="blog.author.photoURL" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="cursor-pointer text-primary">{{
                  blog.author.displayName
                }}</q-item-label>
                <q-item-label>{{
                  formatBlogDate(blog.createdAt)
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="openLink(link)"
                  unelevated
                  round
                  v-for="(link, i) in blog.author.social_links"
                  class="bg-grey-3"
                  :key="i"
                  :icon="'ti-' + link.platform.toLowerCase()"
                />
              </q-item-section>
            </q-item>
            <div class="text-h4">{{ blog.title }}</div>
          </q-card-section>
          <q-card-section v-html="blog.body" />
        </q-card>
      </transition>
    </div>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<script setup>
import { onBeforeMount, onMounted, computed, ref } from "vue";
import { useBlogStore } from "stores/blogs";
import { useRoute } from "vue-router";
import { useFilters } from "src/composables/filters";
import { useMeta } from "quasar";

const { formatBlogDate } = useFilters();
const blogStore = useBlogStore();
const $route = useRoute();
const loading = ref(true);

const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};

const blog = computed(() => blogStore.blog);
onBeforeMount(async () => {
  const res = await blogStore.getBlog($route.params.id);
  if (res) loading.value = false;
});

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
