<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="批量编辑" showOkBtn @ok="handleSubmit" :width="700">
    <a-alert message="注意：每行对应一个选项；选项名、选项值和父级选项值之间用英文 | 隔开。格式如下：" type="warning" show-icon />
    <div class="demo-box">
      <div class="demo-box-cell">
        <p class="w-260px">根节点格式：选项名|选项值</p>
        <p>输入示例：<span>选项一|选项一的值</span></p>
      </div>
      <div class="demo-box-cell">
        <p class="w-260px">子节点格式：选项名|选项值|父级选项值</p>
        <p>输入示例：<span>选项一|选项一的值|选项一父级的值</span></p>
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
    const loop = (list, parentId?) => {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        let parent = '';
        if (parentId) parent = state.separator + parentId;
        state.innerValue += e.fullName + state.separator + e.id + parent + '\n';
        if (e?.children && Array.isArray(e.children)) {
          loop(e.children, e.id);
        }
      }
    };
    loop(data.options);
  }
  async function handleSubmit() {
    let options: any[] = [];
    if (!state.innerValue) return emit('confirm', options);
    const list = state.innerValue.split('\n');
    for (let i = 0; i < list.length; i++) {
      const e = list[i].trim();
      if (!e || e.indexOf(state.separator) < 0) continue;
      const row = e.split(state.separator) || [];
      if (row.length < 2) continue;
      if (isRepeat(options, row[1])) continue;
      if (row.length === 2) {
        options.push({ fullName: row[0], id: row[1], children: [] });
        continue;
      }
      if (row.length === 3) {
        const getParentId = (list, row) => {
          let parentId = row[row.length - 1];
          for (let i = 0; i < list.length; i++) {
            const e = list[i];
            if (e.children && e.children.length) getParentId(e.children, row);
            if (e.id == parentId) {
              e.children.push({ fullName: row[0], id: row[1], children: [] });
              break;
            }
          }
        };
        getParentId(options, row);
      }
    }
    emit('confirm', options);
    closeModal();
  }
  function isRepeat(options, id) {
    let boo = false;
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.id == id) {
          boo = true;
          break;
        }
        if (e.children && Array.isArray(e.children)) loop(e.children);
      }
    };
    loop(options);
    return boo;
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
