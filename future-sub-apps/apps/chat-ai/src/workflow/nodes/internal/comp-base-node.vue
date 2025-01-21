<script lang="ts">
import { defineComponent } from 'vue';

import { Icon } from '@future-core/icons';

import { mixin } from '../mixin-index';

import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

export default defineComponent({
  name: 'Template',
  computed: {
    i18n() {
      return i18n
    }
  },
  components: { Icon },
  mixins: [mixin], // 混入了编排操作逻辑
  props: {
    nodeDefine: {
      type: Object,
      default: () => ({}),
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    // 添加默认数据
    this.createNodeData(this.defaultData, this.nodeDefine);
  },
  methods: {},
});
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center rounded-sm bg-white p-2 px-4">
    <div class="node-info flex h-10 w-full items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon :icon="nodeDefine.icon" class="mr-2 text-lg" />
        <span class="percentage-value" @click="() => (properties.width = 300)"> {{ properties.data?.label }} </span>
      </div>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <Icon class="mr-2 text-lg" icon="lucide:ellipsis" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="delNode">
              <div class="flex items-center justify-center gap-2">{{i18n.global.t('common.delete')}} <Icon class="text-sm" icon="lucide:trash" /></div>
            </a-menu-item>
            <a-menu-item @click="cloneNode">
              <div class="flex items-center justify-center gap-2">{{i18n.global.t('common.copy')}} <Icon class="text-sm" icon="lucide:copy" /></div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <div class="node-arr flex h-full w-full flex-1 flex-col gap-1">
      <slot></slot>
    </div>
  </div>
</template>
