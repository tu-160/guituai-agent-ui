<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body h-full">
      <template v-if="getValue">
        <video
          class="h-full w-full"
          :key="key"
          controls
          :loop="activeData.option.playNumber === 2"
          :autoplay="activeData.option.videoAutoplay"
          :muted="activeData.option.mutePlay">
          <source :src="getValue" type="video/mp4" />
        </video>
      </template>
      <div class="portal-common-noData" v-else>
        <img src="../../../../assets/images/portal-nodata.png" alt="" class="noData-img" />
        <p class="noData-txt">暂无视频</p>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { useGlobSetting } from '@/hooks/setting';
  import { getParamList } from '@/utils/future';

  const props = defineProps(['activeData']);
  const key = ref<any>();
  const globSetting = useGlobSetting();

  const getValue = computed(() => {
    key.value = +new Date();
    let val = props.activeData.option.defaultValue;
    if (props.activeData.option.styleType == 1 && val.url) val = globSetting.apiUrl + val.url;
    return val;
  });

  function initData() {
    if (props.activeData.dataType === 'dynamic') {
      props.activeData.option.defaultValue = '';
      const propsApi = props.activeData.propsApi;
      if (!propsApi) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(propsApi, query).then(res => {
        props.activeData.option.defaultValue = res.data;
      });
    }
  }

  onMounted(() => initData());
</script>
