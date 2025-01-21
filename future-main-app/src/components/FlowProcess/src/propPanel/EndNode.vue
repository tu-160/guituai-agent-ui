<template>
  <HeaderContainer :formConf="state.formConf" :showEnCode="false" detailed />
  <a-alert message="如果你需要在中途结束流程，请将需要结束流程的节点，连接到流程结束，并设置相应的流转条件。" type="warning" class="!m-10px" />
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import HeaderContainer from './components/HeaderContainer.vue';

  const state = reactive({
    formConf: {
      nodeName: '流程结束',
    },
  });
</script>
