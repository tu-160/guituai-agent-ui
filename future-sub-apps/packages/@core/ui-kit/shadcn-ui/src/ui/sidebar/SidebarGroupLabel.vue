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
        'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        props.class,
      )
    "
    data-sidebar="group-label"
  >
    <slot></slot>
  </Primitive>
</template>
