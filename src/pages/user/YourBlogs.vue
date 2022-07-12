<template>
  <q-page padding>
    <q-card flat>
      <q-card-actions align="right">
        <q-btn
          flat
          to="/blogs/create"
          no-caps
          dense
          size="17px"
          color="primary"
          label="Create Post"
        />
      </q-card-actions>
      <q-table
        dense
        tittle="Your blogs"
        :rows="blogs"
        row-key="id"
        :columns="blogColumns"
        :loading="loadingTable"
      >
        <template v-slot:body="props">
          <tr :key="props">
            <td key="title">
              <q-card flat class="bg-transparent">
                <q-card-section class="text-subtitle1 ellipsis q-pa-xs">
                  <q-item-section>
                    <q-item-label
                      @click="viewPost(props.row)"
                      class="cursor-pointer"
                    >
                      {{ props.row.title }}</q-item-label
                    >
                    <q-item-label class="text-caption">
                      {{ formatBlogDate(props.row.createdAt) }}
                    </q-item-label>
                  </q-item-section>
                  <transition
                    appear
                    enter-active-class="animated fadeInUp"
                    leave-active-class="animated fadeOutDown"
                  >
                    <q-chip
                      size="sm"
                      class="q-mt-xs"
                      v-show="props.row.softDelete"
                      label="Temporarily removed"
                    />
                  </transition>
                </q-card-section>
                <q-card-actions class="q-gutter-x-md q-pa-none">
                  <!-- <div>
                    <q-icon
                      class="q-mr-xs"
                      size="sm"
                      color="orange"
                      name="star"
                    />
                    <span>{{ props.row.rate.length }}</span>
                  </div> -->
                  <q-btn
                    size="sm"
                    @click="handleDialog(props.row)"
                    round
                    flat
                    icon="delete"
                    color="negative"
                  >
                    <q-tooltip class="text-caption">Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.softDelete"
                    size="sm"
                    @click="restore(props.row)"
                    round
                    flat
                    icon="restore_from_trash"
                    color="positive"
                  >
                    <q-tooltip class="text-caption">Restore</q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </td>
          </tr>
        </template>
      </q-table>
      <!-- Confirm delete dialog -->
      <q-dialog v-model="confirmDialog">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Confirm!</div>
            <div class="text-subtitle1">
              Are you sure you want to delete blog post?
            </div>
          </q-card-section>
          <q-card-actions class="q-gutter-sm">
            <q-btn
              @click="remove('permanent')"
              no-caps
              outline
              color="negative"
              label="Yes, delete permanently"
            />
            <q-btn
              v-if="!blogToDelete.softDelete"
              @click="remove('temporary')"
              no-caps
              outline
              color="dark"
              label="Yes, delete temporarily"
            />
            <q-btn
              @click="blogToDelete = null"
              no-caps
              color="dark"
              label="Cancel"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>
<style lang="sass" scoped>
.q-item-label
  padding: 0px
</style>
<script setup>
import { useBlogStore } from "stores/blogs";
import { computed, ref } from "vue";
import { useFilters } from "/src/composables/filters";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $router = useRouter();
const { formatBlogDate } = useFilters();
const blogStore = useBlogStore();
const $q = useQuasar();
const loadingTable = ref(true);

const viewPost = (post) => {
  $router.push({
    path: `/blog/${post.slug}`,
  });
};

const restore = (blog) => blogStore.restoreSoftDelete(blog.id);

const blogToDelete = ref(null);
const handleDialog = (blog) => {
  blogToDelete.value = blog;
  confirmDialog.value = true;
};
const remove = async (type) => {
  await blogStore.deletePost(blogToDelete.value.id, type);
  blogToDelete.value = null;
  confirmDialog.value = false;
};

const confirmDialog = ref(false);
const blogs = computed(() => blogStore.yourBlogs);
const getblogs = async () => {
  const res = await blogStore.getYourBlogs();
  if (res) loadingTable.value = false;
};
getblogs();

const blogColumns = [
  {
    name: "title",
    required: true,
    align: "left",
  },
];
</script>
