<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="请选择流程" width="400px" :footer="null" destroyOnClose class="future-flow-list-modal">
    <div class="template-search">
      <a-input-search :placeholder="t('common.enterKeyword')" allowClear v-model:value="state.keyword" />
    </div>
    <div class="template-list">
      <ScrollContainer>
        <div class="template-item" v-for="item in getFlowList" :key="item.id" @click="selectFlow(item)">
          {{ item.fullName }}
        </div>
        <future-empty v-if="!getFlowList.length" />
      </ScrollContainer>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ScrollContainer } from '@/components/Container';
  import { useI18n } from '@/hooks/web/useI18n';

  interface State {
    flowList: any[];
    keyword: string;
  }

  const state = reactive<State>({
    flowList: [],
    keyword: '',
  });
  const emit = defineEmits(['register', 'change']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const { t } = useI18n();

  const getFlowList = computed(() => (state.keyword ? state.flowList.filter(o => o.fullName.indexOf(state.keyword) !== -1) : state.flowList));

  function init(data) {
    state.keyword = '';
    state.flowList = data.flowList || [];
  }
  function selectFlow(item) {
    emit('change', item);
    closeModal();
  }
</script>
