@ -1,183 +0,0 @@
<template>
  <div class="center-container">
    <FlowButton ref="flowButtonRef" v-bind="getBindValue" v-if="!isPreview" @addVersion="handleAddVersion" />
    <template v-if="isPreview">
      <div class="tips">
        <div class="tips-item"><span class="icon past">●</span>已完成</div>
        <div class="tips-item"><span class="icon curr">●</span>进行中</div>
        <div class="tips-item"><span class="icon">●</span>无/未处理</div>
      </div>
      <div class="scale-slider" v-if="!noShowScale">
        <minus-outlined class="btn" @click="changeScale()" />
        <span class="num">{{ Math.floor(state.defaultZoom * 100) + '%' }}</span>
        <plus-outlined class="btn" @click="changeScale(true)" />
      </div>
    </template>
    <div class="center-container-center">
      <FutureBpmn v-bind="getBpmnBindValue" ref="FutureBpmnRef" @viewSubFlow="viewSubFlow" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, onMounted, nextTick } from 'vue';
  import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
  import FlowButton from './propPanel/components/FlowButton.vue';
  import FutureBpmn from './bpmn/index.vue';

  interface State {
    defaultZoom: number;
  }
  interface ComType {
    updateCanRedoAndUndo: () => any;
  }
  const props = defineProps(['flowInfo', 'nodeList', 'flowState', 'versionList', 'type', 'isPreview', 'noShowScale']);
  const emit = defineEmits(['viewSubFlow', 'addVersion']);
  defineExpose({ getElement, getBpmn });
  const state = reactive<State>({
    defaultZoom: 1, // 流程图缩放比例 100%
  });
  const FutureBpmnRef: any = ref(null);
  const flowButtonRef = ref<Nullable<ComType>>(null);

  const getBpmnBindValue = computed(() => ({
    flowXml: props.flowInfo?.flowXml,
    flowNodes: props.flowInfo?.flowNodes || {},
    nodeList: props.nodeList || [],
    type: props.type,
    isPreview: !!props.isPreview,
    disabled: !!props.isPreview || props.flowState === undefined || props.flowState !== 0,
  }));
  const getBindValue = computed(() => ({ ...props, element: getElement(), bpmn: getBpmn() }));

  function getElement() {
    return unref(FutureBpmnRef)?.getElement();
  }
  function getBpmn() {
    return unref(FutureBpmnRef)?.getBpmn();
  }
  function viewSubFlow(data) {
    emit('viewSubFlow', data);
  }
  /**
   * 控制流程图缩放，缩放介于50% - 220%
   * @param { boolean } isPlus - 是否放大
   */
  function changeScale(isPlus?) {
    if ((isPlus && state.defaultZoom > 2) || (!isPlus && state.defaultZoom < 0.6)) return;
    state.defaultZoom = Math.floor(state.defaultZoom * 100 + (isPlus ? 10 : -10)) / 100;
    getBpmn().get('canvas').zoom(state.defaultZoom);
  }
  function handleAddVersion() {
    emit('addVersion');
  }
  // 监听bpmn时间
  function handleInitListeners() {
    const bpmn = getBpmn();
    // 监听撤回重做
    bpmn?.on('commandStack.changed', () => {
      nextTick(() => (unref(flowButtonRef) as ComType)?.updateCanRedoAndUndo());
    });
  }

  onMounted(() => {
    handleInitListeners();
  });
</script>
<style lang="less">
  @import url('../style/index.less');
</style>
