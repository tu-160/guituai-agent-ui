<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@future-core/shared/utils';

import { ChevronUp } from 'lucide-vue-next';
import {
  SelectScrollUpButton,
  type SelectScrollUpButtonProps,
  useForwardProps,
} from 'radix-vue';

const props = defineProps<{ class?: any } & SelectScrollUpButtonProps>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <ChevronUp class="h-4 w-4" />
    </slot>
  </SelectScrollUpButton>
</template>
