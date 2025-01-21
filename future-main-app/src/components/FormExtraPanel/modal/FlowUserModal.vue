<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" :width="800" @ok="handleSubmit" destroyOnClose class="transfer-modal">
    <div class="transfer__body">
      <div class="transfer-pane left-pane">
        <div class="transfer-pane__tool">
          <a-input-search :placeholder="t('common.enterKeyword')" allowClear v-model:value="pagination.keyword" @search="handleSearch" />
        </div>
        <div class="transfer-pane__body transfer-pane__body-tab">
          <div class="custom-title">全部数据</div>
          <ScrollContainer v-loading="loading && pagination.currentPage === 1" ref="infiniteBody">
            <div v-for="item in ableList" :key="item.id" class="selected-item selected-item-user" @click="handleNodeClick(item)">
              <div class="selected-item-main">
                <a-avatar :size="36" :src="apiUrl + item.headIcon" class="selected-item-headIcon" />
                <div class="selected-item-text">
                  <p class="name">{{ item.fullName }}</p>
                  <p class="organize" :title="item.organize">{{ item.organize }}</p>
                </div>
              </div>
            </div>
            <future-empty v-if="!ableList.length" />
          </ScrollContainer>
        </div>
      </div>
      <div class="transfer-pane right-pane">
        <div class="transfer-pane__tool">
          <span>已选</span>
          <span class="remove-all-btn" @click="removeAll">清空列表</span>
        </div>
        <div class="transfer-pane__body">
          <ScrollContainer>
            <div v-for="(item, i) in selectedData" :key="i" class="selected-item selected-item-user">
              <div class="selected-item-main">
                <a-avatar :size="36" :src="apiUrl + item.headIcon" class="selected-item-headIcon" />
                <div class="selected-item-text">
                  <p class="name">{{ item.fullName }}</p>
                  <p class="organize" :title="item.organize">{{ item.organize }}</p>
                </div>
                <delete-outlined class="delete-btn" @click="removeData(i)" />
              </div>
            </div>
            <future-empty v-if="!selectedData.length" />
          </ScrollContainer>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getTaskUserList } from '@/api/workFlow/task';
  import { toRefs, ref, reactive, nextTick } from 'vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';

  interface State {
    ableList: any[];
    title: string;
    pagination: any;
    selectedData: any[];
    loading: boolean;
    finish: boolean;
  }

  const props = defineProps({
    taskId: { type: [String, Number], default: '' },
  });
  const emit = defineEmits(['register', 'confirm']);

  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);
  const state = reactive<State>({
    ableList: [],
    title: '选择用户',
    selectedData: [],
    loading: false,
    pagination: {
      keyword: '',
      currentPage: 1,
      pageSize: 20,
    },
    finish: false,
  });
  const { ableList, title, selectedData, pagination, loading } = toRefs(state);

  function init() {
    changeLoading(true);
    state.finish = false;
    state.ableList = [];
    state.selectedData = [];
    state.pagination.keyword = '';
    state.pagination.currentPage = 1;
    changeLoading(false);
    getAbleList();
    nextTick(() => {
      bindScroll();
    });
  }
  function getAbleList() {
    loading.value = true;
    getTaskUserList(props.taskId, state.pagination).then(res => {
      if (res.data.list.length < state.pagination.pageSize) state.finish = true;
      state.ableList = [...state.ableList, ...res.data.list];
      state.loading = false;
    });
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !state.loading && !state.finish) {
        state.pagination.currentPage += 1;
        getAbleList();
      }
    });
  }
  function handleNodeClick(data) {
    const boo = state.selectedData.some(o => o.id === data.id);
    if (boo) return;
    state.selectedData.push(data);
  }
  function handleSearch() {
    state.ableList = [];
    state.pagination.currentPage = 1;
    state.finish = false;
    getAbleList();
  }
  function removeAll() {
    state.selectedData = [];
  }
  function removeData(index: number) {
    state.selectedData.splice(index, 1);
  }
  function handleSubmit() {
    changeOkLoading(true);
    emit('confirm', state.selectedData);
    closeModal();
  }
</script>
