<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="请求接口" :closeFunc="onClose" :footer="null" :width="600" class="webhook-request-modal">
    <div class="main">
      <div class="mb-10px">向该接口发送请求，通过接口生成接口字段！</div>
      <a-input :value="getSysConfig.futureDomain + state.url" readonly>
        <template #addonAfter>
          <span class="cursor-pointer" @click="handleCopy(getSysConfig.futureDomain + state.url)">复制链接</span>
        </template>
      </a-input>
      <div class="mt-20px">
        <a-button type="primary" @click="handleRequest" v-if="!state.loading">接收请求</a-button>
        <template v-else>
          <a-alert message="请在3分钟内向URL发送一条GET或POST请求" type="warning" showIcon />
          <div class="tip" v-if="!state.isRetry">正在接收请求......</div>
          <template v-else>
            <div class="tip tip-error">当前URL没有接收到任何请求，是否重试？</div>
            <a-button type="primary" @click="handleRequest" class="mt-10px">重试</a-button>
          </template>
        </template>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCopyToClipboard } from '@/hooks/web/useCopyToClipboard';
  import { getWebhookParams, webhookStart } from '@/api/onlineDev/integrate';
  import { useAppStore } from '@/store/modules/app';

  interface State {
    url: string;
    randomStr: string;
    id: string;
    loading: boolean;
    isRetry: boolean;
    timer: any;
  }

  const state = reactive<State>({
    url: '',
    randomStr: '',
    id: '',
    loading: false,
    isRetry: false,
    timer: null,
  });

  const emit = defineEmits(['register', 'confirm']);
  const { createMessage } = useMessage();
  const appStore = useAppStore();
  const [registerModal, { closeModal }] = useModalInner(init);

  const getSysConfig = computed(() => appStore.getSysConfigInfo);

  function init(data) {
    state.url = data.url;
    state.randomStr = data.randomStr;
    state.id = data.id;
    state.loading = false;
    state.isRetry = false;
  }
  function handleCopy(text) {
    const { isSuccessRef } = useCopyToClipboard(text);
    unref(isSuccessRef) && createMessage.success('复制成功');
  }
  function handleRequest() {
    webhookStart(state.id, state.randomStr).then(_ => {
      state.loading = true;
      state.isRetry = false;
      state.timer = setInterval(() => {
        handleWebhookParams();
      }, 1000);
      setTimeout(() => {
        clearTimer();
        state.isRetry = true;
      }, 180000);
    });
  }
  function clearTimer() {
    if (!state.timer) return;
    clearInterval(state.timer);
    state.timer = null;
  }
  function handleWebhookParams() {
    getWebhookParams(state.randomStr)
      .then(res => {
        if (res?.data.length) {
          emit('confirm', res.data);
          clearTimer();
          closeModal();
        }
      })
      .catch(() => {
        clearTimer();
        state.isRetry = true;
      });
  }
  async function onClose() {
    clearTimer();
    return true;
  }
</script>
<style lang="less">
  .webhook-request-modal {
    .main {
      height: 300px;
      .tip {
        margin-top: 10px;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        color: @primary-color;
        background-color: @app-main-background;
        &.tip-error {
          color: @error-color;
        }
      }
    }
  }
</style>
