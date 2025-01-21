<script setup lang="ts">
const props = defineProps<{ model: any }>();
const deleteEdge = () => {
  props.model.graphModel.deleteEdgeById(props.model.id);
};
</script>
<template>
  <div class="custom-edge cursor hidden">
    <svg fill="none" height="22" version="1.1" viewBox="0 0 1024 1024" width="22" xmlns="http://www.w3.org/2000/svg" @click.stop="deleteEdge">
      <path
        d="M512.005717 0c282.770588 0 511.994283 229.235129 511.994283 512.005717S794.776305 1024 512.005717 1024 0 794.776305 0 512.005717 229.235129 0 512.005717 0z m219.538831 665.168355l-153.162637-153.219809 153.19694-153.105466a47.029334 47.029334 0 0 0-66.410496-66.421931l-153.219809 153.219809-153.105466-153.219809a47.040768 47.040768 0 0 0-66.421931 66.421931l153.219809 153.219809-153.162637 153.219809a47.029334 47.029334 0 0 0 66.42193 66.410496l153.219809-153.162637 153.219809 153.162637a47.029334 47.029334 0 0 0 66.410497-66.410496z"
        fill="#3370ff"
        p-id="6270"
      />
    </svg>
  </div>
</template>

<style lang="scss">
.custom-edge {
  position: absolute;
  z-index: 100000;
  color: #3370ff;
  pointer-events: all;
  stroke: none;
}
</style>
