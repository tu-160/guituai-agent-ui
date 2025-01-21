<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" width="340px" class="full-drawer portal-toggle-drawer" title="切换门户">
    <div class="tool">
      <a-input-search :placeholder="t('common.drawerSearchText')" allowClear v-model:value="keyword" />
    </div>
    <div class="main">
      <div v-if="getPortalList.length">
        <div class="item" v-for="(item, i) in getPortalList" :key="i">
          <p class="item-title">{{ item.fullName }}</p>
          <div class="item-list">
            <div class="item-list-item" v-for="(child, ii) in item.children" :key="ii" @click="selectItem(child.id)" :class="{ active: activeId === child.id }">
              <p class="com-hover">{{ child.fullName }}</p>
              <CheckCircleFilled class="icon" />
            </div>
          </div>
        </div>
      </div>
      <!-- <future-empty v-else /> -->
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  // import { getPortalSelector, setDefaultPortal } from '@/api/onlineDev/portal';
  import { reactive, toRefs, computed, unref } from 'vue';
  import { CheckCircleFilled } from '@ant-design/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import { useI18n } from '@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

  interface State {
    list: any[];
    activeId: string;
    keyword: string;
  }

  const state = reactive<State>({
    list: [],
    activeId: '',
    keyword: '',
  });
  const { activeId, keyword } = toRefs(state);
  const userStore = useUserStore();
  const emit = defineEmits(['register', 'refresh']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(init);

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const getPortalList = computed(() => {
    const newList: any = [];
    let list = cloneDeep(state.list);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.children = item.children?.length ? item.children.filter(o => o.fullName.indexOf(state.keyword) !== -1) : [];
      newList.push(item);
    }
    return newList.filter(o => o.children && o.children.length);
  });

  function init(data) {
    state.activeId = data.id || '';
    state.keyword = '';
    initData();
  }
  function initData() {
    changeLoading(false);
  }
  function selectItem(id) {
    if (state.activeId == id) return;
    changeLoading(false);
  }
</script>
