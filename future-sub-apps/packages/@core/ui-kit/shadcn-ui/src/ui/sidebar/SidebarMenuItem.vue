<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <li :class="cn('group/menu-item relative', props.class)" data-sidebar="menu-item">
    <slot></slot>
  </li>
</template>
