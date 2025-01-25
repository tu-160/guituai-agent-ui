<script lang="ts">
import { defineComponent } from 'vue';
import { i18n } from "@/locales/i18n";

import CompBaseNode from '../../internal/comp-base-node.vue';
import { mixin } from '../../mixin-index';
import { getDataDefault, nodeDefine } from './index';

export default defineComponent({
  components: { CompBaseNode },
  mixins: [mixin],
  computed: {
    i18n() {
      return i18n
    },
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
