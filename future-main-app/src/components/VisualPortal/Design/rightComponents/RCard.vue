<template>
  <a-collapse-panel>
    <template #header>卡片设置</template>
    <a-form-item label="标题名称">
      <future-i18n-input v-model:value="activeData.title" v-model:i18n="activeData.titleI18nCode" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="字体大小">
      <a-input-number v-model:value="activeData.card.titleFontSize" placeholder="请输入" :min="12" :max="25" />
    </a-form-item>
    <a-form-item label="字体加粗">
      <a-switch v-model:checked="activeData.card.titleFontWeight" />
    </a-form-item>
    <a-form-item label="字体颜色">
      <future-color-picker v-model:value="activeData.card.titleFontColor" size="small" />
    </a-form-item>
    <a-form-item label="字体位置">
      <future-radio v-model:value="activeData.card.titleLeft" :options="alignList" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-form-item label="背景色">
      <future-color-picker v-model:value="activeData.card.titleBgColor" size="small" />
    </a-form-item>
    <a-form-item label="图标">
      <FutureIconPicker v-model:value="activeData.card.cardIcon" />
    </a-form-item>
    <a-form-item label="图标颜色">
      <future-color-picker v-model:value="activeData.card.cardIconColor" size="small" />
    </a-form-item>
    <a-form-item label="右上角名称">
      <future-i18n-input v-model:value="activeData.card.cardRightBtn" v-model:i18n="activeData.card.cardRightBtnI18nCode" placeholder="请输入" />
    </a-form-item>
    <Link v-if="activeData.card.cardRightBtn" :activeData="activeData" :menuList="menuList" :appMenuList="appMenuList" :showType="showType" :type="2" />
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { alignList } from '../helper/dataMap';
  import Link from './RLink.vue';

  defineProps(['activeData', 'menuList', 'appMenuList', 'showType']);
</script>
