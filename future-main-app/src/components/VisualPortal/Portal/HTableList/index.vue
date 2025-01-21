<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-table" ref="tableListRef">
      <a-table :data-source="list" v-bind="getTableBindValues" ref="tableElRef" v-if="getOption.styleType == 1" :class="{ 'custom-table': getBorder }" />
      <template v-else>
        <template v-if="list.length">
          <div class="item" v-for="(item, i) in list" :key="i" :style="getItemStyle(i)" @click="handleRowClick(item)">
            <div class="top-box">
              <span class="name" :style="getColumnsStyle(0)"> {{ item[getColumns[0].filedName] }}</span>
              <span class="time" :style="getColumnsStyle(2)" v-if="getOption.styleType == 2">{{ item[getColumns[2].filedName] }}</span>
            </div>
            <div class="pb-8px" :style="getColumnsStyle(1)" v-if="getOption.styleType == 2 || getOption.describe">{{ item[getColumns[1].filedName] }} </div>
            <div class="pb-8px" :style="getColumnsStyle(2)" v-if="getOption.styleType == 3">{{ item[getColumns[2].filedName] }} </div>
          </div>
        </template>
        <div class="portal-common-noData" v-else>
          <future-empty />
        </div>
      </template>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import CardHeader from '../CardHeader/index.vue';
  import { useTable } from '../../Design/hooks/useTable';

  const props = defineProps(['activeData']);
  const { getTableBindValues, list, getColumns, getOption, getItemStyle, getColumnsStyle, tableListRef, tableElRef, getBorder, handleRowClick } = useTable(
    props.activeData,
  );
</script>
<style lang="less" scoped>
  .portal-card-table {
    overflow-y: auto !important;
    &:hover {
      cursor: pointer;
    }
    .item {
      display: flex;
      flex-direction: column;
      margin: 0 24px;
      border-bottom: 1px solid @border-color-base1;

      .top-box {
        display: flex;
        align-items: center;
        padding: 12px 0 8px;

        .name {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .time {
          width: 120px;
          text-align: right;
        }
      }
    }
  }
</style>
