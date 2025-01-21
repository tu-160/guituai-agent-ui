<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    defaultFullscreen
    :footer="null"
    :closable="false"
    :keyboard="false"
    destroyOnClose
    class="future-full-modal full-modal future-print-preview-modal">
    <template #title>
      <div class="future-full-modal-header">
        <div class="header-title">
          <img src="@/assets/images/future.png" class="header-logo" />
          <span class="header-dot"></span>
          <p class="header-txt">打印预览</p>
        </div>
        <a-space class="options" :size="10">
          <a-button type="primary" @click="handleDownload" :disabled="loading">下载</a-button>
          <a-button type="primary" @click="handlePrint" :disabled="loading">打印</a-button>
          <a-button @click="closeModal()">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div id="previewDesignedWrap"></div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, computed, unref } from 'vue';
  import { hiprint } from 'vue-plugin-hiprint';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getBatchData } from '@/api/system/printDev';
  import $ from 'jquery';
  import { useUserStore } from '@/store/modules/user';
  import dayjs from 'dayjs';
  import { useDefineSetting } from '@/hooks/setting/useDefineSetting';
  import { useGlobSetting } from '@/hooks/setting';

  interface State {
    printId: any;
    hiprintTemplate: any;
    dataList: any[];
    loading: boolean;
    systemInfo: any;
  }

  const state = reactive<State>({
    printId: undefined,
    hiprintTemplate: undefined,
    dataList: [],
    loading: false,
    systemInfo: {
      printer: '',
      printTime: '',
    },
  });
  const { loading } = toRefs(state);
  const { t } = useI18n();
  const userStore = useUserStore();
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  const { getFlowStateContent } = useDefineSetting();
  const globSetting = useGlobSetting();

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  /**
   * 初始化
   * @param data
   */
  async function init(data) {
    const { id, formInfo = [] } = data || {};
    if (!id || !formInfo.length) return;
    $('#previewDesignedWrap').html(null);
    changeLoading(true);
    state.printId = id;
    state.loading = true;
    const { data: resData } = (await getBatchData({ id, formInfo })) || {};
    state.loading = false;
    changeLoading(false);
    if (!resData) return;
    getSystemInfo();
    const printDataArr = resData?.map((item, index) => {
      let { printData, printTemplate, operatorRecordList = [], convertConfig = '' } = item || {};
      try {
        const targetTpl = JSON.parse(printTemplate);
        if (index === 0) {
          state.hiprintTemplate = new hiprint.PrintTemplate({ template: targetTpl });
        }
        if (convertConfig) printData = handleConvert(printData, convertConfig);
        printData.operatorRecordList = operatorRecordList.map(o => ({
          ...o,
          handleTime: dayjs(o.handleTime).format('YYYY-MM-DD HH:mm:ss'),
          handleStatus: getFlowStateContent(o.handleStatus),
        }));
        printData.systemInfo = state.systemInfo;
        return printData;
      } catch (error) {
        $('#previewDesignedWrap').append('<div class="print-single-wrap"><div class="tpl-invalid">模板已失效，请重新设计</div></div>');
        return null;
      }
    });
    if (!state.hiprintTemplate) return;
    state.dataList = [...printDataArr];
    initHinnn();
    const tplHtml = state.hiprintTemplate?.getHtml(state.dataList);
    $('#previewDesignedWrap').html(tplHtml);
  }
  /**
   * 下载文件
   */
  function handleDownload() {
    if (!state.hiprintTemplate || !state.dataList?.length) return;
    state.hiprintTemplate
      ?.toPdf(state.dataList, `${state.printId}.${new Date(+new Date() + 8 * 3600000).toJSON().substring(0, 19).replace('T', ' ')}`, { isDownload: true })
      .then(() => {});
  }
  /**
   * 打印文件
   */
  function handlePrint() {
    if (!state.hiprintTemplate || !state.dataList?.length) return;
    state.loading = true;
    const options = { leftOffset: 0, topOffset: 0 };
    state.hiprintTemplate?.print(state.dataList, options, {
      callback: () => {
        state.loading = false;
      },
      styleHandler: () => {
        return '<link rel="stylesheet" href="/css/print-lock.css" />';
      },
    });
  }
  function handleConvert(data, convertConfig) {
    const convertConfigList = JSON.parse(convertConfig);
    for (let i = 0; i < convertConfigList.length; i++) {
      const e = convertConfigList[i];
      if (e.type !== 'singleImg') continue;
      const table = e.field.split('.')[0];
      const field = e.field.split('.')[1];
      if (!Reflect.has(data, table)) continue;
      for (let j = 0; j < data[table].length; j++) {
        if (Reflect.has(data[table][j], field) && data[table][j][field]) {
          // 图片加前缀
          data[table][j][field] = globSetting.apiUrl + data[table][j][field];
        }
      }
    }
    return data;
  }
  // 获取系统信息
  function getSystemInfo() {
    const systemPrinter = unref(getUserInfo).userName + '/' + unref(getUserInfo).userAccount;
    const systemPrintTime = dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    state.systemInfo.printer = systemPrinter;
    state.systemInfo.printTime = systemPrintTime;
  }
  // 重写hinnn
  function initHinnn() {
    if (!(window as any).hinnn) return;
    (window as any).hinnn.apiUrl = globSetting.apiUrl;
    (window as any).hinnn.dateFormat = function (date, format) {
      if (!date) return '';
      if (!isNaN(date) && typeof date === 'string') date = Number(date);
      format = format.replaceAll('y', 'Y').replaceAll('d', 'D');
      return dayjs(date).format(format);
    };
  }
</script>
<style lang="less">
  html[data-theme='dark'] {
    .hiprint-printPanel {
      .hiprint-printPaper {
        color: #333;
      }
    }
  }
  #previewDesignedWrap {
    height: calc(100%);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .future-full-modal.future-print-preview-modal {
    .ant-modal-body > .scrollbar {
      padding: 0 !important;
    }

    .scrollbar__view {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    .hiprint-printPanel {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .hiprint-printPaper {
        background-color: #fff;
        margin: 10px auto;
      }
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
