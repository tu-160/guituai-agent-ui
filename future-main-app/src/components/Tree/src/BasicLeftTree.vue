<template>
  <div :class="[bem(), 'h-full']">
    <LeftTreeHeader
      :title="title"
      :helpMessage="helpMessage"
      :showToolbar="showToolbar"
      :dropDownActions="dropDownActions"
      :expandAll="expandAll"
      :checkAll="checkAll"
      @strictly-change="onStrictlyChange"
      @reload="reload"
      @clearSearch="searchValue = ''"
      :isAsync="!!loadData"
      v-if="title || dropDownActions.length">
      <template #headerTitle v-if="slots.headerTitle">
        <slot name="headerTitle"></slot>
      </template>
    </LeftTreeHeader>
    <div :class="bem('search')" v-if="showSearch">
      <InputSearch :placeholder="t('common.leftTreeSearchText')" allowClear v-model:value="searchValue" />
    </div>
    <BasicTree
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="fieldNames"
      :checkStrictly="checkStrictly"
      :load-data="loadData"
      @select="handleSelect"
      class="tree-main"
      ref="treeRef"
      :defaultExpandAll="defaultExpandAll"
      :actionList="actionList"
      :loading="loading">
      <template #title="data" v-if="slots.title">
        <slot name="title" v-bind="data"></slot>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch, useSlots, nextTick } from 'vue';
  import { InputSearch } from 'ant-design-vue';
  import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import type { FieldNames, DropDownActionItem, TreeActionType, KeyType, TreeActionItem } from './types/tree';
  import { BasicTree } from '@/components/Tree';
  import LeftTreeHeader from './components/LeftTreeHeader.vue';
  import { useDebounceFn } from '@vueuse/core';
  import { createBEM } from '@/utils/bem';
  import { useI18n } from '@/hooks/web/useI18n';
  import { TreeItem } from '@/components/Tree';

  const props = defineProps({
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    fieldNames: {
      type: Object as PropType<FieldNames>,
      default: () => ({ key: 'id', title: 'fullName' }),
    },
    dropDownActions: {
      type: Array as PropType<DropDownActionItem[]>,
      default: () => [],
    },
    treeData: {
      type: Array as PropType<TreeDataItem[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    loadData: {
      type: Function,
    },
    actionList: {
      type: Array as PropType<TreeActionItem[]>,
      default: () => [],
    },
  });
  const emit = defineEmits(['select', 'reload']);
  const [bem] = createBEM('basic-left-tree');
  const slots = useSlots();
  const { t } = useI18n();
  const searchValue = ref('');
  const checkStrictly = ref(false);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const debounceEmitChange = useDebounceFn(handleSearch, 200);

  watch(
    () => searchValue.value,
    v => {
      debounceEmitChange(v);
    },
  );
  watch(
    () => props.treeData,
    () => {
      nextTick(() => {
        if (props.defaultExpandAll) expandAll(true);
      });
    },
  );

  defineExpose({
    setSelectedKeys,
    getSelectedNode,
    updateNodeByKey,
    setExpandedKeys,
  });
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }
  function setExpandedKeys(keys: string[]) {
    return getTree().setExpandedKeys(keys);
  }
  function setSelectedKeys(keys: KeyType[]) {
    getTree().setSelectedKeys(keys);
  }
  function getSelectedNode(key: string) {
    return getTree().getSelectedNode(key);
  }
  function updateNodeByKey(key: string, node: Omit<TreeItem, 'key'>) {
    return getTree().updateNodeByKey(key, node);
  }
  function expandAll(expandAll: boolean) {
    getTree().expandAll(expandAll);
  }
  function checkAll(checkAll: boolean) {
    getTree().checkAll(checkAll);
  }
  function onStrictlyChange(strictly: boolean) {
    checkStrictly.value = strictly;
  }
  function handleSearch(value) {
    getTree().setSearchValue(value);
  }
  function reload() {
    searchValue.value = '';
    emit('reload');
  }
  function handleSelect(keys, { node }) {
    if (!keys.length) return;
    const nodePath: any[] = getNodePath(node);
    emit('select', keys[0], node, nodePath);
  }
  function getNodePath(node): any[] {
    let fullPath: any[] = [];
    const currNode = { ...node.dataRef };
    fullPath.push(currNode);
    if (node.parent) {
      const nodes = node.parent.nodes;
      fullPath = [...nodes, ...fullPath];
    }
    return fullPath;
  }
</script>
<style lang="less">
  @left-tree-prefix-cls: ~'@{namespace}-basic-left-tree';

  .@{left-tree-prefix-cls} {
    background-color: @component-background;
  }
</style>
<style lang="less" scoped>
  @left-tree-prefix-cls: ~'@{namespace}-basic-left-tree';

  .@{left-tree-prefix-cls} {
    display: flex;
    flex-direction: column;
    &__header {
      flex-shrink: 0;
    }
    &__search {
      flex-shrink: 0;
      padding: 10px;
    }
    .tree-main {
      flex: 1;
      overflow: hidden;
      :deep(.ant-spin-nested-loading) {
        height: 100%;
        .ant-spin-container {
          height: 100%;
        }
        .ant-tree-treenode {
          padding: 0 !important;
        }

        .ant-tree-switcher {
          line-height: 40px;
        }
        .ant-tree-node-content-wrapper {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
</style>
