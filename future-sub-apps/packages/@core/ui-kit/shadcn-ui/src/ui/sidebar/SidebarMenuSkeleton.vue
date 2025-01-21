<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import Skeleton from '../skeleton/Skeleton.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  showIcon?: boolean;
}>();

const width = computed(() => {
  return `${Math.floor(Math.random() * 40) + 50}%`;
});
</script>

<template>
  <div :class="cn('flex h-8 items-center gap-2 rounded-md px-2', props.class)" data-sidebar="menu-skeleton">
    <Skeleton v-if="showIcon" class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />

    <Skeleton :style="{ '--skeleton-width': width }" class="h-4 max-w-[--skeleton-width] flex-1" data-sidebar="menu-skeleton-text" />
  </div>
</template>
