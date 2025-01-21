<template>
  <span :class="getClass">
    <DownOutlined :style="getStyle" />
  </span>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useAttrs } from '@/hooks/core/useAttrs';

  const props = defineProps({
    /**
     * Arrow expand state
     */
    expand: { type: Boolean },
    /**
     * Arrow up by default
     */
    up: { type: Boolean },
    /**
     * Arrow down by default
     */
    down: { type: Boolean },
    /**
     * Cancel padding/margin for inline
     */
    inset: { type: Boolean },
  });
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const { prefixCls } = useDesign('basic-arrow');

  // get component class
  const getClass = computed(() => {
    const { expand, up, down, inset } = props;
    return [
      prefixCls,
      {
        [`${prefixCls}--active`]: expand,
        up,
        inset,
        down,
      },
    ];
  });
  const getStyle = computed(() => unref(attrs)?.iconStyle || {});
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-arrow';

  .@{prefix-cls} {
    display: inline-block;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &--active {
      transform: rotate(0deg);
    }

    &.inset {
      line-height: 0px;
    }

    &.up {
      transform: rotate(-180deg);
    }

    &.down {
      transform: rotate(0deg);
    }

    &.up.@{prefix-cls}--active {
      transform: rotate(0deg);
    }

    &.down.@{prefix-cls}--active {
      transform: rotate(-180deg);
    }
  }
</style>
