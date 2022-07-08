<template>
  <q-page padding>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading">
        <user-profile />
      </div>
    </transition>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import UserProfile from "src/components/UserProfile.vue";

//Loading State
const loading = ref(true);
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
onMounted(() => {
  showLoading();
});
</script>
