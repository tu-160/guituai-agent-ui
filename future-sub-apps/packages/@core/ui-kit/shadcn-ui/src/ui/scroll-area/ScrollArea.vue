<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@future-core/shared/utils';

import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport,
} from 'radix-vue';

import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<
    {
      class?: any;
      onScroll?: (event: Event) => void;
      viewportProps?: { onScroll: (event: Event) => void };
    } & ScrollAreaRootProps
  >(),
  {
    onScroll: () => {},
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegatedProps"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      as-child
      class="h-full w-full rounded-[inherit]"
      @scroll="onScroll"
    >
      <slot></slot>
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
