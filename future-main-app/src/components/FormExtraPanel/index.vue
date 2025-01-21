<template>
  <div class="form-extra-panel" :class="{ 'form-extra-panel-unfold': !isAdvanced }">
    <a-tooltip placement="left" :title="isAdvanced ? t('component.form.fold') : t('component.form.unfold')">
      <div class="trigger-btn" @click="toggleAdvanced">
        <DoubleRightOutlined v-if="isAdvanced" />
        <DoubleLeftOutlined v-else />
      </div>
    </a-tooltip>
    <a-tabs v-model:activeKey="activeKey" :tabBarGutter="10" size="small" class="average-tabs" :class="{ 'average-tabs-single': showComment }">
      <a-tab-pane key="1" tab="评论" v-if="showComment" />
    </a-tabs>
    <div class="form-extra-panel-main">
      <CommentList :taskId="taskId" v-show="activeKey == '1'" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted } from 'vue';
  import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import CommentList from './CommentList.vue';

  interface State {
    isAdvanced: boolean;
    activeKey: string;
  }

  defineProps({
    showComment: { type: Boolean, default: true },
    taskId: { type: [String, Number], default: '' },
  });

  const state = reactive<State>({
    isAdvanced: true,
    activeKey: '1',
  });
  const { isAdvanced, activeKey } = toRefs(state);
  const { t } = useI18n();

  function toggleAdvanced() {
    state.isAdvanced = !state.isAdvanced;
  }

  onMounted(() => {
    state.activeKey = '1';
  });
</script>
