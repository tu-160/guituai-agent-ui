<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@future-core/shared/utils';

import Sheet from '../sheet/Sheet.vue';
import SheetContent from '../sheet/SheetContent.vue';
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './utils';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class'];
    collapsible?: 'icon' | 'none' | 'offcanvas';
    side?: 'left' | 'right';
    variant?: 'floating' | 'inset' | 'sidebar';
  }>(),
  {
    collapsible: 'offcanvas',
    side: 'left',
    variant: 'sidebar',
  },
);

const { isMobile, openMobile, setOpenMobile, state } = useSidebar();
</script>

<template>
  <div v-if="collapsible === 'none'" :class="cn('bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col', props.class)" v-bind="$attrs">
    <slot></slot>
  </div>

  <Sheet v-else-if="isMobile" :open="openMobile" v-bind="$attrs" @update:open="setOpenMobile">
    <SheetContent
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
      }"
      class="bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden"
      data-mobile="true"
      data-sidebar="sidebar"
    >
      <div class="flex h-full w-full flex-col">
        <slot></slot>
      </div>
    </SheetContent>
  </Sheet>

  <div
    v-else
    :data-collapsible="state === 'collapsed' ? collapsible : ''"
    :data-side="side"
    :data-state="state"
    :data-variant="variant"
    class="group peer hidden md:block"
  >
    <!-- This is what handles the sidebar gap on desktop  -->
    <div
      :class="
        cn(
          'relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
        )
      "
    ></div>
    <div
      :class="
        cn(
          'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          props.class,
        )
      "
      v-bind="$attrs"
    >
      <div
        class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
        data-sidebar="sidebar"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
