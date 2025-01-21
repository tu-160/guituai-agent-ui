<template>
  <a-modal v-model:open="visible" title="掩码设置" centered :maskClosable="false" :keyboard="false" :width="600" @ok="handleSubmit" class="mask-config-modal">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ style: { width: '80px' } }" :colon="false" hideRequiredMark>
      <a-form-item label="填充符号" name="filler">
        <future-select v-model:value="formData.filler" placeholder="请选择" :options="fillerOptions" />
      </a-form-item>
      <a-form-item label="掩码规则" name="maskType">
        <future-select v-model:value="formData.maskType" placeholder="请选择" :options="maskTypeOptions" :listHeight="300" />
      </a-form-item>
      <template v-if="formData.maskType === 0">
        <a-form-item label="开头显示" name="prefixType">
          <future-select v-model:value="formData.prefixType" placeholder="请选择" :options="prefixTypeOptions" />
        </a-form-item>
        <a-form-item label="字数" name="prefixLimit" v-if="formData.prefixType === 2">
          <a-input-number v-model:value="formData.prefixLimit" placeholder="请输入" :min="0" :precision="0" @change="onNumberChange($event, 'prefixLimit')" />
        </a-form-item>
        <a-form-item label="字符" name="prefixSpecifyChar" v-if="formData.prefixType === 3 || formData.prefixType === 4">
          <a-input v-model:value="formData.prefixSpecifyChar" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="结尾显示" name="suffixType">
          <future-select v-model:value="formData.suffixType" placeholder="请选择" :options="suffixTypeOptions" />
        </a-form-item>
        <a-form-item label="字数" name="suffixLimit" v-if="formData.suffixType === 2">
          <a-input-number v-model:value="formData.suffixLimit" placeholder="请输入" :min="0" :precision="0" @change="onNumberChange($event, 'suffixLimit')" />
        </a-form-item>
        <a-form-item label="字符" name="suffixSpecifyChar" v-if="formData.suffixType === 3 || formData.suffixType === 4">
          <a-input v-model:value="formData.suffixSpecifyChar" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="显示字符" name="ignoreChar">
          <a-input v-model:value="formData.ignoreChar" placeholder="多个字符直接用英文,号隔开，如：a,b,c" />
        </a-form-item>
        <a-form-item name="useUnrealMask">
          <template #label>虚拟掩码<BasicHelp :text="['禁用：按照真实字数显示掩码；', '启用：按照虚拟位数显示掩码，不暴露真实长度']" /></template>
          <a-switch v-model:checked="formData.useUnrealMask" />
        </a-form-item>
        <a-form-item label="掩码长度" name="unrealMaskLength" v-if="formData.useUnrealMask">
          <a-input-number
            v-model:value="formData.unrealMaskLength"
            placeholder="请输入"
            :min="1"
            :precision="0"
            addonAfter="个字"
            @change="onNumberChange($event, 'unrealMaskLength')" />
        </a-form-item>
      </template>
      <a-divider></a-divider>
      <a-form-item label="效果测试" name="testText">
        <a-input v-model:value="testText" placeholder="请输入" allowClear :disabled="isMask">
          <template #addonAfter>
            <p class="cursor-pointer" @click="handleMask()" v-show="!isMask">掩盖</p>
            <p class="cursor-pointer" @click="handleRevert()" v-show="isMask">解码</p>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { Modal as AModal } from 'ant-design-vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { ref, reactive, toRefs } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useTextMask, MaskOptions, defaultMaskOptions } from '@/hooks/web/useTextMask';

  interface State {
    visible: boolean;
    formData: MaskOptions;
    rules: any;
    testText: string;
    originTestText: string;
    isMask: boolean;
  }

  const emit = defineEmits(['confirm']);
  defineExpose({ openModal });

  const fillerOptions = [
    { id: '*', fullName: '*' },
    { id: '●', fullName: '●' },
    { id: '-', fullName: '-' },
    { id: '.', fullName: '.' },
    { id: '#', fullName: '#' },
  ];
  const maskTypeOptions = [
    { id: 1, fullName: '全掩盖' },
    { id: 2, fullName: '姓名-显示前1个字，后1个字' },
    { id: 3, fullName: '手机号-显示前3位，后4位' },
    { id: 4, fullName: '邮箱-显示前3个字，@和之后的字' },
    { id: 5, fullName: '身份证-显示前6位，后3位，虚拟为4位' },
    { id: 6, fullName: 'IP地址-显示第1段IP' },
    { id: 7, fullName: '车牌号-显示前1个字，后2位' },
    { id: 8, fullName: '银行卡号-显示前6位，后4位' },
    { id: 0, fullName: '自定义规则' },
  ];
  const prefixTypeOptions = [
    { id: 1, fullName: '不显示' },
    { id: 2, fullName: '指定字数' },
    { id: 3, fullName: '指定字符之前的字' },
    { id: 4, fullName: '指定字符和之前的字' },
  ];
  const suffixTypeOptions = [
    { id: 1, fullName: '不显示' },
    { id: 2, fullName: '指定字数' },
    { id: 3, fullName: '指定字符之后的字' },
    { id: 4, fullName: '指定字符和之后的字' },
  ];
  const state = reactive<State>({
    visible: false,
    formData: defaultMaskOptions,
    rules: {
      fullName: [{ required: true, message: '必填' }],
      id: [{ required: true, message: '必填' }],
    },
    testText: '',
    originTestText: '',
    isMask: false,
  });
  const { visible, formData, rules, testText, isMask } = toRefs(state);
  const formRef = ref<FormInstance>();

  function openModal(data) {
    state.visible = true;
    state.isMask = false;
    state.testText = '';
    state.formData = cloneDeep(data);
    formRef.value?.resetFields();
  }
  function handleCancel() {
    state.visible = false;
  }
  async function handleSubmit() {
    try {
      state.visible = false;
      emit('confirm', state.formData);
    } catch (_) {}
  }
  function handleMask() {
    if (!state.testText) return;
    state.originTestText = state.testText;
    state.isMask = true;
    const { getMaskedText } = useTextMask(state.formData);
    state.testText = getMaskedText(state.testText);
  }
  function handleRevert() {
    state.testText = state.originTestText;
    state.originTestText = '';
    state.isMask = false;
  }
  function onNumberChange(val, key) {
    if (val) return;
    if (key === 'unrealMaskLength') return (state.formData[key] = 1);
    state.formData[key] = 0;
  }
</script>
<style lang="less">
  .mask-config-modal {
    .ant-modal-body {
      padding: 20px 50px 0 !important;
    }
  }
</style>
