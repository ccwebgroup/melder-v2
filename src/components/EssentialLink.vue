<template>
  <q-item
    :class="$q.screen.lt.md ? 'round-border' : 'rounded-border'"
    clickable
    :to="path"
  >
    <q-item-section avatar>
      <q-icon size="md" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-h6">{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    name: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
});
</script>
