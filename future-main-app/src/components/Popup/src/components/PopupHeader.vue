<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-left`">
      <span @click="handleClose" v-if="showBackIcon">
        <ArrowLeftOutlined :class="`${prefixCls}__back`" />
      </span>
      <slot name="title" v-if="$slots.title"></slot>
      <BasicTitle :helpMessage="helpMessage" v-if="!$slots.title">
        {{ title }}
      </BasicTitle>
    </div>
    <div :class="`${prefixCls}__toolbar`">
      <slot name="insertToolbar"></slot>
      <a-button
        :type="continueType"
        @click="handleContinue"
        :loading="continueLoading"
        :disabled="confirmLoading"
        class="ml-10px"
        v-bind="continueButtonProps"
        v-if="showContinueBtn">
        {{ continueText }}
      </a-button>
      <a-button
        :type="okType"
        @click="handleOk"
        v-bind="okButtonProps"
        class="ml-10px"
        :loading="confirmLoading"
        :disabled="okButtonProps?.disabled || continueLoading"
        v-if="showOkBtn">
        {{ okText }}
      </a-button>
      <slot name="centerToolbar"></slot>
      <a-button v-bind="cancelButtonProps" @click="handleClose" class="ml-10px" v-if="showCancelBtn">
        {{ cancelText }}
      </a-button>
      <slot name="appendToolbar"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTitle } from '@/components/Basic';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { headerProps } from '../props';
  export default defineComponent({
    name: 'BasicPopupHeader',
    inheritAttrs: false,
    components: { BasicTitle, ArrowLeftOutlined },
    props: {
      ...headerProps,
    },
    emits: ['close', 'ok', 'continue'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-popup-header');

      function handleOk() {
        emit('ok');
      }
      function handleContinue(e: Event) {
        emit('continue', e);
      }
      function handleClose() {
        emit('close');
      }

      return { prefixCls, handleOk, handleContinue, handleClose };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-popup-header';
  @footer-height: 60px;
  .@{prefix-cls} {
    flex-shrink: 0;
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-bottom: 1px solid @border-color-base;
    box-sizing: border-box;
    &-left {
      display: flex;
      align-items: center;
    }

    &__back {
      padding-right: 16px;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }
    &__toolbar {
      display: flex;
      align-items: center;
    }
  }
</style>
