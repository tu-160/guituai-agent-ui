<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@future-core/shared/utils';

import {
  Toggle,
  type ToggleEmits,
  type ToggleProps,
  useForwardPropsEmits,
} from 'radix-vue';

import { type ToggleVariants, toggleVariants } from './toggle';

const props = withDefaults(
  defineProps<
    {
      class?: any;
      size?: ToggleVariants['size'];
      variant?: ToggleVariants['variant'];
    } & ToggleProps
  >(),
  {
    disabled: false,
    size: 'default',
    variant: 'default',
  },
);

const emits = defineEmits<ToggleEmits>();

const delegatedProps = computed(() => {
  const { class: _, size: _size, variant: _variant, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <Toggle
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot></slot>
  </Toggle>
</template>
