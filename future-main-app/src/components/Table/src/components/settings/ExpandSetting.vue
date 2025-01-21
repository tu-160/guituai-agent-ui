<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ isExpanded ? t('common.collapseAll') : t('common.expandAll') }}</span>
    </template>
    <double-left-outlined class="icon-collapse" @click="collapseAll" v-if="isExpanded" />
    <double-left-outlined class="icon-expand" @click="expandAll" v-else />
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { DoubleLeftOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'ExpandSetting',
    components: {
      DoubleLeftOutlined,
      Tooltip,
    },
    setup() {
      const table = useTableContext();
      const { t } = useI18n();

      const isExpanded = computed(() => {
        return table.getIsExpanded();
      });

      function expandAll() {
        table.expandAll();
      }
      function collapseAll() {
        table.collapseAll();
      }

      return { expandAll, collapseAll, t, isExpanded };
    },
  });
</script>
<style lang="less" scoped>
  .icon-collapse {
    transform: rotate(90deg);
  }
  .icon-expand {
    transform: rotate(270deg);
  }
</style>
