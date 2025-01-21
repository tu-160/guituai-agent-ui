<template>
  <a-divider>数据选项</a-divider>
  <a-form-item class="flex justify-center">
    <future-radio v-model:value="activeData.__config__.dataType" :options="dataTypeOptions" optionType="button" buttonStyle="solid" @change="onDataTypeChange" />
  </a-form-item>
  <div class="options-list" v-if="activeData.__config__.dataType === 'static'">
    <template v-if="['treeSelect', 'cascader'].includes(activeData.__config__.futureKey)">
      <BasicTree ref="treeRef" :treeData="activeData.options" :actionList="actionList" />
      <div class="add-btn">
        <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addTreeItem" class="!px-0">添加父级</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="link" @click="openTreeModal(true, { options: activeData.options })" class="!px-0">批量编辑</a-button>
      </div>
    </template>
    <template v-else>
      <draggable v-model="activeData.options" :animation="300" group="selectItem" handle=".option-drag" itemKey="uuid">
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <i class="icon-ym icon-ym-darg" />
            </div>
            <a-input v-model:value="element.fullName" placeholder="选项名" />
            <a-input v-model:value="element.id" placeholder="选项值" />
            <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
              <i class="icon-ym icon-ym-btn-clearn" />
            </div>
          </div>
        </template>
      </draggable>
      <div class="add-btn">
        <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addSelectItem" class="!px-0">添加选项</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="link" @click="openModal(true, { options: activeData.options })" class="!px-0">批量编辑</a-button>
      </div>
    </template>
  </div>
  <div v-if="activeData.__config__.dataType === 'dictionary'">
    <a-form-item label="数据字典">
      <future-tree-select :options="dicOptions" v-model:value="activeData.__config__.dictionaryType" lastLevel allowClear @change="onDictionaryTypeChange" />
    </a-form-item>
    <a-form-item label="存储字段">
      <future-select v-model:value="activeData.props.value" placeholder="请选择" :options="valueOptions" />
    </a-form-item>
  </div>
  <div v-if="activeData.__config__.dataType === 'dynamic'">
    <a-form-item label="远端数据">
      <interface-modal :value="activeData.__config__.propsUrl" :title="activeData.__config__.propsName" popupTitle="远端数据" @change="onPropsUrlChange" />
    </a-form-item>
    <a-form-item label="存储字段">
      <a-auto-complete
        v-model:value="activeData.props.value"
        placeholder="请输入"
        :options="options"
        @focus="onFocus(activeData.props.value)"
        @search="debounceOnSearch(activeData.props.value)" />
    </a-form-item>
    <a-form-item label="显示字段">
      <a-auto-complete
        v-model:value="activeData.props.label"
        placeholder="请输入"
        :options="options"
        @focus="onFocus(activeData.props.label)"
        @search="debounceOnSearch(activeData.props.label)" />
    </a-form-item>
    <a-form-item label="子级字段" v-if="['treeSelect', 'cascader'].includes(activeData.__config__.futureKey)">
      <a-input v-model:value="activeData.props.children" placeholder="请输入" @change="onPropsChildrenChange" />
    </a-form-item>
    <a-form-item label="参数设置" v-if="activeData.__config__.templateJson?.length">
      <select-interface-btn
        :templateJson="activeData.__config__.templateJson"
        :fieldOptions="formFieldsOptions"
        :type="3"
        @fieldChange="onRelationFieldChange" />
    </a-form-item>
  </div>
  <a-divider></a-divider>
  <BatchOperate @register="registerBatchOperate" @confirm="onBatchOperateConfirm" />
  <TreeNodeModal ref="treeNodeRef" @confirm="onTreeNodeConfirm" />
  <TreeBatchOperate @register="registerTreeBatchOperate" @confirm="onBatchOperateConfirm" />
</template>
<script lang="ts" setup>
  import draggable from 'vuedraggable';
  import { onMounted, h, ref, unref } from 'vue';
  import { useDynamic } from '@/components/FormGenerator/src/hooks/useDynamic';
  import { useField } from '@/components/FormGenerator/src/hooks/useField';
  import { useModal } from '@/components/Modal';
  import BatchOperate from './BatchOperate.vue';
  import TreeBatchOperate from './TreeBatchOperate.vue';
  import TreeNodeModal from './TreeNodeModal.vue';
  import { InterfaceModal } from '@/components/CommonModal';
  import { BasicTree, TreeActionItem, TreeActionType } from '@/components/Tree';
  import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { SelectInterfaceBtn } from '@/components/Interface';

  const emit = defineEmits(['propsChildrenChange']);
  const props = defineProps(['activeData', 'dicOptions']);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeNodeRef = ref(null);
  const currentNode = ref<any>(null);
  const { options, debounceOnSearch, onFocus, initFieldData } = useField(props.activeData);
  const {
    onDataTypeChange,
    onDictionaryTypeChange,
    onPropsUrlChange,
    dataTypeOptions,
    valueOptions,
    addSelectItem,
    formFieldsOptions,
    onRelationFieldChange,
    onBatchOperateConfirm,
  } = useDynamic(props.activeData, initFieldData);
  const [registerBatchOperate, { openModal }] = useModal();
  const [registerTreeBatchOperate, { openModal: openTreeModal }] = useModal();
  const actionList: TreeActionItem[] = [
    {
      render: node => {
        return h(PlusOutlined, {
          class: 'ml-4px',
          title: '添加',
          onClick: () => {
            handleAdd(node);
          },
        });
      },
    },
    {
      render: node => {
        return h(FormOutlined, {
          class: 'ml-4px',
          title: '编辑',
          onClick: () => {
            handleEdit(node);
          },
        });
      },
    },
    {
      render: node => {
        return h(DeleteOutlined, {
          class: 'ml-4px',
          title: '删除',
          onClick: () => {
            handleDelete(node);
          },
        });
      },
    },
  ];

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }
  function handleAdd(node: any) {
    getTree().getSelectedNode(node.id);
    const data = getTree().getSelectedNode(node.id) as any;
    if (!Reflect.has(data, 'children')) data.children = [];
    currentNode.value = data.children;
    (unref(treeNodeRef) as any).openModal();
  }
  function handleEdit(node: any) {
    getTree().getSelectedNode(node.id);
    const data = getTree().getSelectedNode(node.id) as any;
    currentNode.value = data;
    (unref(treeNodeRef) as any).openModal(data);
  }
  function handleDelete(node: any) {
    props.activeData.__config__.defaultValue = [];
    getTree().deleteNodeByKey(node.id);
  }
  function addTreeItem() {
    (unref(treeNodeRef) as any).openModal();
    currentNode.value = props.activeData.options;
  }
  function onTreeNodeConfirm(data, isEdit) {
    if (!isEdit) return currentNode.value.push(data);
    getTree().updateNodeByKey(currentNode.value.id, data);
  }
  function onPropsChildrenChange() {
    emit('propsChildrenChange');
  }

  onMounted(() => initFieldData());
</script>
