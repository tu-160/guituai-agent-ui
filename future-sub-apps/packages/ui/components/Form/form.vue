<script setup lang="ts">
  // solt = formHeader
  // solt = item
  // solt = formFooter
  // solt = 'resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter'
  import { basicProps } from './form';

  const props = defineProps(basicProps);
</script>

<template>
  <a-form :model="model" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="Activity name">
      <template v-for=" $solts in $slots" v-slot:[$solts]> 
        
      </template>
    </a-form-item>
  </a-form>
</template>

<style></style>
