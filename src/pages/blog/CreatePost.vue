<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pb-none">
        <q-tabs dense v-model="postMenu" align="left">
          <q-tab name="create">Create</q-tab>
          <q-tab name="preview">Preview</q-tab>
        </q-tabs>
      </q-card-section>
      <q-tab-panels
        v-model="postMenu"
        animated
        transition-prev="fade"
        transition-next="fade"
      >
        <q-tab-panel name="create">
          <q-card-section class="q-pa-none">
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
              class="q-gutter-sm q-mt-md"
            >
              <q-input
                v-model="blogForm.title"
                outlined
                dense
                hint="Create a unique post title."
                clearable
                counter
                maxlength="70"
                :rules="[
                  (val) =>
                    val.length > 10 ||
                    'Title should be minimum of 10 characters',
                ]"
              />
              <q-input
                v-model="blogForm.description"
                outlined
                dense
                hint="Add a brief description of the post."
                clearable
                counter
                maxlength="180"
                :rules="[
                  (val) =>
                    val.length > 25 ||
                    'Description should be minimum of 10 characters',
                ]"
              />
              <q-editor
                :dense="$q.screen.lt.md"
                :toolbar="editorToolbar"
                :fonts="editorFonts"
                v-model="blogForm.body"
              />
              <div class="text-caption text-right text-grey-7">
                {{ blogForm.body.length }} / 63000
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel name="preview">
          <q-card-section>
            <div class="text-h5">{{ blogForm.title }}</div>
            <div class="text-caption text-grey-7">
              {{ blogForm.description }}
            </div>
          </q-card-section>
          <q-card-section v-html="blogForm.body" />
        </q-tab-panel>
      </q-tab-panels>
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
const blogStore = useBlogStore();
const postMenu = ref("create");
const $q = useQuasar();
const blogForm = reactive({
  title: "",
  description: "",
  body: "",
});

const postForm = ref();
const submitPostForm = () => postForm.value.submit();
const creatingBlog = () => {
  if (blogForm.body.length > 63000) {
    $q.dialog({
      title: "Sorry",
      message: "Post content should not be more than 63,000 characters.",
    });
    return;
  }
  blogStore.addBlog({ ...blogForm });
};

const editorFonts = {
  arial: "Arial",
  arial_black: "Arial Black",
  comic_sans: "Comic Sans MS",
  courier_new: "Courier New",
  impact: "Impact",
  lucida_grande: "Lucida Grande",
  times_new_roman: "Times New Roman",
  verdana: "Verdana",
};
const editorToolbar = [
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: "only-icons",
      options: ["left", "center", "right", "justify"],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      options: ["left", "center", "right", "justify"],
    },
  ],
  ["bold", "italic", "strike", "underline", "subscript", "superscript"],
  ["token", "hr", "link", "custom_btn"],
  ["print", "fullscreen"],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: "no-icons",
      options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"],
    },
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: "no-icons",
      options: [
        "size-1",
        "size-2",
        "size-3",
        "size-4",
        "size-5",
        "size-6",
        "size-7",
      ],
    },
    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: "no-icons",
      options: [
        "default_font",
        "arial",
        "arial_black",
        "comic_sans",
        "courier_new",
        "impact",
        "lucida_grande",
        "times_new_roman",
        "verdana",
      ],
    },
    "removeFormat",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],

  ["undo", "redo"],
  ["viewsource"],
];
</script>
