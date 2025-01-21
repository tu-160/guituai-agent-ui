<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="表单脚本"
    helpMessage="小程序不支持在线JS脚本"
    :width="1000"
    @ok="handleSubmit"
    destroyOnClose
    class="form-script-modal">
    <div class="form-script-modal-body">
      <div class="left-board">
        <BasicTree ref="leftTreeRef" class="remove-active-tree" :treeData="treeData" defaultExpandAll @select="handleTreeSelect" />
      </div>
      <div class="main-board">
        <div class="main-board-editor">
          <MonacoEditor ref="editorRef" v-model="text" />
        </div>
        <div class="main-board-tips">
          <p>请从左侧面板选择的字段名，支持JavaScript的脚本，<ScriptDemo :type="type" /></p>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTree, TreeActionType } from '@/components/Tree';
  import { MonacoEditor } from '@/components/CodeEditor';
  import ScriptDemo from './ScriptDemo.vue';

  const props = defineProps(['treeTitle', 'drawingList', 'type']);
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const editorRef = ref(null);
  const leftTreeRef = ref<Nullable<TreeActionType>>(null);
  const text = ref('');
  const treeData = ref<any[]>([]);

  function init(data) {
    text.value = data.text;
    getTreeList();
  }
  function getTreeList() {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.futureKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__) {
        if (data.__config__.futureKey === 'table') {
          let item: Recordable = {
            id: data.__vModel__,
            fullName: data.__config__.label,
            children: [],
          };
          let children: any[] = [];
          if (data.__config__.children && Array.isArray(data.__config__.children) && data.__config__.children.length) {
            for (let i = 0; i < data.__config__.children.length; i++) {
              const child = data.__config__.children[i];
              if (child.__vModel__) {
                children.push({ id: data.__vModel__ + '.' + child.__vModel__, fullName: child.__config__.label });
              }
            }
          }
          item.children = children;
          list.push(item);
        } else {
          list.push({ id: data.__vModel__, fullName: data.__config__.label });
        }
      }
    };
    loop(unref(props.drawingList));
    const topItem = {
      id: (+new Date()).toString(),
      fullName: props.treeTitle,
      top: true,
      children: list,
    };
    treeData.value = [topItem];
  }

  function handleTreeSelect(keys) {
    if (!keys.length) return;
    const leftTree = unref(leftTreeRef);
    const selectedNode: any = leftTree?.getSelectedNode(keys[0]);
    if (selectedNode.top || selectedNode.children) return;
    (editorRef.value as any)?.insert(keys[0]);
  }
  function handleSubmit() {
    emit('confirm', text.value);
    closeModal();
  }
</script>
