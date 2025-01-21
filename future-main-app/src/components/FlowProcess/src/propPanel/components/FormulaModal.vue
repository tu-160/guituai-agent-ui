<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="公式编辑" :width="800" @ok="handleSubmit" destroyOnClose class="formula-modal">
    <div class="formula-modal-body">
      <div class="code-editor-area">
        <CodeEditor ref="editorRef" v-model:value="value" :mode="modeValue" class="json-editor" />
      </div>
      <div class="operation-area">
        <div class="area-item field-area">
          <div class="area-title">当前表单字段</div>
          <div class="area-content">
            <BasicTree ref="leftTreeRef" class="remove-active-tree" :treeData="fieldsOptions" defaultExpandAll @select="handleTreeSelect" />
          </div>
        </div>
        <div class="area-item formula-area">
          <div class="area-title">函数</div>
          <div class="area-content">
            <BasicTree ref="leftTreeRef" class="remove-active-tree" :treeData="formulaTree" defaultExpandAll @select="formulaNodeClick">
              <template #title="item">
                <div class="w-full" @mouseenter="formulaMouseenter(item)">{{ item.fullName }}</div>
              </template>
            </BasicTree>
          </div>
        </div>
        <div class="area-item formula-desc-area">
          <div class="area-title">{{ descTitle }}</div>
          <div class="area-content" v-html="descContent"></div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTree, TreeActionType } from '@/components/Tree';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import formulaData from '../../helper/formulaData';

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const editorRef = ref(null);
  const leftTreeRef = ref<Nullable<TreeActionType>>(null);
  const value = ref('');
  const fieldsOptions = ref<any[]>([]);
  const formulaTree = ref<any[]>(formulaData);
  const modeValue = ref<MODE>(MODE.JS);
  const descTitle = ref('');
  const descContent = ref('请从左侧面板选择字段名和函数');

  function init(data) {
    value.value = data.value;
    fieldsOptions.value = data.fieldsOptions;
  }
  function handleTreeSelect(keys) {
    if (!keys.length) return;
    (editorRef.value as any)?.insert('{' + keys[0] + '}');
  }
  function formulaNodeClick(keys) {
    if (!keys.length || keys[0] == 'maths') return;
    (editorRef.value as any)?.insert(keys[0] + '()', true);
  }
  function formulaMouseenter(item) {
    if (!item.desc) return;
    descContent.value = item.desc;
    descTitle.value = item.id;
  }
  function handleSubmit() {
    emit('confirm', value.value);
    closeModal();
  }
</script>
