<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {reactive} from "vue";
const { t } = useI18n();

const modelRt = reactive({
  visible: false,
  agentId: '158a29c2c77a11efbb8400155daf14ef',
});

const showModal = () => {
  modelRt.visible = true;
}

const handleOk = () => {
  console.log('点击了确定');
  modelRt.visible = false;
};

const handleCancel = () => {
  console.log('点击了取消');
  modelRt.visible = false;
};

const copyAgentId = () => {
  console.log('复制 Agent ID');
}

// 定位一个宏，用于在其它页面调用时引入调用
defineExpose({showModal})

</script>

<template>
  <div>
    <a-modal
        :open="modelRt.visible"
        title="嵌入网站"
        @ok="handleOk"
        @cancel="handleCancel"
        style="width: 550px;"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="全屏嵌入">
          <p>将以下iframe嵌入您的网站处于所需位置</p>
          <pre style="background: #f5f5f5; padding: 0px;">
            &lt;iframe
              src="http://localhost:9222/chat/share?shared_id=158a29c2c77a11efbb8400155daf14ef&amp;from=agent"
              style="width: 100%; height: 100%; min-height: 600px"
              frameborder="0"
            &gt;
            &lt;/iframe&gt;
          </pre>
        </a-tab-pane>
        <a-tab-pane key="2" tab="部分嵌入">
          <p>即将推出</p>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Chrome 插件">
          <p>即将推出</p>
        </a-tab-pane>
      </a-tabs>
      <p>Agent ID</p>
      <a-input v-model="modelRt.agentId" placeholder="Agent ID" />
      <a-button type="primary" @click="copyAgentId">复制 Agent ID</a-button>
    </a-modal>
  </div>
</template>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 00px;
}
</style>
