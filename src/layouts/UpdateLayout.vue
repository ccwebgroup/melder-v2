<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-btn @click="$router.go(-1)" no-caps flat icon="arrow_back" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>
  </q-layout>
</template>
