<template>
  <q-card flat>
    <q-card-section>
      <q-table
        :loading="loadingTable"
        flat
        :rows="blogs"
        :columns="blogColumns"
        row-key="id"
        separator="none"
        :pagination="pagination"
        hide-header
      >
        <template v-slot:top>
          <q-item-label class="text-h6">Latest Post</q-item-label>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-card flat class="q-pa-sm q-mx-auto" style="max-width: 780px">
              <q-list>
                <q-item dense>
                  <q-item-section avatar>
                    <q-avatar size="35px" color="grey-5">
                      <img
                        v-if="props.row.author.photoURL"
                        :src="props.row.author.photoURL"
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
                    <q-item-label
                      @click="routeToUser(props.row.author)"
                      class="text-caption hoverable cursor-pointer"
                      >{{ props.row.author.displayName }}</q-item-label
                    >

                    <q-item-label caption>{{
                      formatBlogDate(props.row.createdAt)
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <div>
                      <q-icon
                        class="q-mr-xs"
                        color="positive"
                        name="las la-thumbs-up"
                      /><span class="text-caption">{{ props.row.likes }}</span>
                    </div>
                    <div>
                      <q-icon
                        class="q-mr-xs"
                        color="negative"
                        name="las la-thumbs-down"
                      /><span class="text-caption">{{
                        props.row.dislikes
                      }}</span>
                    </div>
                    <div>
                      <q-icon
                        class="q-mr-xs"
                        color="primary"
                        name="las la-comment"
                      /><span class="text-caption">{{
                        props.row.commentsCount
                      }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item class="q-mt-sm" dense>
                  <q-item-section>
                    <q-item-label
                      @click="viewPost(props.row)"
                      class="q-mb-xs cursor-pointer blog-title hoverable"
                      >{{ props.row.title }}</q-item-label
                    >
                    <q-item-label caption>{{
                      props.row.description
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<style lang="sass">
.blog-title
  font-size: 18px
.hoverable:hover
  color: $primary
</style>
<script setup>
import { computed, ref } from "vue";
import { useBlogStore } from "stores/blogs";
import { useFilters } from "/src/composables/filters";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/users";

const $router = useRouter();
const blogStore = useBlogStore();
const userStore = useUserStore();
const { formatBlogDate } = useFilters();
const loadingTable = ref(true);

const viewPost = (post) => {
  $router.push({
    path: `/blog/${post.slug}`,
  });
};

const routeToUser = (user) => userStore.routeToUserProfile(user);

const blogs = computed(() => blogStore.allBlogs);
const getAllBlogs = async () => {
  const res = await blogStore.getAllBlogs();
  if (res) loadingTable.value = false;
};

getAllBlogs();

const pagination = {
  rowsPerPage: 10,
};
const blogColumns = [
  {
    name: "title",
    required: true,
  },
];
</script>
