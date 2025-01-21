<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="新增" :width="600" @ok="handleSubmit" class="map-center-select-modal" destroyOnClose>
    <div class="map-contain">
      <div id="container" class="map"></div>
      <a-auto-complete
        class="search-contain"
        v-model:value="innerValue.name"
        :options="options"
        placeholder="输入搜索或直接在下图选择定位中心"
        @select="onSelect"
        @search="debounceOnSearch"
        @dropdownVisibleChange="onDropdownVisibleChange">
        <template #option="item">
          <div @click="onSelect(item)"> {{ item.name }}</div>
        </template>
      </a-auto-complete>
    </div>
    <div class="label-contain">
      <span class="label">定位范围</span>
      <span class="tips">以定位中心为圆心设置定位半径，建议范围500-1000米</span>
    </div>
    <a-input-number class="!w-150px" v-model:value="innerValue.radius" :min="1" addon-after="米" @change="onRadiusChange" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import AMapLoader from '@amap/amap-jsapi-loader';
  import { getInputTips } from '@/api/basic/common';
  import { useDebounceFn } from '@vueuse/core';
  import { useMessage } from '@/hooks/web/useMessage';

  interface State {
    AMap: any;
    map: any;
    innerValue: any;
    options: any[];
    marker: any;
  }

  const state = reactive<State>({
    AMap: null,
    map: null,
    innerValue: {
      lng: '',
      lat: '',
      radius: 500,
    },
    options: [],
    marker: undefined,
  });
  const { innerValue, options } = toRefs(state);
  const globSetting = useGlobSetting();
  const { createMessage } = useMessage();
  const debounceOnSearch = useDebounceFn(onSearch, 300);
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);

  function init(data) {
    state.innerValue = {
      lng: '',
      lat: '',
      radius: 500,
    };
    if (data.item) state.innerValue = data.item;
    initMap();
  }
  function initMap() {
    AMapLoader.load({
      key: globSetting.aMapJsKey,
      version: '2.0',
      plugins: ['AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
    }).then(AMap => {
      state.AMap = AMap;
      const query: any = {
        viewMode: '3D',
        zoom: 16,
      };
      const isEdit = state.innerValue && state.innerValue.lng && state.innerValue.lat;
      if (isEdit) query.center = [state.innerValue.lng, state.innerValue.lat];
      state.map = new AMap.Map('container', query);
      if (isEdit) handleMarker(state.innerValue.lng, state.innerValue.lat);
      state.map.on('click', handleCenter);
    });
  }
  function handleCenter(e) {
    const { lng, lat } = e.lnglat;
    handleMarker(lng, lat);
    handleGetAddress([lng, lat]);
  }
  function onSearch(searchText: string) {
    const query = {
      key: globSetting.aMapWebKey,
      keywords: searchText,
    };
    getInputTips(query).then(res => {
      if (res.data.status == '1') {
        options.value = res.data.tips || [];
      } else {
        createMessage.error(res.data.info || res.data.infocode);
      }
    });
  }
  function onSelect(item) {
    state.innerValue.name = item.name;
    if (!item.location || !item.location.length) {
      handleGetLngLat(item.name);
    } else {
      const [lng, lat] = item.location.split(',');
      handleMarker(lng, lat);
    }
  }
  function handleMarker(lng, lat) {
    state.innerValue.lng = lng;
    state.innerValue.lat = lat;
    state.marker && state.map.remove(state.marker);
    state.marker = new state.AMap.Marker({
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      position: [lng, lat],
      offset: new state.AMap.Pixel(-12, -30),
    });
    state.map.add(state.marker);
    state.map.setFitView();
  }
  function handleGetAddress(position) {
    var geocoder = new state.AMap.Geocoder();
    geocoder.getAddress(position, function (status, res) {
      if (status === 'complete' && res.info === 'OK') {
        state.innerValue.name = res.regeocode.formattedAddress;
      }
    });
  }
  function handleGetLngLat(address) {
    var geocoder = new state.AMap.Geocoder();
    geocoder.getLocation(address, function (status, res) {
      if (status === 'complete' && res.info === 'OK') {
        const { lng, lat } = res.geocodes[0].location;
        handleMarker(lng, lat);
      }
    });
  }
  function handleSubmit() {
    if (!state.innerValue.lat || !state.innerValue.lng) return createMessage.warning('请输入定位中心');
    if (!state.innerValue.radius) return createMessage.warning('定位范围不能为空');
    emit('confirm', state.innerValue);
    closeModal();
  }
  function onDropdownVisibleChange(e) {
    if (e) options.value = [];
  }
  function onRadiusChange(val) {
    if (!val) state.innerValue.radius = 1;
  }
</script>
<style lang="less">
  .map-center-select-modal {
    .scrollbar {
      padding: 20px !important;
    }
    .map-contain {
      position: relative;
      .map {
        width: 100%;
        height: 300px;
      }
      .search-contain {
        width: 300px;
        position: absolute;
        top: 10px;
        left: 10px;
      }
    }
    .label-contain {
      margin: 15px 0 10px;
      .tips {
        padding-left: 5px;
        color: @text-color-help-dark;
      }
    }
  }
</style>
