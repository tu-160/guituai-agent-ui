<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <ul :class="cn('flex w-full min-w-0 flex-col gap-1', props.class)" data-sidebar="menu">
    <slot></slot>
  </ul>
</template>
