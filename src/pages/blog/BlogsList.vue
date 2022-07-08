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
      <q-card-section>
        <q-table
          title="Latest"
          flat
          :rows="blogs"
          :columns="blogColumns"
          row-key="id"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="title">
                <q-item dense clickable>
                  <q-item-section avatar>
                    <q-avatar size="30px">
                      <img :src="props.row.author.photoURL" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">{{
                      props.row.author.displayName
                    }}</q-item-label>

                    <q-item-label caption>{{
                      formatBlogDate(props.row.createdAt)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item dense clickable :to="'/blog/' + props.row.id">
                  <q-item-section>
                    <q-item-label class="q-mb-xs text-h6">{{
                      props.row.title
                    }}</q-item-label>
                    <q-item-label class="text-caption">{{
                      props.row.description
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { computed, onBeforeMount } from "vue";
import { useBlogStore } from "stores/blogs";
import { useFilters } from "/src/composables/filters";
const blogStore = useBlogStore();
const { formatBlogDate } = useFilters();

const blogs = computed(() => blogStore.allBlogs);
onBeforeMount(() => blogStore.getAllBlogs());

const blogColumns = [
  {
    name: "title",
    required: true,
    align: "left",
  },
];
</script>
