<template>
  <q-page class="flex flex-center">
    {{ $q.screen.lt }}
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
