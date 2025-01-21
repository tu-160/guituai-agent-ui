<script setup lang="ts">
import type { PrimitiveProps } from 'radix-vue';

import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import { Primitive } from 'radix-vue';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
  } & PrimitiveProps
>();
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-none transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        props.class,
      )
    "
    data-sidebar="group-action"
  >
    <slot></slot>
  </Primitive>
</template>
