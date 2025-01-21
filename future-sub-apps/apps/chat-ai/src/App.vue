<script setup lang="ts">
import LoginModal from '@/views/common/login/index.vue';
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <LoginModal />
</template>

<style lang="scss">
@use '@/design/index.scss';
</style>
