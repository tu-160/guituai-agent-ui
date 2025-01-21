<template>
  <div :class="prefixCls">
    <template v-for="color in colorList || []" :key="color">
      <span
        @click="handleClick(color)"
        :class="[
          `${prefixCls}__item`,
          {
            [`${prefixCls}__item--active`]: def === color,
            [`${prefixCls}__item--black`]: color == '#ffffff',
          },
        ]"
        :style="{ background: color }">
        <CheckOutlined />
      </span>
    </template>
    <div
      :class="[
        `${prefixCls}__item`,
        'custom-item',
        {
          [`${prefixCls}__item--active`]: !colorList.includes(def as string),
        },
      ]">
      <CheckOutlined />
      <FutureColorPicker v-model:value="customColor" :allowClear="false" class="custom-item_picker" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watch } from 'vue';
  import { CheckOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '@/hooks/web/useDesign';

  import { baseHandler } from '../handler';
  import { HandlerEnum } from '../enum';

  export default defineComponent({
    name: 'MainThemeColorPicker',
    components: { CheckOutlined },
    props: {
      colorList: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      event: {
        type: Number as PropType<HandlerEnum>,
      },
      def: {
        type: String,
      },
    },
    setup(props) {
      const customColor: any = ref('');
      const { prefixCls } = useDesign('setting-main-theme-picker');

      watch(
        () => props.def,
        color => {
          customColor.value = color;
        },
        { immediate: true },
      );
      watch(
        () => customColor.value,
        color => {
          props.event && baseHandler(props.event, color);
        },
      );

      function handleClick(color: string) {
        props.event && baseHandler(props.event, color);
      }

      return {
        prefixCls,
        handleClick,
        customColor,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-main-theme-picker';

  .@{prefix-cls} {
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0;
    justify-content: flex-start;

    &__item {
      width: 28px;
      height: 28px;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: flex;
      margin-right: 20px;
      &.custom-item {
        background-image: url('../../../../assets/images/settings/customColor.png');
        position: relative;
        overflow: hidden;
        .custom-item_picker {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 100;
        }
        .future-color-picker,
        .ant-color-picker__color {
          opacity: 0;
        }
      }

      svg {
        display: none;
      }

      &--active {
        svg {
          display: inline-block;
          margin: 5px;
          font-size: 16px;
          fill: @white !important;
        }
      }
      &--black {
        svg {
          fill: #000 !important;
        }
      }
    }
  }
</style>
