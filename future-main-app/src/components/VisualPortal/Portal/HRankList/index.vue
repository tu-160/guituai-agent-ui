<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-rankList" :class="{ 'mx-10px': getOption.styleType == 3 || getOption.styleType == 4 }" ref="rankListRef">
      <a-table :data-source="list" v-bind="getTableBindValues" ref="tableElRef" v-if="getOption.styleType == 1 || getOption.styleType == 2">
        <template #bodyCell="{ column, index }">
          <template v-if="column.key === 'rank'">
            <div v-if="getOption.styleType == 1" class="rank-box">
              <img v-if="index == 0" src="../../../../assets/images/rankList/rank1.png" />
              <img v-else-if="index == 1" src="../../../../assets/images/rankList/rank2.png" />
              <img v-else-if="index == 2" src="../../../../assets/images/rankList/rank3.png" />
              <span v-else class="rank-box-span">{{ index + 1 }}</span>
            </div>
            <div v-if="getOption.styleType == 2" class="rank-box">
              <img v-if="index == 0" src="../../../../assets/images/rankList/badge1.png" />
              <img v-else-if="index == 1" src="../../../../assets/images/rankList/badge2.png" />
              <img v-else-if="index == 2" src="../../../../assets/images/rankList/badge3.png" />
              <span v-else>{{ index + 1 }}</span>
            </div>
          </template>
        </template>
      </a-table>
      <div class="cup-medal-box" v-else>
        <div v-if="getOption.styleType == 3">
          <div class="cup-top-box" @click="handleRowClick(secondData)">
            <div class="cup2-box cup-box">
              <img src="../../../../assets/images/rankList/cup2.png" />
              <div class="top-bg"></div>
              <div class="cup-box-content">
                <p v-if="getOption.columnOptions.length">{{ secondData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">
                  {{ secondData[getOption.columnOptions[1].value] }}
                </p>
              </div>
            </div>
            <div class="cup1-box cup-box" @click="handleRowClick(firstData)">
              <img src="../../../../assets/images/rankList/cup1.png" />
              <div class="top-bg"></div>
              <div class="cup-box-content">
                <p v-if="getOption.columnOptions.length">{{ firstData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">
                  {{ firstData[getOption.columnOptions[1].value] }}
                </p>
              </div>
            </div>
            <div class="cup3-box cup-box" @click="handleRowClick(thirdData)">
              <img src="../../../../assets/images/rankList/cup3.png" />
              <div class="top-bg"></div>
              <div class="cup-box-content">
                <p v-if="getOption.columnOptions.length">{{ thirdData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">{{ thirdData[getOption.columnOptions[1].value] }} </p>
              </div>
            </div>
          </div>
        </div>
        <div class="medal-box" v-else>
          <div class="medal-top-box">
            <div class="medal-box medal2-box" @click="handleRowClick(secondData)">
              <img src="../../../../assets/images/rankList/medal2.png" />
              <div class="medal-box-content">
                <p v-if="getOption.columnOptions.length">{{ secondData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">
                  {{ secondData[getOption.columnOptions[1].value] }}
                </p>
              </div>
            </div>
            <div class="medal-box medal1-box" @click="handleRowClick(firstData)">
              <img src="../../../../assets/images/rankList/medal1.png" />
              <div class="medal-box-content">
                <p v-if="getOption.columnOptions.length">{{ firstData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">
                  {{ firstData[getOption.columnOptions[1].value] }}
                </p>
              </div>
            </div>
            <div class="medal-box medal3-box" @click="handleRowClick(thirdData)">
              <img src="../../../../assets/images/rankList/medal3.png" />
              <div class="medal-box-content">
                <p v-if="getOption.columnOptions.length">{{ thirdData[getOption.columnOptions[0].value] }} </p>
                <p v-if="getOption.columnOptions.length > 1">{{ thirdData[getOption.columnOptions[1].value] }} </p>
              </div>
            </div>
          </div>
        </div>
        <a-table :data-source="otherDataList" v-bind="getTableBindValues" v-if="otherDataList.length">
          <template #bodyCell="{ column, index }">
            <template v-if="column.key === 'rank'">
              <span>{{ index + 4 }}</span>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { computed, unref, watch, ref, nextTick } from 'vue';
  import { useCommon } from '../../Design/hooks/useCommon';
  import { useElementBounding } from '@vueuse/core';
  import { useGo } from '@/hooks/web/usePage';
  import { encryptByBase64 } from '@/utils/cipher';

  const props = defineProps(['activeData']);
  const { CardHeader, list, firstData, secondData, thirdData, otherDataList } = useCommon(props.activeData);
  const rankListRef = ref();
  const tableElRef = ref();
  const { height } = useElementBounding(rankListRef);
  const go = useGo();

  const getTableBindValues = computed(() => {
    const styleType = props.activeData.option.styleType;
    const h = styleType == 1 || styleType == 2 ? 38 : styleType == 3 ? 229 : 213;
    return {
      columns: unref(getColumns),
      pagination: false,
      size: 'small',
      rowKey: 'id',
      ellipsis: true,
      scroll: { y: height.value - h },
      customRow: record => {
        return {
          onClick: () => handleRowClick(record), // 点击事件处理
        };
      },
    };
  });
  const getOption = computed(() => props.activeData.option);
  const getColumns = computed(() => {
    const column = { title: '排名', dataIndex: 'rank', key: 'rank', width: 70, align: 'center' };
    const columnList = props.activeData.option.columnOptions.map(o => {
      return {
        title: o.label,
        dataIndex: o.value,
        key: o.value,
        width: 180,
        align: 'center',
      };
    });
    return [column, ...columnList];
  });

  watch(
    () => height.value,
    val => {
      nextTick(() => {
        const tableEl = tableElRef.value?.$el;
        let bodyEl = tableEl?.querySelector('.ant-table-body');
        if (bodyEl) bodyEl!.style.height = `${val - 38}px`;
      });
    },
  );

  function handleRowClick(row) {
    if (!props.activeData.option?.urlAddress) return;
    let urlAddress = JSON.parse(JSON.stringify(props.activeData.option.urlAddress));
    const regex = /\${[^{}]+}/g;
    urlAddress = urlAddress.replace(regex, match => {
      const key = match.slice(2, -1);
      return row[key] || match;
    });
    if (props.activeData.option.target == '_self') {
      go(`/externalLink?href=${encodeURIComponent(encryptByBase64(urlAddress))}`);
    } else {
      window.open(urlAddress, props.activeData.option.target);
    }
  }
</script>
