<template>
  <q-page padding>
    <blogs-list />
  </q-page>
</template>
<style lang="sass">
.blog-title
  font-size: 18px
.hoverable:hover
  color: $primary
</style>
<script setup>
import { useMeta } from "quasar";
import BlogsList from "components/BlogsList.vue";

useMeta(() => {
  return {
    title: "Blogs - Melder",
    meta: {
      description: {
        name: "Blogs - Melder",
        content: "Latest blog posts from Melder",
      },
      keywords: { name: "keywords", content: "Melder website" },
      // author: { name: "author", content: blog.value.author.displayName },
      ogTitle: {
        property: "og:title",
        // optional; similar to titleTemplate, but allows templating with other meta properties
        content: "Latest blog post from Melder",
      },
      twitterTitle: {
        property: "twitter:title",
        // optional; similar to titleTemplate, but allows templating with other meta properties
        content: "Latest blog post from Melder",
      },
    },

    noscript: {
      default: "This is content for browsers with no JS (or disabled JS)",
    },
  };
});
</script>
