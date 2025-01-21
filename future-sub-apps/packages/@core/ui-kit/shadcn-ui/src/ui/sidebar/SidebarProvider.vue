<script setup lang="ts">
import { computed, type HTMLAttributes, type Ref, ref } from 'vue';

import { cn } from '@future-core/shared/utils';

import { useEventListener, useVModel } from '@vueuse/core';
import { TooltipProvider } from 'radix-vue';

import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_KEYBOARD_SHORTCUT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './utils';

const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean;
    open?: boolean;
    // eslint-disable-next-line perfectionist/sort-object-types
    class?: HTMLAttributes['class'];
  }>(),
  {
    defaultOpen: true,
    open: undefined,
  },
);

const emits = defineEmits<{
  'update:open': [open: boolean];
}>();

const isMobile = ref(false); // useIsMobile()
const openMobile = ref(false);

const open = useVModel(props, 'open', emits, {
  defaultValue: props.defaultOpen ?? false,
  passive: (props.open === undefined) as false,
}) as Ref<boolean>;

function setOpen(value: boolean) {
  open.value = value; // emits('update:open', value)

  // This sets the cookie to keep the sidebar state.
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${open.value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}

function setOpenMobile(value: boolean) {
  openMobile.value = value;
}

// Helper to toggle the sidebar.
function toggleSidebar() {
  return isMobile.value ? setOpenMobile(!open.value) : setOpen(!open.value);
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    toggleSidebar();
  }
});

// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
const state = computed(() => (open.value ? 'expanded' : 'collapsed'));

provideSidebarContext({
  isMobile,
  open,
  openMobile,
  setOpen,
  setOpenMobile,
  state,
  toggleSidebar,
});
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      :class="cn('group/sidebar-wrapper text-sidebar-foreground has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full', props.class)"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      }"
    >
      <slot :state="state" :toggle-sidebar="toggleSidebar"></slot>
    </div>
  </TooltipProvider>
</template>
