<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" :width="800" @ok="handleSubmit" destroyOnClose class="transfer-modal">
    <div class="transfer__body">
      <div class="transfer-pane left-pane">
        <div class="transfer-pane__tool">
          <a-input-search :placeholder="t('common.enterKeyword')" allowClear v-model:value="pagination.keyword" @search="handleSearch" />
        </div>
        <div class="transfer-pane__body transfer-pane__body-tab">
          <a-tabs v-model:activeKey="state.activeKey" :tabBarGutter="10" size="small" class="pane-tabs" @change="onTabsChange">
            <a-tab-pane key="1" tab="全部数据"></a-tab-pane>
            <a-tab-pane key="2" tab="当前组织"></a-tab-pane>
            <a-tab-pane key="3" tab="我的下属"></a-tab-pane>
          </a-tabs>
          <template v-if="state.activeKey === '1'">
            <BasicTree
              class="tree-main"
              :treeData="treeData"
              :load-data="onLoadData"
              clickRowToExpand
              @select="handleSelect"
              ref="treeRef"
              :loading="loading"
              :key="treeKey"
              v-if="!isAsync" />
            <ScrollContainer v-loading="loading && pagination.currentPage === 1" v-else ref="infiniteBody">
              <div v-for="item in treeData" :key="item.id" class="selected-item selected-item-user" @click="handleNodeClick(item)">
                <div class="selected-item-main">
                  <a-avatar :size="36" :src="apiUrl + item.headIcon" class="selected-item-headIcon" />
                  <div class="selected-item-text">
                    <p class="name">{{ item.fullName }}</p>
                    <p class="organize" :title="item.organize">{{ item.organize }}</p>
                  </div>
                </div>
              </div>
              <future-empty v-if="!treeData.length" />
            </ScrollContainer>
          </template>
          <ScrollContainer v-loading="loading" v-else>
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
  import { getImUserSelector, getSubordinates, getOrganization } from '@/api/permission/user';
  import { toRefs, ref, reactive, unref, nextTick } from 'vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import { BasicTree, TreeActionType } from '@/components/Tree';

  interface State {
    treeData: any[];
    ableList: any[];
    title: string;
    pagination: any;
    selectedData: any[];
    nodeId: string;
    loading: boolean;
    isAsync: boolean;
    activeKey: string;
    finish: boolean;
    treeKey: number;
  }

  const emit = defineEmits(['register', 'confirm']);

  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);
  const state = reactive<State>({
    treeData: [],
    ableList: [],
    title: '选择用户',
    selectedData: [],
    nodeId: '0',
    loading: false,
    isAsync: false,
    activeKey: '',
    pagination: {
      keyword: '',
      currentPage: 1,
      pageSize: 20,
    },
    finish: false,
    treeKey: +new Date(),
  });
  const { treeData, ableList, title, selectedData, pagination, loading, isAsync, treeKey } = toRefs(state);

  function init() {
    changeLoading(true);
    state.isAsync = false;
    state.finish = false;
    state.treeData = [];
    state.ableList = [];
    state.selectedData = [];
    state.pagination.keyword = '';
    state.pagination.currentPage = 1;
    state.nodeId = '0';
    state.activeKey = '1';
    changeLoading(false);
    initData();
  }
  function initData() {
    if (state.activeKey === '1') return getAllList();
    if (state.activeKey === '2') {
      state.loading = true;
      getOrganization({ keyword: state.pagination.keyword, organizeId: '0' }).then(res => {
        state.ableList = res.data;
        state.loading = false;
      });
    }
    if (state.activeKey === '3') {
      state.loading = true;
      getSubordinates(state.pagination.keyword).then(res => {
        state.ableList = res.data;
        state.loading = false;
      });
    }
    nextTick(() => {
      bindScroll();
    });
  }
  function getAllList() {
    state.loading = true;
    if (state.pagination.keyword) state.nodeId = '0';
    getImUserSelector(state.nodeId, state.pagination).then(res => {
      if (state.pagination.keyword) {
        if (res.data.list.length < state.pagination.pageSize) state.finish = true;
        state.treeData = [...state.treeData, ...res.data.list];
      } else {
        state.treeData = res.data.list;
        if (state.treeData.length && state.nodeId == '0') {
          getTree().setExpandedKeys([state.treeData[0].id]);
        }
      }
      state.loading = false;
    });
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !state.loading && !state.finish) {
        state.pagination.currentPage += 1;
        getAllList();
      }
    });
  }
  function onTabsChange() {
    state.pagination.keyword = '';
    state.nodeId = '0';
    state.isAsync = false;
    initData();
  }
  function onLoadData(node) {
    state.nodeId = node.id;
    return new Promise((resolve: (value?: unknown) => void) => {
      getImUserSelector(state.nodeId).then(res => {
        const list = res.data.list;
        getTree().updateNodeByKey(node.eventKey, { children: list, isLeaf: !list.length });
        resolve();
      });
    });
  }
  function handleSelect(keys) {
    if (!keys.length) return;
    const data = getTree().getSelectedNode(keys[0]);
    if (data?.type !== 'user') return;
    handleNodeClick(data);
  }
  function handleNodeClick(data) {
    const boo = state.selectedData.some(o => o.id === data.id);
    if (boo) return;
    state.selectedData.push(data);
  }
  function handleSearch() {
    state.treeKey = +new Date();
    state.nodeId = '0';
    state.treeData = [];
    state.ableList = [];
    state.pagination.currentPage = 1;
    state.isAsync = !!state.pagination.keyword;
    state.finish = false;
    if (state.isAsync && state.activeKey === '1') {
      nextTick(() => {
        bindScroll();
      });
    }
    initData();
  }
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) throw new Error('tree is null!');
    return tree;
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
