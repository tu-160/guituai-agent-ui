<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body"> 请在移动端查看效果 </div>
  </a-card>
</template>
<script lang="ts" setup>
  import CardHeader from '../CardHeader/index.vue';

  defineProps(['activeData']);
</script>
