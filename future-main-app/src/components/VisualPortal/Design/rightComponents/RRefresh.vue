<template>
  <div>
    <a-form-item label="自动刷新">
      <a-switch v-model:checked="refresh.autoRefresh" />
    </a-form-item>
    <a-form-item label="刷新间隔" v-if="refresh.autoRefresh">
      <a-input-number v-model:value="refresh.autoRefreshTime" placeholder="请输入" :min="1" :max="1440" addon-after="分钟" />
    </a-form-item>
  </div>
</template>
<script lang="ts" setup>
  defineProps(['refresh']);
</script>
