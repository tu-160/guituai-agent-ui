<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@future-core/shared/utils';

import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  useForwardPropsEmits,
} from 'radix-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{ class?: any } & TooltipContentProps>(),
  {
    class: '',
    side: 'right',
    sideOffset: 5,
  },
);

const emits = defineEmits<TooltipContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'bg-accent text-accent-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-border shadow-float z-[1000] overflow-hidden rounded-sm border px-4 py-2 text-xs',
          props.class,
        )
      "
    >
      <slot></slot>
    </TooltipContent>
  </TooltipPortal>
</template>
