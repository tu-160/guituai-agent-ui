<template>
  <div class="setting-type-picker">
    <template v-for="item in typeList || []" :key="item.title">
      <div @click="handler(item)" :class="[`type-picker__item`, { [`type-picker__item--active`]: def === item.type }]">
        <div class="type-picker__item-img">
          <img :src="def === item.type ? item.activeImg : item.img" />
          <div class="icon-checked" v-if="def === item.type">
            <CheckOutlined />
          </div>
        </div>
        <p class="type-picker__item-title">{{ item.title }}</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { menuTypeList, sysBgList } from '../enum';

  export default defineComponent({
    name: 'MenuTypePicker',
    components: { CheckOutlined },
    props: {
      typeList: {
        type: Array as PropType<typeof menuTypeList | typeof sysBgList>,
        default: () => [],
      },
      handler: {
        type: Function as PropType<Fn>,
        default: () => ({}),
      },
      def: {
        type: String,
        default: '',
      },
    },
  });
</script>
