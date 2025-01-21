<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import { Primitive, type PrimitiveProps } from 'radix-vue';

import { type SidebarMenuButtonVariants, sidebarMenuButtonVariants } from '.';

export interface SidebarMenuButtonProps extends PrimitiveProps {
  class?: HTMLAttributes['class'];
  isActive?: boolean;
  size?: SidebarMenuButtonVariants['size'];
  variant?: SidebarMenuButtonVariants['variant'];
}

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: 'button',
  size: 'default',
  variant: 'default',
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(sidebarMenuButtonVariants({ variant, size }), props.class)"
    :data-active="isActive"
    :data-size="size"
    data-sidebar="menu-button"
    v-bind="$attrs"
  >
    <slot></slot>
  </Primitive>
</template>
