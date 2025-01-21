<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import Input from '../input/Input.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <Input :class="cn('bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2', props.class)" data-sidebar="input">
    <slot></slot>
  </Input>
</template>
