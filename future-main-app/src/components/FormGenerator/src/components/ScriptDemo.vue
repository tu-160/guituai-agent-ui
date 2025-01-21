<template>
  <a-popover overlayClassName="script-demo-popover" @openChange="onOpenChange">
    <template #title>
      <div class="script-demo-popover-title">参数介绍及使用示例</div>
    </template>
    <template #content>
      <div class="script-demo-popover-main" :style="{ height: editorHeight }">
        <MonacoEditor :options="editorOptions" v-model="currentContent" />
      </div>
    </template>
    <span class="link-text">参数介绍及使用示例</span>
  </a-popover>
</template>

<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { MonacoEditor } from '@/components/CodeEditor';

  interface State {
    currentContent: string;
    editorOptions: any;
    editorHeight: string;
  }

  const props = defineProps({
    type: {
      type: String,
      default: 'formField',
    },
  });
  const state = reactive<State>({
    currentContent: '',
    editorOptions: {
      readOnly: true,
      lineNumbers: 'off',
      minimap: { enabled: false },
    },
    editorHeight: '500px',
  });
  const { currentContent, editorOptions, editorHeight } = toRefs(state);
  const commonContent = `\n// onlineUtils--在线js工具类\n// 获取用户信息\nconst userInfo = onlineUtils.getUserInfo()\n// 获取设备信息\nconst deviceInfo = onlineUtils.getDeviceInfo()\n// 请求接口(url,method='get',data,headers)\nonlineUtils.request('url', 'get', { param: '1' }, { header: '1' })\n// 路由跳转(url,type) (type仅移动端支持)\nonlineUtils.route('url')\n// 消息提示(message,type='info',duration=3000)\nonlineUtils.toast('message', 'info', 3000)`;
  const formContent = `// formData--表单数据\nconsole.log(formData)\n// setFormData--设置表单某个组件数据(prop,value)\nsetFormData('key', 'value')\n// setShowOrHide--设置显示或隐藏(prop,value)\nsetShowOrHide('key', true)\n// setRequired--设置必填项(prop,value)\nsetRequired('key', true)\n// setDisabled--设置禁用项(prop,value)\nsetDisabled('key', true)`;
  const formFieldContent = `// data--当前组件的选中数据\nconsole.log(data)\n// rowIndex--当前行下标(仅在子表中可用)\nconsole.log(rowIndex)\n` + formContent;
  const btnEventContent = `// data--列表当前行数据\nconsole.log(data)\n// index--列表当前行下标\nconsole.log(index)\n// refresh--刷新列表\nrefresh()`;
  const afterOnloadContent = `// data--列表行数据\nconsole.log(data)\n// tableRef--表格DOM元素\nconsole.log(tableRef)`;
  const rowStyleContent = `// row--列表行数据\n// rowIndex--列表行下标\n({ row, rowIndex }) => {\r\n   return {\r\n      background: rowIndex%2==0 ? 'red' : 'blue'\r\n   }\r\n}`;
  const cellStyleContent = `// row--列表行数据\n// column--列表列数据\n// rowIndex--列表行下标\n// columnIndex--列表列下标\n({ row, column, rowIndex, columnIndex }) => {\r\n    return {\r\n        color: rowIndex%2 == 0 ? 'blue' : 'red'\r\n    }\r\n}`;
  const btnEnableContent = `// row--列表行数据\n// rowIndex--列表行下标\n({ row, rowIndex, onlineUtils}) => {\r\n   return row.status==1\r\n}`;

  function onOpenChange(val) {
    if (!val) return;
    if (props.type === 'form') {
      state.currentContent = formContent + commonContent;
      state.editorHeight = '420px';
      return;
    }
    if (props.type === 'btnEvent') {
      state.currentContent = btnEventContent + commonContent;
      state.editorHeight = '350px';
      return;
    }
    if (props.type === 'afterOnload') {
      state.currentContent = afterOnloadContent + commonContent;
      state.editorHeight = '310px';
      return;
    }
    if (props.type === 'rowStyle') {
      state.currentContent = rowStyleContent;
      state.editorHeight = '140px';
      return;
    }
    if (props.type === 'cellStyle') {
      state.currentContent = cellStyleContent;
      state.editorHeight = '180px';
      return;
    }
    if (props.type === 'btnEnableRule') {
      state.currentContent = btnEnableContent + commonContent;
      state.editorHeight = '330px';
      return;
    }
    state.currentContent = formFieldContent + commonContent;
  }
</script>

<style lang="less">
  .script-demo-popover {
    .script-demo-popover-title {
      padding: 6px 0;
      font-size: 16px;
    }
    .script-demo-popover-main {
      width: 430px;
    }
  }
</style>
