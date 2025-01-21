<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('w-full text-sm', props.class)" data-sidebar="group-content">
    <slot></slot>
  </div>
</template>
