<script setup lang="ts">
import { i18n } from "@/locales/i18n";

import CompBaseProperty from '../../internal/comp-base-property.vue';
import { nodeDefine } from './index';

export interface IStart {
  component_name: string;
  params: {
    prologue: string;
  };
}

withDefaults(
  defineProps<{
    close?: Function;
  }>(),
  {
    close: () => {},
  },
);

const dataProp = defineModel<IStart>('data', {
  default: {
    component_name: 'begin',
    params: {
      prologue: i18n.global.t('chat.setAnOpenerInitial'),
    },
  },
});

function useBaseLogic() {
  return {};
}

useBaseLogic();
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form layout="vertical">
      <a-form-item :label="i18n.global.t('chat.setAnOpener')" :tooltip="i18n.global.t('chat.setAnOpenerTip')">
        <a-textarea v-model:value="dataProp.params.prologue" :rows="4" :placeholder="i18n.global.t('chat.pleaseInput')" show-count />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
