<template>
  <div :class="getClass">
    <div :class="`${prefixCls}-content`" :style="{ 'justify-content': getContentPosition }">
      <slot name="content" v-if="slots.content"></slot>
      <BasicTitle :helpMessage="helpMessage" v-if="!slots.content && content">
        {{ content }}
      </BasicTitle>
    </div>
    <div :class="`${prefixCls}__action`" v-if="slots.action">
      <slot name="action" v-if="slots.action"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, useSlots } from 'vue';
  import BasicTitle from './BasicTitle.vue';
  import { useDesign } from '@/hooks/web/useDesign';

  const props = defineProps({
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    contentPosition: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'left',
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  });
  const slots = useSlots();
  const { prefixCls } = useDesign('basic-caption');
  const getClass = computed(() => [prefixCls, { [`${prefixCls}-border`]: props.bordered }]);
  const getContentPosition = computed(() => {
    if (props.contentPosition === 'left') return 'flex-start';
    if (props.contentPosition === 'right') return 'flex-end';
    return props.contentPosition;
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-caption';

  .@{prefix-cls} {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    word-break: break-all;
    padding-top: 10px;
    padding-bottom: 10px;
    &-border {
      border-bottom: 1px solid @border-color-base;
    }
    &-content {
      flex: 1;
      display: flex;
    }
    &__action {
      margin-left: 8px;
      flex-shrink: 0;
    }
  }
</style>
