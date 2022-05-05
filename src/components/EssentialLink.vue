<template>
  <q-item class="curve-borders q-mx-md" clickable :to="path">
    <q-item-section v-if="icon" avatar>
      <q-icon size="md" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-h6">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
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
