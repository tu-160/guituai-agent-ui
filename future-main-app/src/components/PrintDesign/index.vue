<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    defaultFullscreen
    :footer="null"
    :closable="false"
    :keyboard="false"
    class="future-full-modal full-modal designer-modal"
    :class="`${prefixCls}`">
    <template #title>
      <div class="future-full-modal-header">
        <div class="header-title !w-auto">
          <img src="@/assets/images/future.png" class="header-logo" />
          <span class="header-dot"></span>
          <a-tooltip :title="dataForm.fullName">
            <p class="header-txt">{{ dataForm.fullName }}</p>
          </a-tooltip>
          <a-popover
            v-model:open="versionVisible"
            trigger="click"
            placement="bottom"
            overlayClassName="future-version-popover"
            arrow-point-at-center
            destroyTooltipOnHide
            v-if="currentVersion?.id">
            <template #content>
              <div class="w-250px">
                <div class="version-list">
                  <div v-for="item in versionList" class="version-item" @click="handleChangeVersion(item)">
                    <span class="version-badge" :style="{ background: getVersionColor(item.state) }"></span>
                    <span class="version-name">{{ item.fullName }}</span>
                    <span class="version-state" :style="{ background: getVersionColor(item.state) }">{{ getVersionState(item.state) }}</span>
                    <div class="version-delete">
                      <i class="icon-ym icon-ym-app-delete" @click.stop="handleDelVersion(item.id)" v-if="!item.state && versionList.length > 1" />
                    </div>
                  </div>
                </div>
                <div class="add-btn" @click="handleAddVersion">
                  <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增打印版本</a-button>
                </div>
              </div>
            </template>
            <a-button type="text" class="current-version">
              <span class="version-badge" :style="{ background: getVersionColor(currentVersion.state) }"></span>{{ currentVersion?.fullName }}
              <i class="icon-ym icon-ym-unfold ml-5px font text-10px" />
            </a-button>
          </a-popover>
          <div class="version-tip ml-0" v-if="currentVersion?.state != 0">
            <InfoCircleFilled class="icon" />
            {{ currentVersion?.state == 1 ? '启用中' : '已归档' }}的版本不可修改，请
            <a-button type="link" class="px-2px" @click="handleAddVersion">添加新版本</a-button>
          </div>
        </div>
        <a-space class="options" :size="10">
          <a-button shape="round" type="primary" @click="handleSubmit(1)" v-if="currentVersion?.state !== 1" :loading="btnLoading" :disabled="saveBtnLoading">
            {{ currentVersion?.state == 2 ? '启用' : '发布' }}
          </a-button>
          <a-button shape="round" type="primary" @click="handleSubmit()" :loading="saveBtnLoading" :disabled="btnLoading" v-if="!currentVersion?.state">
            {{ t('common.saveText') }}
          </a-button>
          <a-button shape="round" @click="handleCancel()">{{ t('common.closeText') }}</a-button>
        </a-space>
      </div>
    </template>
    <PrintDesign ref="printDesign" v-bind="getBindValue" v-if="!loading" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getVersionInfo, getVersionList, saveVersion, copyVersion, delVersion } from '@/api/system/printDev';
  import PrintDesign from './PrintDesign/index.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import { InfoCircleFilled } from '@ant-design/icons-vue';

  interface State {
    dataForm: any;
    btnLoading: boolean;
    saveBtnLoading: boolean;
    loading: boolean;
    isReload: boolean;
    versionVisible: boolean;
    versionList: any[];
    currentVersion: any;
    key: number;
  }
  const state = reactive<State>({
    dataForm: {},
    btnLoading: false,
    saveBtnLoading: false,
    loading: true,
    isReload: false,
    versionVisible: false,
    versionList: [],
    currentVersion: {},
    key: 0,
  });
  const { dataForm, btnLoading, saveBtnLoading, loading, versionVisible, versionList, currentVersion } = toRefs(state);
  const { t } = useI18n();
  const printDesign = ref();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  const { prefixCls } = useDesign('basic-print-designer');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const getBindValue = computed(() => ({
    conf: state.dataForm.printTemplate,
    dataSetList: state.dataForm.dataSetList || [],
    convertConfig: state.dataForm.convertConfig ? JSON.parse(state.dataForm.convertConfig) : [],
    versionState: state.currentVersion?.state,
    key: state.key,
  }));

  function init(data) {
    state.isReload = false;
    state.dataForm.printTemplate = '';
    state.dataForm.id = data.id || '';
    state.dataForm.fullName = data.fullName || '';
    state.loading = true;
    changeLoading(true);
    initData();
  }
  function initData(update = true) {
    getVersionList(state.dataForm.id)
      .then(res => {
        state.versionList = res.data || [];
        if (!update) return;
        state.currentVersion = state.versionList[0] || {};
        initPrintData();
      })
      .catch(() => {
        state.loading = false;
        changeLoading(false);
      });
  }
  function initPrintData() {
    if (!state.currentVersion.id) return;
    changeLoading(true);
    getVersionInfo(state.currentVersion.id)
      .then(res => {
        state.dataForm = { ...state.dataForm, ...res.data };
        state.loading = false;
        changeLoading(false);
        state.key = +new Date();
      })
      .catch(() => {
        state.loading = false;
        changeLoading(false);
      });
  }
  function getVersionColor(state) {
    return state == 0 ? 'rgba(247,171,51,0.9)' : state == 1 ? 'rgba(75, 222, 0, 0.9)' : 'rgba(152,158,178,0.9)';
  }
  function getVersionState(state) {
    return state == 0 ? '设计中' : state == 1 ? '启用中' : '已归档';
  }
  function handleAddVersion() {
    copyVersion(state.currentVersion.id).then(res => {
      const currentId = res.data;
      getVersionList(state.dataForm.id).then(res => {
        state.versionList = res.data || [];
        if (currentId) {
          const list = state.versionList.filter(o => o.id == currentId);
          state.currentVersion = list.length ? list[0] : state.versionList[0];
        }
        initPrintData();
      });
    });
  }
  function handleChangeVersion(item) {
    if (state.currentVersion.id == item.id) return;
    state.versionVisible = false;
    state.currentVersion = item;
    initPrintData();
  }
  function handleDelVersion(id) {
    delVersion(id).then(res => {
      createMessage.success(res.msg);
      initData(state.currentVersion.id === id);
    });
  }
  function handleSubmit(type = 0) {
    (unref(printDesign) as any)
      .getData()
      .then(res => {
        const query = {
          ...state.dataForm,
          dataSetList: res.dataSetList,
          convertConfig: res.convertConfig ? JSON.stringify(res.convertConfig) : '',
          printTemplate: res?.printTplPanels || '',
          type,
        };
        type == 1 ? (state.btnLoading = true) : (state.saveBtnLoading = true);
        saveVersion(query)
          .then(res => {
            createMessage.success(res.msg);
            state.saveBtnLoading = false;
            state.btnLoading = false;
            if (!type) return;
            state.isReload = true;
            state.currentVersion.state = 1;
            initData(false);
          })
          .catch(() => {
            state.saveBtnLoading = false;
            state.btnLoading = false;
          });
      })
      .catch(err => {
        err.msg && createMessage.warning(err.msg);
      });
  }
  function handleCancel() {
    closeModal();
    if (state.isReload) emit('reload');
  }
</script>
