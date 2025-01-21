<template>
  <div class="portal-design-box">
    <div class="center-box">
      <div class="action-bar">
        <div class="action-bar-left">
          <div v-for="(item, listIndex) in componentsList" :key="listIndex" class="components-part">
            <a-dropdown placement="bottom">
              <div class="components-title">{{ item.title }}<i class="icon-ym icon-ym-arrow-down"></i></div>
              <template #overlay>
                <a-menu class="components-menu">
                  <a-menu-item class="components-item" v-for="(child, index) in item.list" :key="index" @click="handleAddComponent(child)">
                    <i :class="child.icon"></i>
                    {{ child.label }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="action-bar-right">
          <a-tooltip :title="t('common.undoText')">
            <a-button type="text" class="action-bar-btn" :disabled="!getCanUndo" @click="handleRedoAndUndo(1)">
              <i class="icon-ym icon-ym-undo" />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('common.redoText')">
            <a-button type="text" class="action-bar-btn" :disabled="!getCanRedo" @click="handleRedoAndUndo(2)">
              <i class="icon-ym icon-ym-redo" />
            </a-button>
          </a-tooltip>
          <a-divider type="vertical" class="action-bar-divider" />
          <a-tooltip :title="t('common.cleanText')">
            <a-button type="text" class="action-bar-btn" @click="handleEmpty">
              <i class="icon-ym icon-ym-clean" />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('common.previewText')">
            <a-button type="text" class="action-bar-btn" @click="handlePreview">
              <i class="icon-ym icon-ym-video-play" />
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <ScrollContainer class="layout-area">
        <div v-if="showType == 'pc'">
          <grid-layout :layout.sync="layout" :row-height="40" v-if="layout.length">
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :maxH="item.maxH"
              :minH="item.minH"
              :minW="item.minW"
              :maxW="item.maxW"
              :class="{ 'active-item': item.i === activeId }"
              @resized="resizedEvent(item.i, item)"
              @moved="movedEvent"
              @click="handleClick(item)">
              <Parser :item="item" :activeId="activeId" />
              <div class="mask" v-if="!noNeedMaskList.includes(item.futureKey)"></div>
              <div class="drawing-item-action">
                <span :title="t('common.copyText')" class="drawing-item-action-item drawing-item-copy" @click="handleAddComponent(item, 'copy')">
                  <copy-outlined />
                </span>
                <a-popconfirm
                  :title="t('formGenerator.delComponentTip')"
                  class="drawing-item-action-item drawing-item-delete"
                  @confirm="handleRemoveItem(item.i)">
                  <span :title="t('common.delText')">
                    <delete-outlined />
                  </span>
                </a-popconfirm>
              </div>
            </grid-item>
          </grid-layout>
          <div v-show="!layout.length" class="empty-info">
            <img src="../../../../assets/images/emptyPortal.png" class="empty-img" />
          </div>
        </div>
        <div id="ipad" v-else>
          <div class="outer-ipad">
            <div class="ipad-body">
              <ScrollContainer class="center-scrollbar">
                <draggable v-if="layout.length" class="drawing-board" :list="layout" :animation="340" group="componentsGroup" item-key="i">
                  <template #item="{ element }">
                    <div class="item-box m-10px portal-tabs-box" @click="handleClick(element)" :class="{ 'active-item': element.i === activeId }">
                      <HAppCommon :activeData="element" :activeId="activeId" />
                      <div class="mask" v-if="!noNeedMaskList.includes(element.futureKey)"></div>
                      <div class="drawing-item-action">
                        <span :title="t('common.copyText')" class="drawing-item-action-item drawing-item-copy" @click="handleAddComponent(element)">
                          <copy-outlined />
                        </span>
                        <a-popconfirm
                          :title="t('formGenerator.delComponentTip')"
                          class="drawing-item-action-item drawing-item-delete"
                          @confirm="handleRemoveItem(element.i)">
                          <span :title="t('common.delText')">
                            <delete-outlined />
                          </span>
                        </a-popconfirm>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div v-show="!layout.length" class="empty-info app-empty-info">
                  <img src="../../../../assets/images/emptyPortal.png" class="empty-img" />
                </div>
              </ScrollContainer>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </div>
    <RightPanel :active-data="activeData" :refresh="refresh" :showType="showType" @relationChange="onRelationChange" />
    <PreviewModal @register="registerPreview" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, toRefs, nextTick, inject } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import { layoutComponents, systemComponents, basicComponents, chartComponents } from '../helper/componentMap';
  import { noNeedMaskList, needDefaultList, needJumpSetList, chartData, mapChartData, rankList, timeAxisList, tableList } from '../helper/dataMap';
  import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useRedo } from '@/components/FormGenerator/src/hooks/useRedo';
  import { isUrl } from '@/utils/is';
  import RightPanel from './RightPanel.vue';
  import draggable from 'vuedraggable';
  import Parser from './Parser.vue';
  import PreviewModal from './Preview.vue';
  import HAppCommon from '../../Portal/HAppCommon/index.vue';

  interface State {
    componentsList: any[];
    layout: any[];
    refresh: any;
    config: any;
    copyDrawingList: string;
    activeId: string;
    activeData: any;
  }

  const state = reactive<State>({
    componentsList: [
      { title: '布局控件', list: layoutComponents },
      { title: '基础控件', list: basicComponents },
      { title: '系统控件', list: systemComponents },
      { title: '图表控件', list: chartComponents },
    ],
    layout: [],
    refresh: {},
    config: {},
    copyDrawingList: '',
    activeId: '',
    activeData: null,
  });
  const { componentsList, refresh, activeId, activeData, layout } = toRefs(state);
  const defaultConf = {
    layoutId: 100,
    layout: [],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: '5',
    },
  };
  defineExpose({ getData, handleData });
  const emitter: any = inject('emitter');
  const { t } = useI18n();
  const props = defineProps(['conf', 'showType']);
  const emit = defineEmits(['register']);
  const { createConfirm } = useMessage();
  const [registerPreview, { openModal: openPreviewModal }] = useModal();
  const { initRedo, addRecord, handleUndo, handleRedo, getCanUndo, getCanRedo } = useRedo();

  function init() {
    if (typeof props.conf === 'object' && props.conf !== null) {
      state.config = { ...defaultConf, ...props.conf };
    } else {
      state.config = JSON.parse(JSON.stringify(defaultConf));
      state.config.layoutId = 100;
    }
    state.layout = state.config.layout || [];
    state.refresh = state.config.refresh || {};
    initRedo();
    setTimeout(() => {
      addLocalRecord(state.layout);
      setActiveData();
    }, 50);
    emitter.on('addComponent', data => {
      handleAddComponent(data.val, '', data.item);
    });
    emitter.on('handlerActive', val => {
      handleClick(val);
    });
  }
  function handleAddComponent(item, type?, currentItem?) {
    let clone = JSON.parse(JSON.stringify(item));
    let x = 0,
      y = 0,
      i = state.config.layoutId;
    if (state.layout.length) {
      let maxYItem = { y: 0, h: 0 };
      for (let i = 0; i < state.layout.length; i++) {
        if (state.layout[i].y >= maxYItem.y) maxYItem = state.layout[i];
      }
      y = maxYItem.y + maxYItem.h;
    }
    let row = { ...clone, i, x, y };
    if (needDefaultList.includes(row.futureKey) && type != 'copy') row.option.defaultValue = getDefaultValue(row);
    if (row.futureKey == 'customEcharts' && type != 'copy') {
      row.option = getDefaultValue(row);
      row.appOption = getAppDefaultValue(row);
    }
    if (currentItem) {
      if (currentItem.futureKey == 'card') currentItem.children = [row];
      if (currentItem.futureKey == 'tab') {
        for (let i = 0; i < currentItem.children.length; i++) {
          const element = currentItem.children[i];
          if (element.name == currentItem.active) currentItem.children[i].children = [row];
        }
      }
    } else {
      state.layout.push(row);
    }
    state.activeId = state.config.layoutId;
    state.activeData = row;
    state.config.layoutId++;
    addLocalRecord(state.layout);
  }
  function getDefaultValue(row) {
    const futureKey = row.futureKey;
    if (futureKey == 'text') return 'FUTURE快速开发平台';
    if (futureKey == 'image') return 'https://app.cdn.futuresoft.com/image/3.2/banner1.png';
    if (futureKey == 'video') return 'https://cdn.futuresoft.com/2022/video/index_video.mp4';
    if (futureKey == 'barChart' || futureKey == 'lineChart' || futureKey == 'pieChart') return chartData.baseBarData;
    if (futureKey == 'radarChart') return chartData.radarData;
    if (futureKey == 'mapChart') return mapChartData;
    if (futureKey == 'rankList') return rankList;
    if (futureKey == 'timeAxis') return timeAxisList;
    if (futureKey == 'tableList') return tableList;
    if (futureKey == 'customEcharts') return chartData.customEchartsData;
  }
  function getAppDefaultValue(row) {
    const futureKey = row.futureKey;
    if (futureKey == 'customEcharts') return chartData.customAppEchartsData;
  }
  function addLocalRecord(val) {
    if (JSON.stringify(val) != state.copyDrawingList) {
      state.copyDrawingList = JSON.stringify(val);
      addRecord(val);
    }
  }
  function setActiveData(i = 0) {
    state.activeId = '';
    state.activeData = {};
    if (state.layout.length) {
      state.activeData = state.layout[i];
      state.activeId = state.layout[i].i;
    }
  }
  function onRelationChange() {}
  function resizedEvent(i, item) {
    emitter.emit('eChart' + i);
    const loop = data => {
      if (data.children && item.children.length) {
        data.children.map(ele => {
          if (ele.futureKey) emitter.emit('eChart' + ele.i);
          if (ele.children && ele.children.length) loop(ele);
        });
      }
    };
    loop(item);
    addLocalRecord(state.layout);
  }
  function movedEvent() {
    addLocalRecord(state.layout);
  }
  function handleClick(item) {
    state.activeId = item.i;
    state.activeData = item;
  }
  function handleRemoveItem(i) {
    state.layout = state.layout.filter(item => item.i !== i);
    state.activeId = '';
    state.activeData = {};
    addLocalRecord(state.layout);
    nextTick(() => {
      const len = state.layout.length;
      if (len) setActiveData(len - 1);
    });
  }
  function getData() {
    return new Promise((resolve, reject) => {
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i];
          const option = e.option || {};
          const card = e.card || {};
          if (card.cardRightBtn) {
            if (card.linkType === '1' && !card.urlAddress) {
              reject({ msg: `${e.label}控件“菜单名称”属性不能为空`, target: 1 });
              break;
            }
            if (card.linkType === '2') {
              if (!card.urlAddress) {
                reject({ msg: `${e.label}控件“链接地址”属性不能为空`, target: 1 });
                break;
              }
              if (!isUrl(card.urlAddress)) {
                reject({ msg: '请输入正确的链接地址', target: 1 });
                break;
              }
            }
            if (card.appLinkType === '1' && !card.appUrlAddress) {
              reject({ msg: `${e.label}控件“菜单名称”属性不能为空`, target: 1 });
              break;
            }
            if (card.appLinkType === '2') {
              if (!card.appUrlAddress) {
                reject({ msg: `${e.label}控件“链接地址”属性不能为空`, target: 1 });
                break;
              }
              if (!isUrl(card.appUrlAddress)) {
                reject({ msg: '请输入正确的链接地址', target: 1 });
                break;
              }
            }
          }
          if (option.linkType === '1' && !option.urlAddress) {
            reject({ msg: `${e.label}控件“菜单名称”属性不能为空`, target: 1 });
            break;
          }
          if (option.linkType === '2') {
            if (!option.urlAddress) {
              reject({ msg: `${e.label}控件“链接地址”属性不能为空`, target: 1 });
              break;
            }
            if (!isUrl(option.urlAddress)) {
              reject({ msg: '请输入正确的链接地址', target: 1 });
              break;
            }
          }
          if (option.appLinkType === '1' && !option.appUrlAddress) {
            reject({ msg: `${e.label}控件“菜单名称”属性不能为空`, target: 1 });
            break;
          }
          if (option.appLinkType === '2') {
            if (!option.appUrlAddress) {
              reject({ msg: `${e.label}控件“链接地址”属性不能为空`, target: 1 });
              break;
            }
            if (!isUrl(option.appUrlAddress)) {
              reject({ msg: '请输入正确的链接地址', target: 1 });
              break;
            }
          }
          if ((e.futureKey == 'video' || e.futureKey == 'image') && option.styleType == 2) {
            const val = e.futureKey == 'video' ? '视频' : '图片';
            if (!option.defaultValue) {
              reject({ msg: `${e.label}控件“${val}地址”属性不能为空`, target: 1 });
              break;
            }
            if (!isUrl(option.defaultValue)) {
              reject({ msg: `请输入正确的${val}地址`, target: 1 });
              break;
            }
          }
          if (e.futureKey == 'iframe') {
            if (!option.defaultValue) {
              reject({ msg: `${e.label}控件“链接地址”属性不能为空`, target: 1 });
              break;
            }
            if (!isUrl(option.defaultValue)) {
              reject({ msg: '请输入正确的链接地址', target: 1 });
              break;
            }
          }
          if (needJumpSetList.includes(e.futureKey) && option.urlAddress) {
            if (!isUrl(option.urlAddress)) {
              reject({ msg: '请输入正确的跳转地址', target: 1 });
              break;
            }
          }
          if (e.children && Array.isArray(e.children)) loop(e.children);
        }
      };
      loop(state.layout);
      state.config.layout = state.layout;
      resolve({ formData: state.config, target: 1 });
    });
  }
  function handleEmpty() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('formGenerator.cleanComponentTip'),
      onOk: () => {
        state.layout = [];
        state.config.layoutId = 100;
        state.activeId = '';
        state.activeData = {};
        addLocalRecord(state.layout);
      },
    });
  }
  function handleData(data) {
    state.layout = JSON.parse(JSON.stringify(data));
    state.copyDrawingList = JSON.stringify(state.layout);
    let boo = false;
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.i === state.activeId) {
          state.activeData = e;
          state.activeId = e.i;
          boo = true;
        }
        if (e.children && Array.isArray(e.children)) loop(e.children);
      }
    };
    loop(state.layout);
    if (!boo) {
      state.activeData = {};
      state.activeId = '';
    }
  }
  function handlePreview() {
    openPreviewModal(true, { layout: state.layout });
  }
  function handleRedoAndUndo(type) {
    const method = type == 1 ? handleUndo : handleRedo;
    method(handleData);
  }

  onMounted(() => init());
</script>
