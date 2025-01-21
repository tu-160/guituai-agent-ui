<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="commonFunc-box-body">
      <web-link
        class="item com-hover"
        :linkType="item.linkType"
        :urlAddress="item.urlAddress"
        :linkTarget="item.linkTarget"
        :type="item.type"
        :propertyJson="item.propertyJson"
        v-for="(item, i) in list"
        :key="i"
        :style="{ width: 100 / (activeData.option.rowNumber || 5) + '%' }"
        :class="{ 'item-border': activeData.option.showBorder, 'item-horizontal-box': activeData.option.styleType == 2 }">
        <i :class="item.icon" :style="{ color: item.iconBgColor }"></i>
        <p
          class="name"
          :style="{
            'font-size': activeData.option.labelFontSize + 'px',
            'font-weight': activeData.option.labelFontWeight ? 'bolder' : 'normal',
            color: activeData.option.labelFontColor,
          }">
          {{ item.fullName }}
        </p>
      </web-link>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import webLink from '../Link/index.vue';

  const props = defineProps(['activeData']);
  const list = ref<any[]>([]);

  onMounted(() => {
    list.value = props.activeData.option.defaultValue;
  });
</script>
<style lang="less" scoped>
  .commonFunc-box-body {
    display: flex;
    flex-wrap: wrap;
    .item-border {
      box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
      &:hover {
        position: relative;
        z-index: 1;
        box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
      }
    }
    .item-horizontal-box {
      flex-direction: unset !important;
      justify-content: unset !important;
      padding-left: 35px;
      .name {
        padding-left: 5px;
      }
    }
    .item {
      height: 141px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.15;
      i {
        display: inline-block;
        height: 40px;
        font-size: 40px;
        margin-bottom: 10px;
      }
      .name {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
</style>
