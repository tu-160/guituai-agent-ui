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
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { CheckOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '@/hooks/web/useDesign';

  import { baseHandler } from '../handler';
  import { HandlerEnum } from '../enum';

  export default defineComponent({
    name: 'ThemeColorPicker',
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
      const { prefixCls } = useDesign('setting-theme-picker');

      function handleClick(color: string) {
        props.event && baseHandler(props.event, color);
      }
      return {
        prefixCls,
        handleClick,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-theme-picker';

  .@{prefix-cls} {
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0;
    justify-content: space-between;

    &__item {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 2px;
      display: flex;

      svg {
        display: none;
      }

      &--active {
        border: 1px solid @primary-color;

        svg {
          display: inline-block;
          margin: 3px;
          font-size: 12px;
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
