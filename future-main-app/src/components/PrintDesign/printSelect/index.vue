<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="请选择打印模板" :footer="null" width="400px" :minHeight="250" class="template-list">
    <div class="template-item" v-for="item in state.printListOptions" :key="item.id" @click="handleSelect($event, item)">
      {{ item.fullName }}
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getPrintDevByIds } from '@/api/system/printDev';

  interface State {
    printListOptions: any[];
  }

  const state = reactive<State>({
    printListOptions: [],
  });
  const emit = defineEmits(['register', 'change']);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  function init(ids) {
    changeLoading(true);
    getPrintDevByIds({ ids }).then(res => {
      state.printListOptions = res.data;
      changeLoading(false);
    });
  }
  function handleSelect(_val, item) {
    emit('change', item.id);
    closeModal();
  }
</script>
<style lang="less" scoped>
  .template-list {
    height: 100%;
    width: 100%;
    .template-item {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      margin-bottom: 10px;
      line-height: 40px;
      padding: 0 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      background: #eff9ff;
      cursor: pointer;
    }
  }
</style>
