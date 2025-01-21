<template>
  <div v-if="showFrame" style="height: 100%;">
    <template v-for="frame in getFramePages" :key="frame.path">
      <WujieVue
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        width="100%"
        height="100%"
        :name="`wujieMain-${frame.name}`"
        :url="frame.meta.frameSrc"
        :sync="true"></WujieVue>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import { useFrameKeepAlive } from './useFrameKeepAlive';

  export default defineComponent({
    name: 'WujieLayout',
    setup() {
      const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();

      const showFrame = computed(() => unref(getFramePages).length > 0);

      return { getFramePages, hasRenderFrame, showIframe, showFrame };
    },
  });
</script>
