<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="JSON数据格式" showOkBtn @ok="handleSubmit">
    <a-form layout="vertical">
      <div class="json-demo">
        <pre>
          // 示例
          [
            {
              "id":"fullName",
              "fullName":"名称"
            }
          ]
        </pre>
      </div>
      <a-form-item label="请输入JSON数据格式生成接口字段">
        <div class="formCodeEditor">
          <MonacoEditor class="h-full" ref="editorRef" v-model="state.jsonStr" language="json" />
        </div>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { MonacoEditor } from '@/components/CodeEditor';

  interface State {
    jsonStr: string;
  }

  const state = reactive<State>({
    jsonStr: '',
  });
  const emit = defineEmits(['register', 'confirm']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);

  function init() {
    state.jsonStr = '';
  }
  async function handleSubmit() {
    if (!state.jsonStr) return createMessage.warning('请输入JSON数据格式');
    const jsonStr = state.jsonStr.replace(/("\w+":)(?=[},])/g, '$1null');
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data)) throw 'error';
      emit('confirm', data);
      closeModal();
    } catch {
      createMessage.warning('JSON数据格式错误');
    }
  }
</script>
<style lang="less" scoped>
  .formCodeEditor {
    width: 100%;
    height: 260px;
    margin: 0 0 20px;
    padding: 0;
    border: 1px solid #c0c4cc;
    overflow: hidden;
  }
  .json-demo {
    width: 100%;
    background: #f4f4f5;
    border-radius: 4px;
    color: #909399;
    padding-top: 10px;
    pre {
      margin-left: -55px;
      font-size: 12px;
    }
  }
</style>
