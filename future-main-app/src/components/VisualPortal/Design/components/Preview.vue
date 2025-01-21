<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    defaultFullscreen
    :footer="null"
    :closable="false"
    :keyboard="false"
    destroyOnClose
    class="future-full-modal full-modal future-preview-portal-modal designer-modal">
    <template #title>
      <div class="future-full-modal-header">
        <div class="header-title">
          <img src="@/assets/images/future.png" class="header-logo" />
          <span class="header-dot"></span>
          <p class="header-txt">门户预览</p>
        </div>
        <a-space class="options-box" :size="10">
          <a-button @click="closeModal()">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div class="main !p-0 h-full" v-loading="loading">
      <div class="custom-page" v-if="type === 1">
        <component :is="currentView" v-if="linkType === 0" />
        <embed :src="url" width="100%" height="100%" type="text/html" v-if="linkType === 1" />
      </div>
      <PortalLayout :layout="layoutData" mask v-else :detailed="state.id ? false : true" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, defineAsyncComponent, markRaw } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getInfo } from '@/api/onlineDev/portal';
  import PortalLayout from '../../Portal/Layout/index.vue';
  import { importViewsFile } from '@/utils';

  interface State {
    layoutData: any[];
    id: string;
    type: any;
    linkType: any;
    currentView: any;
    url: string;
    loading: boolean;
    timerList: any[];
  }

  const state = reactive<State>({
    layoutData: [],
    id: '',
    type: null,
    linkType: null,
    currentView: null,
    url: '',
    loading: false,
    timerList: [],
  });
  const { layoutData, type, currentView, linkType, url, loading } = toRefs(state);
  const { t } = useI18n();
  const [registerModal, { closeModal }] = useModalInner(init);

  function init(data) {
    state.id = '';
    state.layoutData = [];
    if (data.id) {
      state.id = data.id || '';
      initData();
    } else {
      state.layoutData = filterList(JSON.parse(JSON.stringify(data.layout)));
    }
  }
  function filterList(layout) {
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!(Array.isArray(item.visibility) && item.visibility.includes('pc')) && item.futureKey) {
          list.splice(i, 1);
          i--;
        }
        if (item.children && item.children.length) loop(item.children);
      }
    };
    loop(layout);
    return layout;
  }
  function initData() {
    state.loading = true;
    getInfo(state.id).then(res => {
      state.type = res.data.type || 0;
      state.linkType = res.data.linkType || 0;
      state.url = res.data.customUrl;
      if (!res.data) return (state.loading = false);
      if (res.data.type === 1) {
        if (!res.data.customUrl && state.linkType === 1) return;
        const formUrl = `${res.data.customUrl}`;
        state.currentView = markRaw(defineAsyncComponent(() => importViewsFile(formUrl)));
      } else {
        if (!res.data.formData) return (state.loading = false);
        let formData = JSON.parse(res.data.formData);
        state.layoutData = filterList(JSON.parse(JSON.stringify(formData.layout)) || []);
      }
      state.loading = false;
    });
  }
</script>
<style lang="less">
  .future-preview-portal-modal {
    .ant-modal-body {
      & > .scrollbar {
        padding: 0 !important;
      }
    }
  }
</style>
<style lang="less" scoped>
  .custom-page {
    padding: 10px;
    height: 100%;
    width: 100%;
  }
</style>
