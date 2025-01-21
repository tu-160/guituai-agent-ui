<script setup lang="ts">
import { Icon } from '@future-core/icons';
import { ScrollArea } from '@future-core/shadcn-ui';

import { getAllNodesNodeDefineList } from '../nodes/index';

const props = defineProps({
  lf: {
    type: Object,
    default: () => ({}),
  },
});

const nodes = getAllNodesNodeDefineList();

const mousedownFunc = (node: any) => {
  props.lf?.dnd.startDrag({
    type: node.type,
    properties: {
      progress: 60,
      width: 180,
      height: 280,
    },
  });
};
</script>

<template>
  <div class="f-lf-panel">
    <div class="f-lf-panel-header"></div>
    <div class="f-lf-panel-body select-none">
      <ScrollArea>
        <div
          v-for="item in nodes"
          :key="item.id"
          class="m-2 flex items-center rounded-sm border border-solid p-2 hover:shadow-md"
          @mousedown="mousedownFunc(item)"
        >
          <Icon :icon="item.icon" class="mr-2 text-lg" />
          <span>{{ item.name }}</span>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<style lang="scss">
.f-lf-panel {
  position: relative;
  z-index: 1;
  width: 200px;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  transition: width 0.3s ease-in-out;

  &-header {
    height: 0;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }

  &-body {
    height: calc(100% - 50px);
  }
}
</style>
