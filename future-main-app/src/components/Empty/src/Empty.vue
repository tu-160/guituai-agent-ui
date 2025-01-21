<template>
  <Empty v-bind="getBindValue">
    <template #[item]="data" v-for="item in Object.keys($slots)"><slot :name="item" v-bind="data || {}"></slot></template>
  </Empty>
</template>

<script lang="ts" setup>
  import { Empty } from 'ant-design-vue';
  import { computed, unref, ref } from 'vue';
  import { useAttrs } from '@/hooks/core/useAttrs';

  defineOptions({ name: 'FutureEmpty', inheritAttrs: false });

  const props = defineProps({
    image: { type: [String, Boolean, Object], default: null },
  });

  const attrs = useAttrs({ excludeDefaultKeys: false });
  const defaultImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);

  const getBindValue: any = computed(() => ({ ...unref(attrs), image: props.image || props.image === false ? props.image : unref(defaultImage) }));
</script>
