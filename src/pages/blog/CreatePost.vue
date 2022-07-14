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
        <div class="q-pa-md bg-white">
          <q-card-actions
            align="center"
            class="fixed-bottom z-top q-mb-md q-pa-none"
            :class="$q.screen.lt.md ? 'floating-actions' : ''"
          >
            <div
              class="rounded-border row bg-grey-1 shadow-1 q-px-lg q-gutter-x-md"
            >
              <q-btn
                flat
                color="secondary"
                @click="toggle"
                :icon="
                  $q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'
                "
              />
              <q-btn @click="submitPostForm" flat color="primary" icon="save" />
            </div>
          </q-card-actions>
          <QuillEditor
            v-model:content="blogForm.body"
            contentType="html"
            theme="bubble"
            :toolbar="toolbar"
            :modules="modules"
          />
        </div>
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

<style lang="sass" scoped>
.floating-actions
  margin-bottom: 60px
</style>
<script setup>
import { reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useBlogStore } from "stores/blogs";
import dashify from "dashify";

import BlotFormatter from "quill-blot-formatter";
import ImageCompress from "quill-image-compress";

const blogStore = useBlogStore();
const $q = useQuasar();

const toggle = (e) => {
  const target =
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  $q.fullscreen
    .toggle(target)
    .then(() => {
      // success!
    })
    .catch((err) => {
      alert(err);
      // uh, oh, error!!
      // console.error(err)
    });
};

const toolbar = [
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],

  [{ align: [] }],
  [{ direction: "rtl" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],

  ["clean"],
];

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
const blogForm = reactive({
  title: "",
  description: "",
  body: '<h4><strong class="ql-size-large" style="color: rgb(136, 136, 136);">Write your story here...</strong></h4>',
  slug: "",
});
const postForm = ref();
const submitPostForm = () => postForm.value.submit();
const creatingBlog = () => {
  const bytes = byteSize(blogForm.body);

  if (bytes > 1048576) {
    $q.dialog({
      title: "Sorry",
      message: `Your post memory size <span class='text-bold text-negative'>${bytes}</span> bytes exceeds the memory limit of 1,048,576 bytes.`,
      html: true,
    });
    return;
  }

  // Slug
  blogForm.slug = dashify(`${blogForm.title}-${Date.now()}`);
  blogStore.addBlog({ ...blogForm });
};
</script>
