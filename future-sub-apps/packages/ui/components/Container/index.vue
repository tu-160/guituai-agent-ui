<script setup lang="ts">
import { Button as AButton } from "ant-design-vue";
</script>

<template>
  <div class="f-base-container">
    <slot name="default" />
  </div>
</template>

<style>
.f-base-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;

  background-color: transparent;
}
</style>
