<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue';

import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    lf: any;
    open: boolean;
    title?: string;
  }>(),
  {
    open: false,
    title: '',
  },
);
const emit = defineEmits<{
  (e: 'update:open', open: boolean): void;
}>();
const size = ref<DrawerProps['size']>('large');
// const lfInstance = inject('logicFlowInstance');

const onClose = () => {
  emit('update:open', false);
};
</script>
<template>
  <!-- a-drawer :closable="false" :mask="false" :open="props.open" :size="size" class="f-flow-drawer" @close="onClose" -->
  <a-drawer :closable="false" :open="props.open" :size="size" class="f-flow-drawer" @close="onClose">
    <slot :close="onClose"></slot>
  </a-drawer>
</template>

<style lang="scss">
.f-flow-drawer {
  .ant-drawer-body {
    @apply py-0;
  }
}
</style>
