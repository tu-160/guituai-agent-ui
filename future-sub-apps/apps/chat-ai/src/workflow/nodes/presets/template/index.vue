<script lang="ts">
import { defineComponent } from 'vue';

import CompBaseNode from '../../internal/comp-base-node.vue';
import { mixin } from '../../mixin-index';
import { getDataDefault, nodeDefine } from './index';

export default defineComponent({
  components: { CompBaseNode },
  mixins: [mixin],
  computed: {
    nodeDefine() {
      return nodeDefine;
    },
    defaultData() {
      return getDataDefault();
    },
  },
  methods: {},
});
</script>

<template>
  <CompBaseNode :default-data="defaultData" :node-define="nodeDefine">
    <template v-if="properties?.data?.form?.parameters">
      <div
        v-for="item in properties.data.form.parameters"
        :key="item.id"
        class="node-item flex h-8 w-full items-center justify-between rounded bg-slate-50 p-2"
      >
        <div>{{ item.key }}</div>
        <div class="rounded bg-slate-100">{{ item.label }}</div>
      </div>
    </template>
  </CompBaseNode>
</template>
