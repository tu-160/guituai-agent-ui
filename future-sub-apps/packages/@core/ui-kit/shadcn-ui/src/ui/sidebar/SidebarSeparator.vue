<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import Separator from '../separator/Separator.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <Separator :class="cn('bg-sidebar-border mx-2 w-auto', props.class)" data-sidebar="separator">
    <slot></slot>
  </Separator>
</template>
