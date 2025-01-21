<template>
  <ScrollContainer class="layout-area !p-0" :class="`${prefixCls}`">
    <template v-if="layout.length">
      <grid-layout :layout.sync="layout" :row-height="40">
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          :maxH="item.maxH"
          :minH="item.minH"
          :minW="item.minW"
          :maxW="item.maxW"
          @resized="resizedEvent(item.i, item)"
          @moved="movedEvent"
          :static="!!enabledLock">
          <Parser :item="item" :detailed="true" />
          <div class="mask" v-if="mask && !noNeedMaskList.includes(item.futureKey)"></div>
        </grid-item>
      </grid-layout>
    </template>
    <div class="portal-layout-nodata" v-else>
      <future-empty :image="emptyImage" />
    </div>
  </ScrollContainer>
</template>
<script lang="ts" setup>
  import { inject } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import Parser from '../../Design/components/Parser.vue';
  import { noNeedMaskList } from '../../Design/helper/dataMap';
  import { useDesign } from '@/hooks/web/useDesign';
  import emptyImage from '@/assets/images/dashboard-nodata.png';

  defineProps({
    layout: { type: Array as PropType<any[]>, default: () => [] },
    mask: { type: Boolean, default: false },
    detailed: { type: Boolean, default: false },
    enabledLock: { type: Number, default: 1 },
  });
  const emitter: any = inject('emitter');
  const { prefixCls } = useDesign('basic-portal');
  const emit = defineEmits(['register', 'layoutUpdatedEvent']);

  function movedEvent() {
    emit('layoutUpdatedEvent');
  }
  function resizedEvent(i, item) {
    emitter.emit('eChart' + i);
    const loop = data => {
      if (data.children && item.children.length) {
        data.children.map(ele => {
          if (ele.futureKey) emitter.emit('eChart' + ele.i);
          if (ele.children && ele.children.length) loop(ele);
        });
      }
    };
    loop(item);
    movedEvent();
  }
</script>
<style lang="less" scoped>
  .layout-area {
    height: 100%;
    :deep(.ant-card) {
      width: 100%;
      height: 100%;
      .el-card__body {
        padding: 0;
      }
    }
  }
</style>
