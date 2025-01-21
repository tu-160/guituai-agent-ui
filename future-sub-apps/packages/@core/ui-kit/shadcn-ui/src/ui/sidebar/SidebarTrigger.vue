<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import { PanelLeft } from 'lucide-vue-next';

import Button from '../button/Button.vue';
import { useSidebar } from './utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button :class="cn('h-7 w-7', props.class)" data-sidebar="trigger" size="icon" variant="ghost" @click="toggleSidebar">
    <PanelLeft />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
