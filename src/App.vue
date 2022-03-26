<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();

onBeforeMount(() => {
  authStore.handleAuthStateChanged();
});
</script>
