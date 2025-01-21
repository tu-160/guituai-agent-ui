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
        <div class="header-title">
          <img src="@/assets/images/future.png" class="header-logo" />
          <span class="header-dot"></span>
          <a-tooltip :title="dataForm.fullName">
            <p class="header-txt">{{ dataForm.fullName }}</p>
          </a-tooltip>
        </div>
        <div class="future-device-switch">
          <div class="future-device-switch-item" :class="{ 'future-device-switch-item--active': showType === 'pc' }" @click="state.showType = 'pc'">
            <a-tooltip title="PC">
              <i class="icon-ym icon-ym-pc" />
            </a-tooltip>
          </div>
          <div class="future-device-switch-item" :class="{ 'future-device-switch-item--active': showType === 'app' }" @click="state.showType = 'app'">
            <a-tooltip title="APP">
              <i class="icon-ym icon-ym-mobile" />
            </a-tooltip>
          </div>
        </div>
        <a-space class="options" :size="10">
          <a-button shape="round" type="primary" @click="handleSubmit(1)" :loading="btnLoading" :disabled="saveBtnLoading">保存并发布</a-button>
          <a-button shape="round" type="primary" @click="handleSubmit()" :loading="saveBtnLoading" :disabled="btnLoading">{{ t('common.saveText') }}</a-button>
          <a-button shape="round" @click="handleCancel()">{{ t('common.closeText') }}</a-button>
        </a-space>
      </div>
    </template>
    <PortalDesigner ref="portalDesigner" :conf="formData" :showType="showType" v-if="!loading" />
  </BasicModal>
  <ReleaseModal @register="registerReleaseModal" @reload="onReleaseConfirm" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getInfo, updatePortal, createPortal } from '@/api/onlineDev/portal';
  import PortalDesigner from './components/PortalDesigner.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import ReleaseModal from '@/views/onlineDev/visualPortal/components/ReleaseModal.vue';
  import { useI18n } from '@/hooks/web/useI18n';

  interface State {
    dataForm: any;
    btnLoading: boolean;
    saveBtnLoading: boolean;
    showType: string;
    formData: any;
    loading: boolean;
    isReload: boolean;
  }
  const state = reactive<State>({
    dataForm: {},
    btnLoading: false,
    saveBtnLoading: false,
    showType: 'pc',
    formData: null,
    loading: true,
    isReload: false,
  });
  const { dataForm, formData, btnLoading, saveBtnLoading, showType, loading } = toRefs(state);
  const { t } = useI18n();
  const portalDesigner = ref();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  const { prefixCls } = useDesign('basic-portal');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  const [registerReleaseModal, { openModal: openReleaseModal }] = useModal();

  function init(data) {
    state.isReload = false;
    state.dataForm = data;
    state.showType = 'pc';
    state.formData = null;
    if (state.dataForm.id) initData();
  }
  function initData() {
    changeLoading(true);
    state.loading = true;
    getInfo(state.dataForm.id)
      .then(res => {
        state.dataForm = res.data;
        state.formData = res.data.formData ? JSON.parse(res.data.formData) : null;
        nextTick(() => {
          changeLoading(false);
          state.loading = false;
        });
      })
      .catch(() => {
        changeLoading(false);
        state.loading = false;
      });
  }
  function handleSubmit(type?) {
    (unref(portalDesigner) as any)
      .getData()
      .then(res => {
        state.formData = res.formData;
        let query = {
          formData: JSON.stringify(state.formData),
          id: state.dataForm.id,
        };
        type == 1 ? (state.btnLoading = true) : (state.saveBtnLoading = true);
        const formMethod = state.dataForm.id ? updatePortal : createPortal;
        formMethod(query)
          .then(res => {
            state.saveBtnLoading = false;
            state.btnLoading = false;
            if (type === 1) {
              nextTick(() => openReleaseModal(true, state.dataForm));
            } else {
              createMessage.success(res.msg);
            }
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
  function onReleaseConfirm() {
    state.isReload = true;
    initData();
  }
</script>
<style lang="less">
  @import '../style/index.less';
</style>
