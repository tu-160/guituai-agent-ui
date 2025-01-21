<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="批量编辑" showOkBtn @ok="handleSubmit" :width="660">
    <a-alert message="注意：每行对应一个选项；选项名和选项值之间用英文 | 隔开。参考格式如下：" type="warning" show-icon />
    <div class="demo-box">
      <div class="demo-box-cell">
        <p class="w-220px">格式一：选项名和选项值一致时</p>
        <span class="w-100px">选项名</span>
        <p>输入示例：<span>选项一</span></p>
      </div>
      <div class="demo-box-cell">
        <p class="w-220px">格式二：选项名和选项值不一致时</p>
        <span class="w-100px">选项名|选项值</span>
        <p>输入示例：<span>选项一|选项一的值</span></p>
      </div>
    </div>
    <future-textarea v-model:value="innerValue" :rows="12" class="!mb-20px !leading-30px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  interface State {
    innerValue: string;
    separator: string;
  }

  const emit = defineEmits(['register', 'confirm']);
  const state = reactive<State>({
    innerValue: '',
    separator: '|',
  });
  const { innerValue } = toRefs(state);
  const [registerModal, { closeModal }] = useModalInner(init);

  function init(data) {
    state.innerValue = '';
    if (!data.options.length) return;
    for (let i = 0; i < data.options.length; i++) {
      const e = data.options[i];
      state.innerValue += e.fullName + state.separator + e.id + '\n';
    }
  }
  async function handleSubmit() {
    let options: any[] = [];
    if (!state.innerValue) return emit('confirm', options);
    let list = state.innerValue.split('\n');
    for (let i = 0; i < list.length; i++) {
      const e = list[i].trim();
      if (!e) continue;
      if (e.indexOf(state.separator) > -1) {
        options.push({ id: e.split(state.separator)[1], fullName: e.split(state.separator)[0] });
      } else {
        options.push({ id: e, fullName: e });
      }
    }
    emit('confirm', options);
    closeModal();
  }
</script>
<style lang="less" scoped>
  .demo-box {
    margin: 10px 0;
    border: 1px solid @border-color-base;
    .demo-box-cell {
      line-height: 36px;
      border-bottom: 1px solid @border-color-base;
      padding: 0 11px;
      &:last-child {
        border-bottom: 0;
      }
      p,
      span {
        display: inline-block;
      }
      span {
        color: @primary-color;
      }
    }
  }
</style>
