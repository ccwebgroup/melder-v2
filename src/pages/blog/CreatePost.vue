<template>
  <q-page padding>
    <q-card flat class="bg-transparent">
      <q-card-actions class="q-pa-none" align="right">
        <q-btn
          @click="submitPostForm"
          no-caps
          outline
          color="primary"
          label="Save Post"
        />
      </q-card-actions>
      <q-form
        ref="postForm"
        @submit="creatingBlog"
        class="q-gutter-y-sm q-mt-md"
      >
        <q-input
          v-model="blogForm.title"
          outlined
          dense
          placeholder="Create a unique post title."
          clearable
          counter
          maxlength="55"
          :rules="[
            (val) =>
              val.length > 10 || 'Title should be minimum of 10 characters',
          ]"
        />
        <q-input
          v-model="blogForm.description"
          outlined
          dense
          placeholder="Add a brief description of the post."
          clearable
          counter
          maxlength="180"
          :rules="[
            (val) =>
              val.length > 25 ||
              'Description should be minimum of 10 characters',
          ]"
        />

        <QuillEditor
          v-model:content="blogForm.body"
          toolbar="full"
          contentType="html"
          :options="options"
          :modules="modules"
        />
      </q-form>
    </q-card>

    <!-- place QPageScroller at end of page -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useBlogStore } from "stores/blogs";
import dashify from "dashify";

import BlotFormatter from "quill-blot-formatter";
import ImageCompress from "quill-image-compress";

const options = reactive({
  theme: "snow",
  placeholder: "Tell your story...",
});

const modules = [
  {
    name: "blotFormatter",
    module: BlotFormatter,
    options: {
      /* options */
    },
  },
  {
    name: "imageCompress",
    module: ImageCompress,
    options: {
      imageType: "image/webp",
    },
  },
];

const byteSize = (str) => new Blob([str]).size;
const blogStore = useBlogStore();
const $q = useQuasar();
const blogForm = reactive({
  title: "",
  description: "",
  body: "",
  slug: "",
});
const postForm = ref();
const submitPostForm = () => postForm.value.submit();
const creatingBlog = () => {
  const bytes = byteSize(blogForm.body);
  if (bytes > 1048576) {
    $q.dialog({
      title: "Sorry",
      message: `Post exceeds the memory limit of 1,048,576 bytes. Current memory size is <span class='text-bold text-negative'>${bytes}</span> bytes.`,
      html: true,
    });
    return;
  }

  // Slug
  blogForm.slug = dashify(`${blogForm.title}-${Date.now()}`);
  blogStore.addBlog({ ...blogForm });
};
</script>
