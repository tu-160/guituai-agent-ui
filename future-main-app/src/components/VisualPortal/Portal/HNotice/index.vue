<template>
  <a-card class="portal-card-box portal-notice-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-table !overflow-auto" ref="tableListRef">
      <a-table
        :data-source="list"
        v-bind="getTableBindValues"
        ref="tableElRef"
        :class="{ 'custom-table': getBorder }"
        v-if="getOption.styleType == 1 && !!getTableBindValues.columns?.length">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fullName'">
            <span class="title" @click="readInfo(record)" :title="'【' + record.category + '】' + record[column.key]">
              <span v-if="getOption.columnData.filter(o => o.filedName === 'classify')[0]?.show">{{ `【${record.category}】` }}</span>
              {{ record[column.key] }}
            </span>
          </template>
        </template>
      </a-table>
      <template v-else>
        <template v-if="list.length">
          <div class="item" v-for="(item, i) in list" :key="i" :style="getItemStyle(i)">
            <div class="left-box" v-if="activeData.option.showImage">
              <img :src="getImgUrl(item)" />
            </div>
            <div class="right-box">
              <div class="right-top-box">
                <span class="type-box" v-if="getColumns[0].show" :style="getTypeStyle(item.category)">{{ item.category || '其他' }}</span>
                <span class="title-box" v-if="getColumns[1].show" :style="getColumnsStyle(1)" @click="readInfo(item)">{{ item.fullName }}</span>
                <span v-if="getColumns[3].show && getOption.styleType == 2" :style="getColumnsStyle(3)">
                  {{ getColumns[3].timeClassify == 1 ? item.creatorTime : item.releaseTime }}
                </span>
              </div>
              <div class="content-box pt-4px" v-if="getColumns[2].show" :style="getColumnsStyle(2)">{{ item.excerpt }}</div>
              <div class="pt-4px" v-if="getColumns[3].show && getOption.styleType == 3" :style="getColumnsStyle(3)">
                {{ getColumns[3].timeClassify == 1 ? item.creatorTime : item.releaseTime }}
              </div>
            </div>
          </div>
        </template>
        <div class="portal-common-noData" v-else>
          <future-empty />
        </div>
      </template>
    </div>
  </a-card>
  <Detail @register="registerDetail" />
</template>
<script lang="ts" setup>
  import CardHeader from '../CardHeader/index.vue';
  import { useTable } from '../../Design/hooks/useTable';
  import Detail from '@/views/system/notice/Detail.vue';
  import { useModal } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import noticeImg from '@/assets/images/gg.png';
  import noticeImg1 from '@/assets/images/tz.png';

  const props = defineProps(['activeData']);
  const globSetting = useGlobSetting();
  const [registerDetail, { openModal: openDetailModal }] = useModal();
  const { getTableBindValues, list, getColumns, getOption, getItemStyle, getColumnsStyle, tableListRef, tableElRef, getBorder } = useTable(props.activeData);

  function readInfo(item) {
    openDetailModal(true, { type: 1, id: item.id });
  }
  function getImgUrl(item) {
    const defaultImg = item.category === '公告' ? noticeImg : noticeImg1;
    return item.coverImage ? globSetting.apiUrl + item.coverImage : defaultImg;
  }
  function getTypeStyle(category) {
    const backgroundColor = category === '公告' ? 'rgba(99,9,244,0.05)' : category === '通知' ? 'rgba(9,63,244,0.05)' : 'rgba(244,135,9,0.05)';
    const color = category === '公告' ? '#6309F4' : category === '通知' ? '#093FF4' : '#F48709';
    return { backgroundColor, color } as any;
  }
</script>
<style lang="less" scoped>
  .portal-notice-box {
    .title {
      cursor: pointer;
      &:hover {
        color: @primary-color;
      }
    }
    .item {
      display: flex;
      padding: 14px 0 12px;
      margin: 0 10px;
      border-bottom: 1px solid @border-color-base1;
      .left-box {
        flex-shrink: 0;
        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .right-box {
        background: unset;
        flex: 1;
        padding-left: 10px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .right-top-box {
          display: flex;
          align-items: center;
          .type-box {
            display: inline-block;
            width: 32px;
            height: 17px;
            font-size: 12px;
            border-radius: 2px;
            text-align: center;
            line-height: 17px;
            color: #6309f4;
            background: rgba(99, 9, 244, 0.04);
          }
          .title-box {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 4px;
            cursor: pointer;
            &:hover {
              color: @primary-color!important;
            }
          }
        }
        .content-box {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
