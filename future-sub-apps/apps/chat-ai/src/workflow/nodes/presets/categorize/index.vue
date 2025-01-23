<script lang="ts">
import { defineComponent } from 'vue';
import { i18n } from "@/locales/i18n";

import CompBaseNode from '../../internal/comp-base-node.vue';
import { mixin } from '../../mixin-index';
import { getDataDefault, nodeDefine } from './index';

export default defineComponent({
  name: 'Categorize',
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

  </CompBaseNode>
</template>
