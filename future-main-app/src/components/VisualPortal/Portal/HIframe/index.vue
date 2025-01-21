<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-iframe">
      <iframe v-if="value" :src="value" scrolling="yes" frameborder="0"></iframe>
      <div class="portal-common-noData" v-else>
        <future-empty />
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { useCommon } from '../../Design/hooks/useCommon';

  const props = defineProps(['activeData']);
  const { CardHeader, value } = useCommon(props.activeData);
</script>
