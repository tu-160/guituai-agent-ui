<template>
  <div style="width: 100%">
    <div v-if="$slots.headerTop" style="margin: 5px">
      <slot name="headerTop"></slot>
    </div>
    <div class="flex items-center" :class="prefixCls">
      <div :class="`${prefixCls}__action`" v-if="$slots.tableTitle">
        <a-space :size="15">
          <slot name="tableTitle"></slot>
        </a-space>
      </div>
      <TableTitle :helpMessage="titleHelpMessage" :title="title" v-if="!$slots.tableTitle && title" />
      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar"></slot>
        <!-- <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" /> -->
        <TableSetting :setting="tableSetting" v-if="showTableSetting" @columns-change="handleColumnChange" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { Divider, Space } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '@/hooks/web/useDesign';

  export default defineComponent({
    name: 'BasicTableHeader',
    components: {
      Divider,
      ASpace: Space,
      TableTitle,
      TableSetting: TableSettingComponent,
    },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
      },
      tableSetting: {
        type: Object as PropType<TableSetting>,
      },
      showTableSetting: {
        type: Boolean,
      },
      titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: '',
      },
    },
    emits: ['columns-change'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-table-header');
      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }
      return { prefixCls, handleColumnChange };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header';

  .@{prefix-cls} {
    height: 60px;
    padding: 0 10px;
    &__toolbar {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      svg {
        width: 1.3em;
        height: 1.3em;
        cursor: pointer;
      }
    }
    &__action {
      display: flex;
      align-items: center;

      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
      .ant-btn-link {
        padding: 4px 0;
      }
    }
  }
</style>
