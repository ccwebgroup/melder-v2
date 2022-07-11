<template>
  <q-page padding>
    <div>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-card flat v-show="!loading">
          <q-card-section v-if="user">
            <q-avatar size="120px" color="grey-5">
              <q-img
                v-if="user.photoURL"
                :src="user.photoURL"
                alt=""
                loading="eager"
              />
              <q-icon v-else color="white" size="50px" name="fas fa-user" />
            </q-avatar>

            <!-- Profile Details -->
            <div class="profile">
              <div class="text-subtitle2">
                <q-icon class="q-mr-sm" name="person" color="primary" />
                <span>{{ user.displayName }}</span>
              </div>
              <div class="text-caption">
                <q-icon class="q-mr-sm" name="email" color="primary" />
                <span>{{ user.email }}</span>
              </div>
            </div>
          </q-card-section>
          <q-separator spaced />

          <q-card-section v-if="user">
            <!-- List of Social Links -->
            <q-item-label class="q-mb-sm">Social</q-item-label>
            <q-list dense style="max-width: 500px">
              <q-item v-for="link in user.social_links" :key="link.platform">
                <q-item-section avatar>
                  <q-icon
                    class="text-primary"
                    size="xs"
                    :name="'ti-' + link.platform.toLowerCase()"
                  />
                </q-item-section>

                <q-item-section
                  @click="openLink(link)"
                  class="cursor-pointer text-primary"
                >
                  <q-item-label>{{ link.username }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </transition>
    </div>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "stores/users";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const $route = useRoute();
const loading = ref(true);
const user = computed(() => userStore.userProfile);
const getUser = () => userStore.getUserProfile($route.params.id);
getUser();

const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};

setTimeout(() => {
  loading.value = false;
}, 1600);
</script>
