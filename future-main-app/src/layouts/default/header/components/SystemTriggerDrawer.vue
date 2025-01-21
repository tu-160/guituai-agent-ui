<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" width="340px" class="full-drawer portal-toggle-drawer" :title="t('layout.header.systemChange')">
    <div class="tool">
      <a-input-search :placeholder="t('common.drawerSearchText')" allowClear v-model:value="keyword" />
    </div>
    <div class="main">
      <div class="item" v-if="getSysList.length">
        <div class="item-list">
          <div class="item-list-item" v-for="(item, i) in getSysList" :key="i" @click="selectItem(item)" :class="{ active: item.currentSystem }">
            <p class="com-hover">{{ getFullName(item) }}</p>
            <CheckCircleFilled class="icon" />
          </div>
        </div>
      </div>
      <future-empty v-else />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  import { reactive, toRefs, computed } from 'vue';
  import { CheckCircleFilled } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  // import { setMajor } from '@/api/permission/userSetting';
  import { useRouter } from 'vue-router';

  interface State {
    list: any[];
    keyword: string;
  }

  const state = reactive<State>({
    list: [],
    keyword: '',
  });
  const { keyword } = toRefs(state);
  defineEmits(['register']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(init);
  const router = useRouter();

  const getSysList = computed(() => (state.keyword ? state.list.filter(o => o.name.indexOf(state.keyword) !== -1) : state.list));

  function init(data) {
    state.keyword = '';
    state.list = data.list || [];
  }
  function selectItem(item) {
    if (item.currentSystem) return;
    changeLoading(true);
    let query = { majorId: item.id, majorType: 'System' };
    // setMajor(query)
    //   .then(res => {
    //     createMessage.success(res.msg).then(() => {
    //       router.replace('/');
    //       setTimeout(() => {
    //         changeLoading(false);
    //         closeDrawer();
    //         location.reload();
    //       }, 50);
    //     });
    //   })
    //   .catch(() => {
    //     changeLoading(false);
    //   });
  }
  function getFullName(item) {
    if (!item.enCode) return item.name;
    return t('routes.' + item.enCode.replace(/\./g, '-'), item.name);
  }
</script>
