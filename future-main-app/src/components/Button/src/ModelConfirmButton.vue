<template>
  <a-button v-bind="getBindValue" @click="onClick">
    <template #default="data">
      <slot v-bind="data || {}"></slot>
    </template>
  </a-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    inheritAttrs: false,
  });
</script>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { omit } from 'lodash-es';
  import { useAttrs } from '@/hooks/core/useAttrs';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps({
    modelConfirm: { type: Object },
  });
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const { createConfirm } = useMessage();
  const { t } = useI18n();
  const { modelConfirm } = props;
  function onClick() {
    createConfirm({
      iconType: modelConfirm?.iconType || 'warning',
      title: modelConfirm?.title || t('common.tipTitle'),
      content: modelConfirm?.content || t('common.delTip'),
      onOk: modelConfirm?.onOk,
    });
  }
  const getBindValue = computed(() => omit({ ...unref(attrs) }, ['enable', 'getPopupContainer', 'label', 'onClick', 'icon']));
</script>
