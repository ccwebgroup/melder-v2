<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary-dark text-white">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.lt.md"
          icon="arrow_back"
          flat
          size="16px"
          @click="$router.go(-1)"
          label="back"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
