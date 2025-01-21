<template>
  <div class="authorize">
    <a-tabs v-model:activeKey="activeKey" class="auth-tabs">
      <a-tab-pane tab="菜单权限" key="module"></a-tab-pane>
      <a-tab-pane tab="按钮权限" key="button"></a-tab-pane>
      <a-tab-pane tab="列表权限" key="column"></a-tab-pane>
      <a-tab-pane tab="表单权限" key="form"></a-tab-pane>
      <a-tab-pane tab="数据权限" key="resource"></a-tab-pane>
      <a-tab-pane tab="门户权限" key="portal"></a-tab-pane>
      <a-tab-pane tab="流程权限" key="flow"></a-tab-pane>
    </a-tabs>
    <div class="auth-tree">
      <BasicTree :treeData="state.treeData" :loading="loading" defaultExpandAll :key="key" />
    </div>
  </div>
</template>
<script setup lang="ts">
  // import { getAuthorizeList } from '@/api/permission/userSetting';
  import { reactive, toRefs, onMounted, watch } from 'vue';
  import { BasicTree } from '@/components/Tree';

  interface State {
    activeKey: string;
    authData: any;
    loading: boolean;
    treeData: any[];
    key: number;
  }
  const state = reactive<State>({
    activeKey: 'module',
    authData: {},
    loading: false,
    treeData: [],
    key: +new Date(),
  });
  const { activeKey, loading, key } = toRefs(state);

  watch(
    () => state.activeKey,
    val => {
      state.treeData = state.authData[val] || [];
      state.key = +new Date();
    },
  );

  function init() {
    state.loading = true;
    // getAuthorizeList().then(res => {
    //   state.authData = res.data;
    //   state.treeData = state.authData[state.activeKey] || [];
    //   state.loading = false;
    // });
  }

  onMounted(() => {
    init();
  });
</script>
<style lang="less" scoped>
  .authorize {
    height: 100%;

    .auth-tree {
      height: calc(100% - 64px);
      overflow: auto;
    }
  }
</style>
