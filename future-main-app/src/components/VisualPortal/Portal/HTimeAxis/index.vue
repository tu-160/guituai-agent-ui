<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-timeline" :class="{ 'portal-card-timeline-vertical': getOption.layout > 4 }">
      <template v-if="timeList.length">
        <timeline v-if="getOption.layout === 1 || getOption.layout === 2 || getOption.layout === 3 || getOption.layout === 4" :mode="getMode(getOption.layout)">
          <timeline-item v-for="(item, index) in timeList" :color="getColor(index)" :position="getPosition(index)" @click="handleClick(item)">
            <template v-if="getOption.styleType == 1">
              <p class="timestamp">{{ item.timestamp }}</p>
              <p>{{ item.content }}</p>
            </template>
            <template v-else>
              <p class="timestamp">{{ item.timestamp }}</p>
              <a-card class="!p-10px !mt-5px">
                {{ item.content }}
              </a-card>
            </template>
          </timeline-item>
        </timeline>
        <timeline
          class="timeline-vertical timeline-top-bottom"
          :class="{
            'timeline-top': getOption.layout == 5,
            'timeline-bottom': getOption.layout == 6,
            'timeline-bottom-box': getOption.layout == 7,
            'timeline-top-box': getOption.layout == 8,
            'card-timeline-box': getOption.styleType == 2,
          }"
          v-else>
          <timeline-item v-for="(item, index) in timeList" :color="getColor(index)" :position="getPosition(index)" @click="handleClick(item)">
            <template v-if="getOption.styleType == 1">
              <p class="timestamp">{{ item.timestamp }}</p>
              <p>{{ item.content }}</p>
            </template>
            <template v-else>
              <p class="timestamp">{{ item.timestamp }}</p>
              <a-card class="!p-10px !mt-5px">
                {{ item.content }}
              </a-card>
            </template>
          </timeline-item>
        </timeline>
      </template>
      <div class="portal-common-noData" v-else>
        <future-empty />
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { useCommon } from '../../Design/hooks/useCommon';
  import { Timeline, TimelineItem } from 'ant-design-vue';
  import { useGo } from '@/hooks/web/usePage';
  import { encryptByBase64 } from '@/utils/cipher';

  const props = defineProps(['activeData']);
  const { CardHeader, timeList, getOption } = useCommon(props.activeData);
  const go = useGo();

  function getPosition(index) {
    const layout = getOption.value.layout;
    if (index % 2 === 0) {
      if (layout === 1) return 'right';
      if (layout === 2) return 'left';
    } else {
      if (layout === 1) return 'left';
      if (layout === 3) return 'right';
    }
  }
  function getMode(layout) {
    if (layout == 1 || layout == 2) return 'alternate';
    if (layout == 3) return 'right';
  }
  function getColor(index) {
    if (index == 0) return '#3ED538';
    if (timeList.value?.length - 1 == index) return '#1990FA';
    return '#E4E7ED';
  }
  function handleClick(row) {
    if (!props.activeData.option?.urlAddress) return;
    let urlAddress = JSON.parse(JSON.stringify(props.activeData.option.urlAddress));
    const regex = /\${[^{}]+}/g;
    urlAddress = urlAddress.replace(regex, match => {
      const key = match.slice(2, -1);
      let value = '';
      if (key == 'name') value = row['content'];
      if (key == 'timestamp') value = row['timestamp'];
      return value || match;
    });
    if (props.activeData.option.target == '_self') {
      go(`/externalLink?href=${encodeURIComponent(encryptByBase64(urlAddress))}`);
    } else {
      window.open(urlAddress, props.activeData.option.target);
    }
  }
</script>
<style lang="less" scoped>
  .portal-card-timeline {
    .timestamp {
      color: @text-color-secondary;
    }
  }
  .portal-card-timeline-vertical {
    display: flex;
    align-items: center;
    .timeline-vertical {
      display: flex;
      white-space: nowrap;

      .ant-timeline-item-tail {
        border-top: 2px solid #f0f0f0;
      }
    }
    .timeline-top-bottom {
      display: flex;
      white-space: nowrap;
      :deep(.ant-timeline-item-tail) {
        width: 100%;
        border-left: unset;
        border-top: 2px solid #e4e7ed;
        top: calc(50% - 2px);
      }
      :deep(.ant-timeline-item-head) {
        top: calc(50% - 7px);
      }
    }
    .timeline-top {
      :deep(.ant-timeline-item:nth-of-type(even)) {
        .ant-timeline-item-content {
          top: 40px;
          margin-left: unset;
        }
      }
      :deep(.ant-timeline-item:nth-of-type(odd)) {
        .ant-timeline-item-content {
          top: -24px;
          margin-left: unset;
        }
      }
    }
    .timeline-bottom {
      :deep(.ant-timeline-item:nth-of-type(even)) {
        .ant-timeline-item-content {
          top: -24px;
          margin-left: unset;
        }
      }
      :deep(.ant-timeline-item:nth-of-type(odd)) {
        .ant-timeline-item-content {
          top: 40px;
          margin-left: unset;
        }
      }
    }
    .timeline-top-box {
      display: flex;
      white-space: nowrap;
      :deep(.ant-timeline-item-tail) {
        width: 100%;
        left: unset;
        top: 4px;
        border-left: unset;
        border-top: 2px solid #e4e7ed;
      }
      :deep(.ant-timeline-item-head) {
        top: -1px;
        bottom: unset;
      }
      :deep(.ant-timeline-item-content) {
        padding: 20px 20px 0 0;
        margin-left: unset;
      }
    }
    .timeline-bottom-box {
      display: flex;
      white-space: nowrap;
      margin-bottom: 43px;
      :deep(.ant-timeline-item) {
        padding-bottom: 10px;
      }
      :deep(.ant-timeline-item-tail) {
        width: 100%;
        top: unset;
        bottom: 4px;
        border-left: unset;
        border-top: unset;
        border-bottom: 2px solid #e4e7ed;
      }
      :deep(.ant-timeline-item-head) {
        top: unset;
        bottom: -1px;
      }
      :deep(.ant-timeline-item-content) {
        padding: 20px 20px 0 0;
        margin-left: unset;
      }
    }
    .card-timeline-box {
      &.timeline-top {
        :deep(.ant-timeline-item:nth-of-type(even)) {
          .ant-timeline-item-content {
            top: 55px;
          }
        }
        :deep(.ant-timeline-item:nth-of-type(odd)) {
          .ant-timeline-item-content {
            top: -42px;
          }
        }
      }

      &.timeline-bottom {
        :deep(.ant-timeline-item:nth-of-type(even)) {
          .ant-timeline-item-content {
            top: -42px;
          }
        }
        :deep(.ant-timeline-item:nth-of-type(odd)) {
          .ant-timeline-item-content {
            top: 55px;
          }
        }
      }
    }
  }
</style>
