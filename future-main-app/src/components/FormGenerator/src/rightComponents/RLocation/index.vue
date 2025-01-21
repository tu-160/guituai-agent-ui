<template>
  <a-form-item>
    <template #label>获取定位<BasicHelp :text="['桌面端不支持自动获取定位']" /></template>
    <a-switch v-model:checked="activeData.autoLocation" />
  </a-form-item>
  <a-form-item>
    <template #label>允许微调<BasicHelp text="是否允许用户在当前定位的范围可以微调距离" /></template>
    <a-switch v-model:checked="activeData.enableLocationScope" />
  </a-form-item>
  <a-form-item v-if="activeData.enableLocationScope">
    <template #label>微调范围<BasicHelp text="设置用户可以微调的范围" /></template>
    <a-input-number v-model:value="activeData.adjustmentScope" placeholder="请选择" :min="1" addonAfter="米" @change="onAdjustmentScopeChange" />
  </a-form-item>
  <a-form-item>
    <template #label>定位区域<BasicHelp text="设置用户可以提交定位的范围" /></template>
    <a-switch v-model:checked="activeData.enableDesktopLocation" />
  </a-form-item>
  <template v-if="activeData.enableDesktopLocation">
    <div class="location-scope-item" v-for="(item, index) in activeData.locationScope">
      <span class="name">{{ item.name }}</span>
      <div class="edit-btn" @click="addOrUpdateHandle(item)">
        <i class="icon-ym icon-ym-btn-edit" />
      </div>
      <div class="close-btn" @click="activeData.locationScope.splice(index, 1)">
        <i class="icon-ym icon-ym-btn-clearn" />
      </div>
    </div>
    <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()" class="!px-0 mb-10px">新增定位中心</a-button>
  </template>
  <MapModal @register="registerModal" @confirm="handleConfirm" />
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import MapModal from './MapModal.vue';
  import { useModal } from '@/components/Modal';
  import { buildBitUUID } from '@/utils/uuid';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);
  const [registerModal, { openModal }] = useModal();

  function addOrUpdateHandle(item?) {
    openModal(true, { item });
  }
  function handleConfirm(item) {
    if (item.id) {
      for (let i = 0; i < props.activeData.locationScope.length; i++) {
        let o = props.activeData.locationScope[i];
        if (item.id === o.id) o = item;
      }
    } else {
      item.id = buildBitUUID();
      props.activeData.locationScope.push(item);
    }
  }
  function onAdjustmentScopeChange(val) {
    if (!val) props.activeData.adjustmentScope = 1;
  }
</script>
<style lang="less">
  .location-scope-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .edit-btn,
    .close-btn {
      cursor: pointer;
      .icon-ym {
        font-size: 18px;
      }
    }
    .edit-btn {
      color: #1890ff;
      margin: 0 5px 0 10px;
    }
    .close-btn {
      color: @error-color;
    }
  }
</style>
