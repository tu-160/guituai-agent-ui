<template>
  <template v-if="type == 1">
    <template v-if="showType == 'pc'">
      <a-form-item label="链接类型">
        <future-select
          v-model:value="activeData.option.linkType"
          :options="linkTypeList"
          placeholder="请选择"
          showSearch
          allowClear
          @change="onLinkTypeChange(1)" />
      </a-form-item>
      <a-form-item label="菜单名称" v-if="activeData.option.linkType == 1">
        <future-tree-select
          v-model:value="activeData.option.moduleId"
          placeholder="请选择"
          lastLevel
          allowClear
          showSearch
          :options="menuList"
          lastLevelKey="hasModule"
          :lastLevelValue="true"
          @change="getSelectValue" />
      </a-form-item>
      <a-form-item v-if="activeData.option.linkType == 2">
        <template #label>链接地址<BasicHelp :text="getText" /></template>
        <a-input v-model:value="activeData.option.urlAddress" placeholder="请输入">
          <template #addonAfter>
            <future-select v-model:value="activeData.option.linkTarget" :options="typeList" class="w-90px" />
          </template>
        </a-input>
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="链接类型">
        <future-select
          v-model:value="activeData.option.appLinkType"
          :options="linkTypeList"
          placeholder="请选择"
          showSearch
          allowClear
          @change="onLinkTypeChange(1, 'app')" />
      </a-form-item>
      <a-form-item label="菜单名称" v-if="activeData.option.appLinkType == 1">
        <future-tree-select
          v-model:value="activeData.option.appModuleId"
          placeholder="请选择"
          lastLevel
          allowClear
          showSearch
          :options="appMenuList"
          lastLevelKey="hasModule"
          :lastLevelValue="true"
          @change="getSelectValue" />
      </a-form-item>
      <a-form-item v-if="activeData.option.appLinkType == 2">
        <template #label>链接地址<BasicHelp :text="getText" /></template>
        <a-input v-model:value="activeData.option.appUrlAddress" placeholder="请输入" />
      </a-form-item>
    </template>
  </template>
  <template v-else>
    <template v-if="showType == 'pc'">
      <a-form-item label="右上角链接">
        <future-select
          v-model:value="activeData.card.linkType"
          :options="linkTypeList"
          placeholder="请选择"
          showSearch
          allowClear
          @change="onLinkTypeChange(2)" />
      </a-form-item>
      <a-form-item label="菜单名称" v-if="activeData.card.linkType == 1">
        <future-tree-select
          v-model:value="activeData.card.moduleId"
          placeholder="请选择"
          lastLevel
          allowClear
          showSearch
          :options="menuList"
          lastLevelKey="hasModule"
          :lastLevelValue="true"
          @change="getSelectVal" />
      </a-form-item>
      <a-form-item v-if="activeData.card.linkType == 2">
        <template #label>链接地址<BasicHelp :text="getText" /></template>
        <a-input v-model:value="activeData.card.urlAddress" placeholder="请输入">
          <template #addonAfter>
            <future-select v-model:value="activeData.card.linkTarget" :options="typeList" class="w-90px" />
          </template>
        </a-input>
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="右上角链接">
        <future-select
          v-model:value="activeData.card.appLinkType"
          :options="linkTypeList"
          placeholder="请选择"
          showSearch
          allowClear
          @change="onLinkTypeChange(2, 'app')" />
      </a-form-item>
      <a-form-item label="菜单名称" v-if="activeData.card.appLinkType == 1">
        <future-tree-select
          v-model:value="activeData.card.appModuleId"
          placeholder="请选择"
          lastLevel
          allowClear
          showSearch
          :options="appMenuList"
          lastLevelKey="hasModule"
          :lastLevelValue="true"
          @change="getSelectVal" />
      </a-form-item>
      <a-form-item v-if="activeData.card.appLinkType == 2">
        <template #label>链接地址<BasicHelp :text="getText" /></template>
        <a-input v-model:value="activeData.card.appUrlAddress" placeholder="请输入" />
      </a-form-item>
    </template>
  </template>
</template>
<script lang="ts" setup>
  import { linkTypeList, typeList } from '../helper/dataMap';
  import { computed } from 'vue';

  const props = defineProps({
    activeData: { type: Object, default: () => {} },
    menuList: { type: Array, default: () => [] },
    appMenuList: { type: Array, default: () => [] },
    type: { type: Number, default: 1 },
    showType: { type: String, default: 'pc' },
  });

  const getText = computed(() => {
    const text = props.activeData.futureKey == 'text' ? '，例:https://xxx.com?xxx=${field}，参数可选' : '';
    return '地址以http://或https://开头' + text;
  });

  function getSelectValue(_data, item) {
    const isPc = props.showType == 'pc';
    props.activeData.option[isPc ? 'type' : 'appType'] = item.type;
    props.activeData.option[isPc ? 'urlAddress' : 'appUrlAddress'] = item.urlAddress;
    if (item.linkTarget && isPc) props.activeData.option.linkTarget = item.linkTarget;
    if (item.propertyJson) props.activeData.option[isPc ? 'propertyJson' : 'appPropertyJson'] = item.propertyJson;
  }
  function getSelectVal(_data, item) {
    const isPc = props.showType == 'pc';
    props.activeData.card[isPc ? 'type' : 'appType'] = item.type;
    props.activeData.card[isPc ? 'urlAddress' : 'appUrlAddress'] = item.urlAddress;
    if (item.linkTarget && isPc) props.activeData.card.linkTarget = item.linkTarget;
    if (item.propertyJson) props.activeData.card[isPc ? 'propertyJson' : 'appPropertyJson'] = item.propertyJson;
  }
  function onLinkTypeChange(type, showType?) {
    if (type == 1) {
      if (showType == 'app') {
        props.activeData.option.appType = '';
        props.activeData.option.appUrlAddress = '';
        props.activeData.option.appModuleId = '';
      } else {
        props.activeData.option.type = '';
        props.activeData.option.moduleId = '';
        props.activeData.option.linkTarget = '_self';
        props.activeData.option.urlAddress = '';
      }
    } else {
      if (showType == 'app') {
        props.activeData.card.appType = '';
        props.activeData.card.appUrlAddress = '';
        props.activeData.card.appModuleId = '';
      } else {
        props.activeData.card.type = '';
        props.activeData.card.moduleId = '';
        props.activeData.card.linkTarget = '_self';
        props.activeData.card.urlAddress = '';
      }
    }
  }
</script>
