<template>
  <div class="h-full" @click.stop="handleClick(activeData)">
    <component :is="layouts" v-bind="getBindValue" v-if="activeData.futureKey !== 'card' && activeData.futureKey !== 'tab'" />
    <template v-if="activeData.futureKey === 'card'">
      <a-card class="portal-card-box">
        <template #title v-if="activeData.title">
          <CardHeader :title="activeData.title" :card="activeData.card" />
        </template>
        <div class="portal-card-body flex items-center justify-center p-15px">
          <div
            v-show="activeData.children && activeData.children.length"
            class="portal-box-item"
            v-for="(it, index) in activeData.children"
            :key="index"
            @click.stop="handleClick(it)">
            <Parser :item="it" :class="{ 'active-item': it.i === activeId }" :activeId="activeId" :detailed="detailed" />
            <div class="drawing-item-action">
              <a-popconfirm
                :title="t('formGenerator.delComponentTip')"
                class="drawing-item-action-item drawing-item-delete"
                @confirm="handleRemoveItem(index, activeData.children)"
                v-if="!detailed">
                <span :title="t('common.delText')">
                  <delete-outlined />
                </span>
              </a-popconfirm>
            </div>
          </div>
          <add-btn :activeData="activeData" @addComponent="handleAddComponent" v-show="!activeData.children?.length && !detailed" />
        </div>
      </a-card>
    </template>
    <template v-if="activeData.futureKey === 'tab'">
      <a-tabs
        v-model:activeKey="activeData.active"
        :tabPosition="activeData.tabPosition"
        @tabClick="handleTabClick"
        :type="activeData.type"
        class="portal-box-tab h-full bg-white"
        :class="{ 'portal-eChart-tab-position': activeData.tabPosition == 'left' || activeData.tabPosition == 'right' }">
        <a-tab-pane v-for="child in activeData.children" :key="child.name">
          <template #tab>
            <span class="ml-4px"><i :class="child.icon" class="pr-4px"></i>{{ child.title }}</span>
          </template>
          <div class="portal-tab-body flex items-center justify-center h-full p-15px">
            <div v-show="child.children?.length" class="portal-box-item" v-for="(it, index) in child.children" :key="index" @click.stop="handleClick(it)">
              <parser :item="it" :class="{ 'active-item': it.i === activeId }" :activeId="activeId" :detailed="detailed" />
              <div class="drawing-item-action">
                <a-popconfirm
                  :title="t('formGenerator.delComponentTip')"
                  class="drawing-item-action-item drawing-item-delete"
                  @confirm="handleRemoveItem(index, child.children)"
                  v-if="!detailed">
                  <span :title="t('common.delText')">
                    <delete-outlined />
                  </span>
                </a-popconfirm>
              </div>
            </div>
            <add-btn :activeData="activeData" @addComponent="handleAddComponent" v-show="!child.children?.length && !detailed" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { ref, defineAsyncComponent, markRaw, inject, computed, nextTick } from 'vue';
  import { upperFirst } from 'lodash-es';
  import CardHeader from '../../Portal/CardHeader/index.vue';
  import AddBtn from './AddBtn.vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { chartList } from '../helper/dataMap';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ name: 'Parser' });

  const props = defineProps(['item', 'activeId', 'showType', 'detailed']);
  const allModules = import.meta.glob('../../Portal/H*/index.vue');
  let layouts = ref<any>(null);
  const emitter: any = inject('emitter');
  console.log("parser --->", props.item);
  if (props.item.futureKey !== 'card') layouts.value = markRaw(defineAsyncComponent(() => getComponents(props.item.futureKey)));
  const useNeedKeyList = ['todo', 'commonFunc', 'dataBoard', 'notice', 'tableList', 'text', 'image', 'carousel', 'video', 'customEcharts'];
  const { t } = useI18n();

  const activeData = computed(() => {
    const activeData = props.item;
    if (!props.detailed) return activeData;
    if (activeData.titleI18nCode) activeData.title = t(activeData.titleI18nCode, activeData.title);
    if (activeData.card.cardRightBtnI18nCode) activeData.card.cardRightBtn = t(activeData.card.cardRightBtnI18nCode, activeData.card.cardRightBtn);
    if (activeData.futureKey === 'tab') {
      for (let i = 0; i < activeData.children.length; i++) {
        if (activeData.children[i].titleI18nCode) activeData.children[i].title = t(activeData.children[i].titleI18nCode, activeData.children[i].title);
      }
    }
    if (['todo', 'commonFunc', 'dataBoard'].includes(activeData.futureKey)) {
      for (let i = 0; i < activeData.option.defaultValue.length; i++) {
        const e = activeData.option.defaultValue[i];
        if (e.fullNameI18nCode) e.fullName = t(e.fullNameI18nCode, e.fullName);
      }
    }
    if (activeData.futureKey === 'carousel') {
      for (let i = 0; i < activeData.option.defaultValue.length; i++) {
        const e = activeData.option.defaultValue[i];
        if (e.textDefaultValueI18nCode) e.textDefaultValue = t(e.textDefaultValueI18nCode, e.textDefaultValue);
      }
    }
    if (activeData.futureKey === 'text' && activeData.dataType === 'static' && activeData.option.defaultValueI18nCode) {
      activeData.option.defaultValue = t(activeData.option.defaultValueI18nCode, activeData.option.defaultValue);
    }
    if (activeData.futureKey === 'image' && activeData.option.textDefaultValueI18nCode) {
      activeData.option.textDefaultValue = t(activeData.option.textDefaultValueI18nCode, activeData.option.textDefaultValue);
    }
    if (['tableList', 'notice'].includes(activeData.futureKey)) {
      for (let i = 0; i < activeData.option.columnData.length; i++) {
        const e = activeData.option.columnData[i];
        if (e.fullNameI18nCode) e.fullName = t(e.fullNameI18nCode, e.fullName);
      }
    }
    if (activeData.futureKey === 'rankList') {
      for (let i = 0; i < activeData.option.columnOptions.length; i++) {
        const e = activeData.option.columnOptions[i];
        if (e.labelI18nCode) e.label = t(e.labelI18nCode, e.label);
      }
    }
    if ([...chartList, 'mapChart'].includes(activeData.futureKey)) {
      if (activeData.option.titleTextI18nCode) activeData.option.titleText = t(activeData.option.titleTextI18nCode, activeData.option.titleText);
      if (activeData.option.titleSubtextI18nCode) activeData.option.titleSubtext = t(activeData.option.titleSubtextI18nCode, activeData.option.titleSubtext);
      if (activeData.option.xAxisNameI18nCode) activeData.option.xAxisName = t(activeData.option.xAxisNameI18nCode, activeData.option.xAxisName);
      if (activeData.option.yAxisNameI18nCode) activeData.option.yAxisName = t(activeData.option.yAxisNameI18nCode, activeData.option.yAxisName);
    }
    return activeData;
  });

  const getBindValue = computed(() => ({
    activeData: props.item,
    key: useNeedKeyList.includes(props.item.futureKey) ? props.item.renderKey : '',
  }));

  function getComponents(e: string): Promise<any> {
    if (chartList.includes(e)) e = 'chart';
    const name = 'H' + upperFirst(e);
    let page = `../../Portal/${name}/index.vue`;
    return new Promise((resolve, reject) => {
      let flag = true;
      for (const path in allModules) {
        if (path == page) {
          flag = false;
          allModules[path]().then(mod => {
            resolve(mod);
          });
        }
      }
      if (flag) reject('该文件不存在:' + page);
    });
  }
  function handleClick(data) {
    emitter.emit('handlerActive', data);
  }
  function handleRemoveItem(i, parent) {
    parent.splice(i, 1);
  }
  function handleAddComponent(val) {
    emitter.emit('addComponent', { val: val, item: props.item });
  }
  function handleTabClick() {
    nextTick(() => {
      const active = props.item.active;
      const list = props.item.children;
      for (let i = 0; i < list.length; i++) {
        if (list[i].name === active && list[i].children && list[i].children.length) {
          list[i].children.map(ele => {
            emitter.emit('eChart' + ele.i);
          });
        }
      }
    });
  }
</script>
<style lang="less" scoped>
  .portal-box-tab {
    :deep(.ant-tabs-nav) {
      margin-bottom: unset;
    }
    :deep(.ant-tabs-content) {
      height: 100%;
    }
  }
</style>
