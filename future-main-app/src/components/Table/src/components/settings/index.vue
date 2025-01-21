<template>
  <div class="table-settings">
    <ExpandSetting v-if="getIsTreeTable && getSetting.expand" />
    <RedoSetting v-if="getSetting.redo" />
    <SizeSetting v-if="getSetting.size" />
    <ColumnSetting v-if="getSetting.setting" @columns-change="handleColumnChange" />
    <FullScreenSetting v-if="getSetting.fullScreen" />
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { TableSetting, ColumnChangeParam } from '../../types/table';
  import { defineComponent, computed, unref } from 'vue';
  import ColumnSetting from './ColumnSetting.vue';
  import SizeSetting from './SizeSetting.vue';
  import RedoSetting from './RedoSetting.vue';
  import ExpandSetting from './ExpandSetting.vue';
  import FullScreenSetting from './FullScreenSetting.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'TableSetting',
    components: {
      ExpandSetting,
      ColumnSetting,
      SizeSetting,
      RedoSetting,
      FullScreenSetting,
    },
    props: {
      setting: {
        type: Object as PropType<TableSetting>,
        default: () => ({}),
      },
    },
    emits: ['columns-change'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const table = useTableContext();

      const getSetting = computed((): TableSetting => {
        return {
          expand: true,
          redo: true,
          size: false,
          setting: true,
          fullScreen: false,
          ...props.setting,
        };
      });
      const getIsTreeTable = computed(() => {
        const getBindValues = table.getBindValues;
        return unref(getBindValues).isTreeTable;
      });

      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }

      function getTableContainer() {
        return table ? unref(table.wrapRef) : document.body;
      }

      return { getSetting, getIsTreeTable, t, handleColumnChange, getTableContainer };
    },
  });
</script>
<style lang="less">
  .table-settings {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 10px;
    }

    svg {
      width: 1.3em;
      height: 1.3em;
    }
  }
</style>
