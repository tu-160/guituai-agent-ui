<template>
  <SiderTrigger v-if="sider" />
  <HeaderTrigger v-else :theme="theme" />
</template>
<script lang="ts" setup>
  import { propTypes } from '@/utils/propTypes';
  import HeaderTrigger from './HeaderTrigger.vue';
  import SiderTrigger from './SiderTrigger.vue';

  defineOptions({ name: 'LayoutTrigger' });
  defineProps({
    sider: propTypes.bool.def(true),
    theme: propTypes.oneOf(['light', 'dark']),
  });
</script>
