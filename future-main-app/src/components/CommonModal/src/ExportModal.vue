<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.exportText')"
    :okText="t('common.exportText')"
    @ok="handleSubmit"
    destroyOnClose
    class="export-modal">
    <template #insertFooter>
      <div class="footer-tip">提示:系统将导出列表中选中的数据</div>
    </template>
    <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }">
      <div class="export-line">
        <p class="export-label">导出方式</p>
      </div>
      <a-form-item>
        <a-radio-group v-model:value="dataType">
          <a-radio :value="0">当前页面数据</a-radio>
          <a-radio :value="1">全部页面数据</a-radio>
          <a-radio :value="2" :disabled="!selectIds || !selectIds.length" v-if="webType != '4'">当前选择数据</a-radio>
        </a-radio-group>
      </a-form-item>
      <div class="export-line">
        <p class="export-label">导出数据<span>请选择导出字段</span></p>
      </div>
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">全选</a-checkbox>
      <a-checkbox-group v-model:value="checkedList" class="options-list" @change="handleCheckedChange">
        <a-checkbox v-for="item in columnList" :key="item.id" :value="item.id" class="options-item">
          {{ item.fullName }}
        </a-checkbox>
      </a-checkbox-group>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { noGroupList } from '@/components/FormGenerator/src/helper/config';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['register', 'download']);
  const [registerModal, { changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const dataType = ref(0);
  const webType = ref('');
  const selectIds = ref([]);
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([]);
  const checkedList = ref<string[]>([]);
  const defaultCheckedList = ref<string[]>([]);

  function init(data) {
    webType.value = data.webType || '';
    columnList.value = cloneDeep(data.columnList).filter(o => !noGroupList.includes(o.__config__.futureKey));
    selectIds.value = data.selectIds || [];
    dataType.value = 0;
    checkedList.value = columnList.value.map(o => o.id);
    handleCheckedChange(checkedList.value);
  }
  function handleCheckAllChange(e) {
    const val = e.target.checked;
    checkedList.value = val ? columnList.value.map(o => o.id) : defaultCheckedList.value;
    isIndeterminate.value = val ? false : !!defaultCheckedList.value.length;
  }
  function handleCheckedChange(val) {
    const checkedCount = val.length;
    checkAll.value = checkedCount === columnList.value.length;
    isIndeterminate.value = !!checkedCount && checkedCount < columnList.value.length;
  }
  function handleSubmit() {
    if (!checkedList.value.length) return createMessage.warning('请至少选择一个导出字段');
    changeOkLoading(true);
    const data = { dataType: dataType.value, selectKey: checkedList.value, selectIds: selectIds.value };
    emit('download', data);
  }
</script>
