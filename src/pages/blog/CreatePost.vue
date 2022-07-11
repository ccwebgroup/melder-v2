<template>
  <q-page padding>
    <q-card flat class="bg-transparent">
      <q-card-section class="q-pb-none">
        <q-tabs dense v-model="postMenu" align="left">
          <q-tab name="create">Create</q-tab>
          <q-tab name="preview">Preview</q-tab>
        </q-tabs>
      </q-card-section>
      <div v-show="postMenu == 'create'">
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
            :modules="modules"
            theme="bubble"
            toolbar="full"
            contentType="html"
            class="z-top"
            placeholder="Begin your story..."
          />
        </q-form>
      </div>

      <div v-show="postMenu == 'preview'">
        <q-card-section v-html="blogForm.body" />
      </div>
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

const modules = {
  name: "blotFormatter",
  module: BlotFormatter,
  options: {
    /* options */
  },
};
const blogStore = useBlogStore();
const postMenu = ref("create");
const $q = useQuasar();
const blogForm = reactive({
  title: "",
  description: "",
  body: "",
  slug: "",
});
console.log(
  dashify(
    "9 TYPES OF ELEARNING ACTIVITIES TO CONSIDER WHEN DESIGNING YOUR ELEARN"
  )
);
const postForm = ref();
const submitPostForm = () => postForm.value.submit();
const creatingBlog = () => {
  // if (blogForm.body.length > 63000) {
  //   $q.dialog({
  //     title: "Sorry",
  //     message: "Post content should not be more than 63,000 characters.",
  //   });
  //   return;
  // }
  // Slug
  blogForm.slug = dashify(`${blogForm.title}-${Date.now()}`);
  blogStore.addBlog({ ...blogForm });
};
</script>
