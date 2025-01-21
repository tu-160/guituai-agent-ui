<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #icon v-if="$slots.icon || preIcon">
      <slot name="icon">
        <i :class="[preIcon, 'button-preIcon']"></i>
      </slot>
    </template>
    <template #default="data">
      <slot v-bind="data || {}"></slot>
      <i :class="[postIcon, 'button-postIcon']" v-if="postIcon"></i>
    </template>
  </Button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button } from 'ant-design-vue';
  export default defineComponent({
    name: 'AButton',
    inheritAttrs: false,
    extends: Button,
  });
</script>
<script lang="ts" setup>
  import { computed, unref } from 'vue';

  import { buttonProps } from './props';
  import { useAttrs } from '@/hooks/core/useAttrs';

  const props: any = defineProps(buttonProps);
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled, type } = props;
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`ant-btn-${type}`]: type && ['warning', 'error'].includes(type),
        [`is-disabled`]: disabled,
      },
    ];
  });

  // get inherit binding value
  const getBindValue = computed(() => ({ ...unref(attrs), ...props, type: !props.type || ['warning', 'error'].includes(props.type) ? 'default' : props.type }));
</script>
<style lang="less" scoped>
  .ant-btn {
    .button-preIcon,
    .button-postIcon,
    i {
      font-size: 14px;
    }
    :deep(.button-preIcon + span),
    :deep(i + span) {
      margin-left: 5px;
    }
    .button-postIcon {
      margin-left: 5px;
    }
  }
</style>
