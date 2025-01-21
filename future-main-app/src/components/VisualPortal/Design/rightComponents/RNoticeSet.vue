<template>
  <a-collapse-panel>
    <template #header>公告通知设置</template>
    <a-form-item label="风格类型">
      <future-select
        v-model:value="activeData.option[showType == 'pc' ? 'styleType' : 'appStyleType']"
        :options="showType == 'pc' ? styleTypeOptions : appStyleTypeOptions"
        placeholder="请选择"
        showSearch
        @change="renderKeyChange" />
    </a-form-item>
    <template v-if="showType == 'pc'">
      <template v-if="activeData.option.styleType == 1">
        <a-form-item label="显示边框">
          <a-switch v-model:checked="activeData.option.border" />
        </a-form-item>
        <a-form-item>
          <template #label>溢出省略<BasicHelp :text="['启用：溢出省略号显示；', '禁用：显示全部信息，溢出换行显示']" /></template>
          <a-switch v-model:checked="activeData.option.showOverflow" />
        </a-form-item>
        <a-divider>表头设置</a-divider>
        <a-form-item label="显示表头">
          <a-switch v-model:checked="activeData.option.showHeader" @change="renderKeyChange" />
        </a-form-item>
        <template v-if="activeData.option.showHeader">
          <a-form-item label="字体大小">
            <a-input-number v-model:value="activeData.option.headerFontSize" placeholder="请输入" :min="12" :max="25" />
          </a-form-item>
          <a-form-item label="字体加粗">
            <a-switch v-model:checked="activeData.option.headerFontWeight" />
          </a-form-item>
          <a-form-item label="字体颜色">
            <future-color-picker v-model:value="activeData.option.headerFontColor" size="small" />
          </a-form-item>
          <a-form-item label="字体位置">
            <future-radio v-model:value="activeData.option.headerLeft" :options="alignList" optionType="button" button-style="solid" class="right-radio" />
          </a-form-item>
          <a-form-item label="背景色">
            <future-color-picker v-model:value="activeData.option.headerBgColor" size="small" />
          </a-form-item>
        </template>
        <a-divider>表格设置</a-divider>
        <a-form-item label="显示序号">
          <a-switch v-model:checked="activeData.option.tableIndex" />
        </a-form-item>
        <a-form-item label="显示条数">
          <a-input-number v-model:value="activeData.option.noticeCount" placeholder="请输入" :min="1" :max="50" @change="renderKeyChange" />
        </a-form-item>
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.tableFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体颜色">
          <future-color-picker v-model:value="activeData.option.tableFontColor" size="small" />
        </a-form-item>
      </template>
      <template v-if="activeData.option.styleType != 1">
        <a-form-item label="显示图片">
          <a-switch v-model:checked="activeData.option.showImage" />
        </a-form-item>
        <a-form-item label="显示条数">
          <a-input-number v-model:value="activeData.option.noticeCount" placeholder="请输入" :min="1" :max="50" @change="renderKeyChange" />
        </a-form-item>
      </template>
      <a-form-item label="背景色">
        <future-color-picker v-model:value="activeData.option.tableBgColor" size="small" />
      </a-form-item>
      <a-form-item label="奇行颜色">
        <future-color-picker v-model:value="activeData.option.tableOddLineColor" size="small" />
      </a-form-item>
      <a-form-item label="偶行颜色">
        <future-color-picker v-model:value="activeData.option.tableEvenLineColor" size="small" />
      </a-form-item>
      <a-divider v-if="activeData.option.styleType == 1">列数据设置</a-divider>
      <a-form-item :label="activeData.option.styleType == 1 ? '列数据' : '行数据'">
        <a-button
          @click="showColumnData(activeData.option.styleType == 1 ? activeData.option.columnData : activeData.option.rowData, activeData.option.styleType)">
          设置
        </a-button>
      </a-form-item>
      <Refresh v-if="activeData.propsApi" :refresh="activeData.refresh" />
    </template>
    <template v-else>
      <a-form-item label="显示图片" v-if="activeData.option.appStyleType != 3">
        <a-switch v-model:checked="activeData.option.showImage" />
      </a-form-item>
      <a-form-item label="行数据">
        <a-button @click="showColumnData(activeData.option.appColumnList)"> 设置 </a-button>
      </a-form-item>
      <a-form-item label="显示条数">
        <a-input-number v-model:value="activeData.option.appCount" placeholder="请输入" :min="1" :max="50" @change="renderKeyChange" />
      </a-form-item>
    </template>
    <notice-column-modal @register="registerColumn" @change="handleRefreshColumn" />
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { alignList } from '../helper/dataMap';
  import { useModal } from '@/components/Modal';
  import Refresh from './RRefresh.vue';
  import NoticeColumnModal from './RNoticeColumnModal.vue';

  const props = defineProps(['activeData', 'showType']);
  const [registerColumn, { openModal: openColumnModal }] = useModal();
  const appStyleTypeOptions = [
    { fullName: '纵向1', id: 1 },
    { fullName: '纵向2', id: 2 },
    { fullName: '横向', id: 3 },
  ];
  const styleTypeOptions = [
    { fullName: '表格', id: 1 },
    { fullName: '列表（横向）', id: 2 },
    { fullName: '列表（纵向）', id: 3 },
  ];

  function renderKeyChange() {
    props.activeData.renderKey = +new Date();
  }
  function showColumnData(val, type?) {
    openColumnModal(true, { data: val, type: type || '', showType: props.showType });
  }
  function handleRefreshColumn(data) {
    if (!data) return;
    if (props.showType === 'app') {
      props.activeData.option.appColumnList = data;
    } else {
      if (props.activeData.option.styleType == 1) {
        props.activeData.option.columnData = data;
      } else {
        props.activeData.option.rowData = data;
      }
    }
    renderKeyChange();
  }
</script>
