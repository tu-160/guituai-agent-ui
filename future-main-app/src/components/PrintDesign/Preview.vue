<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    defaultFullscreen
    :footer="null"
    :closable="false"
    :keyboard="false"
    destroyOnClose
    class="future-full-modal full-modal designer-modal future-print-preview-modal">
    <template #title>
      <div class="future-full-modal-header">
        <div class="header-title">
          <img src="@/assets/images/future.png" class="header-logo" />
          <span class="header-dot"></span>
          <p class="header-txt">打印预览</p>
        </div>
        <a-space class="options" :size="10">
          <a-button type="primary" @click="handlePrint()">打印</a-button>
          <a-button @click="closeModal()">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div id="previewContentDesign"></div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { newHiprintPrintTemplate } from '@/components/PrintDesign/PrintDesign/utils/template-helper';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getPrintDevInfo } from '@/api/system/printDev';
  import $ from 'jquery';

  defineOptions({ name: 'printPreview' });

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  const hiprintTemplate = ref();

  /**
   * 初始化
   */
  async function init(data) {
    $('#previewContentDesign').html(null);
    changeLoading(true);
    const { id, printTplPanels = '' } = data;
    try {
      const realPanels = id !== undefined ? JSON.parse((await getPrintDevInfo(id))?.data?.printTemplate) : JSON.parse(printTplPanels);
      hiprintTemplate.value = newHiprintPrintTemplate('printPreview', { template: realPanels });
      $('#previewContentDesign').html(hiprintTemplate.value?.getHtml() || '模板加载失败');
    } catch (error) {
      $('#previewContentDesign').html('<div class="tpl-invalid">模板已失效，请重新设计</div>');
    } finally {
      changeLoading(false);
    }
  }
  /**
   * 浏览器打印
   */
  function handlePrint() {
    const options = { leftOffset: 0, topOffset: 0 };
    // 调用浏览器打印
    hiprintTemplate.value?.print({}, options, {
      styleHandler: () => {
        return '<link rel="stylesheet" href="/css/print-lock.css" />';
      },
    });
  }
</script>

<style lang="less">
  .future-full-modal.future-print-preview-modal {
    .ant-modal-body > .scrollbar {
      padding: 0 0 10px !important;
    }

    .scrollbar__view {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    .hiprint-printPaper {
      background-color: #fff;
      margin: 10px auto;
    }

    .tpl-invalid {
      width: 210mm;
      height: 296mm;
      background: #fff;
      margin: 0 auto;
      text-align: center;
      font-size: 16px;
      padding-top: 20px;
      box-sizing: border-box;
    }
  }

  #hiwprint_iframe {
    border: 0 !important;
  }
</style>
