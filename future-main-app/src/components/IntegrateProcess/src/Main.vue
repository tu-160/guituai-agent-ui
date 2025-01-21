<template>
  <div class="process-flow-container">
    <div class="scale-slider">
      <span class="btn">
        <minus-outlined @click="changeScale(-step)" />
      </span>
      <span class="num">{{ scaleVal }}%</span>
      <span class="btn">
        <plus-outlined @click="changeScale(step)" />
      </span>
    </div>
    <FlowCard v-bind="getBindValue" @emits="eventReceiver" :key="key" :style="{ transform: `scale(${scaleVal / 100})` }" v-if="data" />
    <PropPanel :value="activeData" :processData="data" :formInfo="formInfo" @confirm="onPropEditConfirm" @cancel="onClosePanel" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, computed } from 'vue';
  import { NodeUtils, getMockData } from './helper/util';
  import FlowCard from './flowCard/index.vue';
  import PropPanel from './propPanel/index.vue';
  import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
  import { omit } from 'lodash-es';

  interface State {
    data: any;
    scaleVal: number;
    step: number;
    key: number;
    activeData: any;
    verifyMode: boolean;
  }

  defineExpose({ getData });
  const props = defineProps(['conf', 'formInfo']);
  const state = reactive<State>({
    verifyMode: false,
    data: null, // 数据
    scaleVal: 100, // 流程图缩放比例 100%
    step: 5, // 缩放步长
    key: +new Date(),
    activeData: null, // 被激活的节点卡片数据，用于属性面板编辑
  });
  const { data, scaleVal, step, key, activeData } = toRefs(state);
  const getBindValue = computed(() => ({ ...omit(props, 'conf'), data: state.data, verifyMode: state.verifyMode }));

  /**
   * 接收所有FlowCard事件触发
   * @param { Object } data - 含有event(事件名称)/args(参数)两个属性
   */
  function eventReceiver({ event, args }) {
    if (event === 'edit') {
      state.activeData = args[0]; // 打开属性面板
      return;
    }
    NodeUtils[event](...args);
    forceUpdate();
  }
  function forceUpdate() {
    state.key = +new Date();
  }
  /**
   * 控制流程图缩放
   * @param { Object } val - 缩放增量 是step的倍数
   */
  function changeScale(val) {
    // 缩放介于0%~200%
    if (state.scaleVal < 0 || state.scaleVal > 200) return;
    if (state.scaleVal === 200 && state.scaleVal + val > 200) return;
    if (state.scaleVal === 0 && state.scaleVal + val < 0) return;
    state.scaleVal += val;
  }
  /**
   * 属性面板提交事件
   * @param { Object } value - 被编辑的节点的properties属性对象
   */
  function onPropEditConfirm(value, content) {
    state.activeData.content = content || '请设置';
    state.activeData.properties = value;
    onClosePanel();
    forceUpdate();
  }
  // 属性面板取消事件
  function onClosePanel() {
    state.activeData = null;
  }
  // 供父组件使用 获取表单JSON
  function getData() {
    return new Promise((resolve, reject) => {
      state.verifyMode = true;
      if (NodeUtils.checkAllNode(state.data)) {
        resolve({ data: state.data });
      } else {
        reject({ msg: '' });
      }
    });
  }

  onMounted(() => {
    if (props.conf !== null && typeof props.conf === 'object' && JSON.stringify(props.conf) !== '{}') {
      state.data = props.conf;
    } else {
      state.data = getMockData(props.formInfo.type || 1);
    }
  });
</script>
