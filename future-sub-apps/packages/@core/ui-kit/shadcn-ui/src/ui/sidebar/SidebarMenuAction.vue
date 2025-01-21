<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import { Primitive, type PrimitiveProps } from 'radix-vue';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      showOnHover?: boolean;
    } & PrimitiveProps
  >(),
  {
    as: 'button',
  },
);
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-none transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        props.class,
      )
    "
    data-sidebar="menu-action"
  >
    <slot></slot>
  </Primitive>
</template>
