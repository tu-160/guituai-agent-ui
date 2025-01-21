<template>
  <Tooltip :title="t('common.searchText')" :mouseEnterDelay="0.5">
    <div @click="changeModal(true)">
      <i class="icon-ym icon-ym-header-search"></i>
      <AppSearchModal @Close="changeModal(false)" :visible="showModal" />
    </div>
  </Tooltip>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import AppSearchModal from './AppSearchModal.vue';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ name: 'AppSearch' });
  const showModal = ref(false);
  const { t } = useI18n();

  function changeModal(show: boolean) {
    showModal.value = show;
  }
</script>
