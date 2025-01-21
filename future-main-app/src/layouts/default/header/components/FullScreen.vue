<template>
  <Tooltip :title="getTitle" placement="bottom" :mouseEnterDelay="0.5">
    <span @click="toggle">
      <i class="icon-ym icon-ym-header-fullscreen" v-if="!isFullscreen"></i>
      <i class="icon-ym icon-ym-header-fullscreen-exit" v-else></i>
    </span>
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useFullscreen } from '@vueuse/core';

  export default defineComponent({
    name: 'FullScreen',
    components: { Tooltip },

    setup() {
      const { t } = useI18n();
      const { toggle, isFullscreen } = useFullscreen();

      // 重新检查全屏状态
      isFullscreen.value = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      const getTitle = computed(() => {
        return unref(isFullscreen) ? t('layout.header.tooltipExitFull') : t('layout.header.tooltipEntryFull');
      });

      return {
        getTitle,
        isFullscreen,
        toggle,
      };
    },
  });
</script>
