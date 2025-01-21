<script setup lang="ts">
defineProps<{
  modelValue?: boolean;
}>();
</script>

<template>
  <RouterView>
    <template #default="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </template>
  </RouterView>
</template>
