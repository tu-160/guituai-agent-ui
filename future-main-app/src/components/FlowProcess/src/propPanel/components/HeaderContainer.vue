<template>
  <div class="header-container">
    <span v-if="formConf?.type == 'global'">全局属性</span>
    <template v-else>
      <div class="header-container-left">
        <div class="node-name" v-if="!editState" @click="handleEditState">
          <span>{{ formConf.nodeName }} </span>
          <i class="icon-ym icon-ym-edit" v-if="!detailed"></i>
        </div>
        <a-input v-model:value="formConf.nodeName" ref="inputRef" @blur="onNodeNameBlur" v-else />
      </div>
      <div class="header-container-right" v-if="showEnCode">编码：{{ formConf.nodeId }} </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, nextTick } from 'vue';

  const props = defineProps({
    formConf: { type: Object, default: {} },
    detailed: { type: Boolean, default: false },
    showEnCode: { type: Boolean, default: true },
  });
  const emit = defineEmits(['onNodeNameChange']);
  const editState = ref(false);
  const inputRef = ref<Nullable<HTMLElement>>(null);

  function handleEditState() {
    if (props.detailed) return;
    editState.value = !editState.value;
    nextTick(() => editState.value && unref(inputRef)?.focus());
  }
  function onNodeNameBlur() {
    handleEditState();
    emit('onNodeNameChange', props.formConf.nodeName);
  }
</script>
