<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="dataBoard-box-body">
      <web-link
        :linkType="item.linkType"
        :urlAddress="item.urlAddress"
        :linkTarget="item.linkTarget"
        :type="item.type"
        :propertyJson="item.propertyJson"
        class="dataBoard-item"
        v-for="(item, i) in list"
        :key="i"
        :style="{ width: 100 / (activeData.option.rowNumber || 4) + '%' }"
        :class="{ 'item-border': activeData.option.showBorder }">
        <i
          :class="item.icon + ' dataBoard-body-item'"
          :style="{ color: item.iconColor, background: item.iconColor ? item.iconColor.replace('rgb', 'rgba').replace(')', ',0.1)') : '' }"></i>
        <div class="text">
          <p class="num">
            <span
              :style="{
                'font-size': activeData.option.valueFontSize + 'px',
                'font-weight': activeData.option.valueFontWeight ? 'bolder' : 'normal',
                color: activeData.option.valueFontColor,
              }">
              {{ item.num }}
            </span>
            <span
              class="unit"
              :style="{
                'font-size': activeData.option.unitFontSize + 'px',
                'font-weight': activeData.option.unitFontWeight ? 'bolder' : 'normal',
                color: activeData.option.unitFontColor,
              }">
              {{ item.unit }}
            </span>
          </p>
          <p
            class="name"
            :style="{
              'font-size': activeData.option.labelFontSize + 'px',
              'font-weight': activeData.option.labelFontWeight ? 'bolder' : 'normal',
              color: activeData.option.labelFontColor,
            }">
            {{ item.fullName }}
          </p>
        </div>
      </web-link>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import webLink from '../Link/index.vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { getParamList } from '@/utils/future';

  const props = defineProps(['activeData']);
  const list = ref<any[]>([]);

  function initData() {
    list.value = JSON.parse(JSON.stringify(props.activeData.option.defaultValue));
    list.value = list.value.map(o => ({
      ...o,
      urlAddress: resolvedURL(o.urlAddress, o.num),
    }));
    if (props.activeData.dataType == 'dynamic') {
      for (let i = 0; i < list.value.length; i++) {
        list.value[i].num = '';
      }
      if (!props.activeData.propsApi) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(props.activeData.propsApi, query).then(res => {
        for (let i = 0; i < list.value.length; i++) {
          list.value[i].num = list.value[i].field ? res.data[list.value[i].field] : '';
          list.value[i].urlAddress = resolvedURL(list.value[i].urlAddress, list.value[i].num);
        }
      });
    }
  }
  function resolvedURL(urlAddress, val) {
    if (!urlAddress) return;
    return urlAddress.replace(/\${[^{}]+}/g, match => {
      const key = match.slice(2, -1);
      return key == 'Field' || key == 'field' ? val : match;
    });
  }

  onMounted(() => initData());
</script>
<style lang="less" scoped>
  .dataBoard-box-body {
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
    .dataBoard-item {
      padding-left: 30px;
      height: 141px;
      display: flex;
      align-items: center;
      overflow: hidden;

      .dataBoard-body-item {
        width: 66px;
        height: 66px;
        margin-right: 16px;
        border-radius: 50%;
        text-align: center;
        line-height: 66px;
        font-size: 36px;
        flex-shrink: 0;
      }
      .text {
        display: inline-block;
        height: 56px;
        .num {
          font-size: 20px;
          line-height: 36px;
          height: 36px;
          overflow: hidden;
          .unit {
            padding-left: 3px;
          }
        }
        .name {
          font-size: 14px;
          color: #666;
          overflow: hidden;
        }
      }
    }
  }
</style>
