<script lang="ts">
import { defineComponent } from 'vue';

import { getElementTop } from '../../../helper/index';
import CompBaseNode from '../../internal/comp-base-node.vue';
import { mixin } from '../../mixin-index';
import { getDataDefault, nodeDefine } from './index';

export default defineComponent({
  name: 'Rewrite',
  components: { CompBaseNode },
  mixins: [mixin], // 混入了编排操作逻辑
  data() {
    return {
      width: 220,
      height: 180,
    };
  },
  computed: {
    nodeDefine() {
      return nodeDefine;
    },
    defaultData() {
      return getDataDefault();
    },
  },
  mounted() {
    // 添加默认数据
    this.$nextTick(() => {
      this.setNodeProperty('a1Top', getElementTop(this.$refs.topDomRef as HTMLElement, this.$refs.anchor1DomRef as HTMLElement));
      this.setNodeProperty('a2Top', getElementTop(this.$refs.topDomRef as HTMLElement, this.$refs.anchor2DomRef as HTMLElement));
    });
  },
  methods: {},
});
</script>

<template>
  <CompBaseNode :default-data="defaultData" :node-define="nodeDefine">
    <div class="flex h-full w-full flex-1 flex-col">
      <div ref="anchor1DomRef" class="ml-auto">Yes</div>
      <div class="flex h-8 items-center rounded-sm bg-slate-50">{{ properties.data?.form?.yesLabel }}</div>
      <div ref="anchor2DomRef" class="ml-auto">No</div>
      <div class="flex h-8 items-center rounded-sm bg-slate-50">{{ properties.data?.form?.noLabel }}</div>
    </div>
  </CompBaseNode>
</template>
