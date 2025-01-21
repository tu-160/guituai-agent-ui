<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.previewText')"
    @ok="handleConfirm"
    canFullscreen
    destroy-on-close
    :okText="getOkText"
    :cancelText="getCancelText">
    <Parser ref="parserRef" :formConf="formConf" @submit="submitForm" :key="key" v-if="!loading" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, nextTick, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Parser from '@/components/FormGenerator/src/components/Parser.vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps(['formConf']);
  defineEmits(['register']);
  const { t } = useI18n();
  const [registerModal, { changeOkLoading }] = useModalInner(init);
  const parserRef = ref<any>(null);
  const loading = ref(true);
  const key = ref(+new Date());

  const getOkText = computed(() => {
    const text = props.formConf.confirmButtonTextI18nCode
      ? t(props.formConf.confirmButtonTextI18nCode, props.formConf.confirmButtonText)
      : props.formConf.confirmButtonText;
    return text || t('common.okText');
  });
  const getCancelText = computed(() => {
    const text = props.formConf.cancelButtonTextI18nCode
      ? t(props.formConf.cancelButtonTextI18nCode, props.formConf.cancelButtonText)
      : props.formConf.cancelButtonText;
    return text || t('common.cancelText');
  });

  function init() {
    loading.value = true;
    key.value = +new Date();
    nextTick(() => {
      loading.value = false;
    });
  }
  function getParser() {
    const parser = unref(parserRef);
    if (!parser) {
      throw new Error('parser is null!');
    }
    return parser;
  }

  function handleConfirm() {
    getParser().handleSubmit();
  }
  function submitForm(data, callback) {
    changeOkLoading(true);
    console.log('提交数据：', data);
    if (callback && typeof callback === 'function') callback();
    changeOkLoading(false);
  }
</script>
