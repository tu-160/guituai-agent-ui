<template>
  <a-form-item label="计算公式">
    <div class="pane-calc-preview" @click="openCalcModal()">
      <template v-if="activeData.expression.length">
        <span
          v-for="(item, index) in activeData.expression"
          :key="index"
          :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }">
          {{ typeof item !== 'string' ? item.label : item }}
        </span>
      </template>
      <span v-else class="placeholder-text">编辑计算公式</span>
    </div>
  </a-form-item>
  <a-form-item label="精度">
    <a-input-number v-model:value="activeData.precision" placeholder="请输入" :min="0" :max="15" />
  </a-form-item>
  <a-form-item label="千位分隔">
    <a-switch v-model:checked="activeData.thousands" />
  </a-form-item>
  <a-form-item label="大写金额">
    <a-switch v-model:checked="activeData.isAmountChinese" />
  </a-form-item>
  <BasicModal @register="registerModal" title="编辑计算公式" @ok="handleSubmit" class="calc-modal">
    <div class="calc-box">
      <div class="calc-preview" :class="{ error: !expValid }">
        计算公式 =
        <span
          v-for="(item, index) in expressionTemp"
          :key="index"
          :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }">
          {{ typeof item !== 'string' ? item.label : item }}
        </span>
        <div class="preview-actions">
          <a-tooltip title="删除" placement="bottom">
            <arrow-left-outlined @click="expressionTemp.pop()" />
          </a-tooltip>
          <a-tooltip title="清空" placement="bottom">
            <delete-outlined @click="expressionTemp = []" />
          </a-tooltip>
        </div>
      </div>
      <div class="calc-tip">
        编辑计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算
      </div>
      <div>
        <span>计算对象：</span>
        <template v-if="calculateComps.length">
          <span v-for="item in calculateComps" :key="item.__vModel__" @click="expressionTemp.push(item)" class="calc-btn">
            {{ item.label }}
          </span>
        </template>
        <span class="empty-text" v-else>暂无数据</span>
      </div>
      <div class="comBtn my-10px">
        <span>计算符号：</span>
        <span v-for="item in ['+', '-', '×', '÷', '(', ')']" class="calc-btn" :key="item" @click="expressionTemp.push(item)">{{ item }}</span>
      </div>
      <div class="my-10px">
        <span style="float: left">数字键盘：</span>
        <div class="numBtn comBtn">
          <span :key="item" class="calc-btn" v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']" @click="expressionTemp.push(item)">{{
            item
          }}</span>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { mergeNumberOfExps, validExp } from '../helper/utils';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'drawingList']);
  const { createMessage } = useMessage();
  const [registerModal, { openModal, closeModal }] = useModal();
  const expressionTemp = ref<any[]>([]);
  const expValid = ref(true);

  const calculateComps = computed<any[]>(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.futureKey && data.__vModel__) {
        if (['inputNumber', 'calculate'].includes(data.__config__.futureKey)) {
          const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
          if (isTableChild && !isSameSource(data)) return;
          list.push({
            __vModel__: isTableChild ? parent.__vModel__ + '.' + data.__vModel__ : data.__vModel__,
            label: isTableChild ? parent.__config__.label + '.' + data.__config__.label : data.__config__.label,
          });
        }
      }
    };
    loop(props.drawingList);
    return list;
  });

  function openCalcModal() {
    expressionTemp.value = cloneDeep(props.activeData.expression);
    expValid.value = true;
    openModal();
  }
  function handleSubmit() {
    if (!expressionTemp.value.length) {
      props.activeData.expression = expressionTemp.value;
      closeModal();
      return;
    }
    let formatExp = mergeNumberOfExps(expressionTemp.value);
    const temp = formatExp.map(t => (typeof t === 'object' ? 1 : t));
    let boo = expressionTemp.value.some(o => o.label === '无效的值');
    if (boo) return createMessage.error(`编辑的公式含有无效的值，无法计算`);
    expValid.value = validExp(temp, false);
    if (expValid.value) {
      props.activeData.expression = expressionTemp.value;
      closeModal();
    } else {
      createMessage.error(`编辑的公式不符合计算法则，无法计算`);
    }
  }
  function reloadExpressionTemp() {
    const isValid = d => {
      const target = unref(calculateComps).find(cmp => cmp.__vModel__ === d.__vModel__ && cmp.__vModel__ === d.__vModel__);
      return target ? true : false;
    };
    expressionTemp.value = props.activeData.expression.map(t => {
      return typeof t === 'string' || isValid(t) ? t : { __vModel__: t.__vModel__, label: '无效的值' };
    });
    props.activeData.expression = expressionTemp.value;
  }
  function isSameSource(data) {
    const isSubTable = props.activeData.__config__.isSubTable;
    if (isSubTable) return data.__config__.isSubTable && props.activeData.__config__.parentVModel === data.__config__.parentVModel;
    return true;
  }

  onMounted(() => {
    reloadExpressionTemp();
  });
</script>
<style lang="less" scoped>
  html[data-theme='dark'] {
    .pane-calc-preview {
      border: 1px solid #303030 !important;
      .placeholder-text {
        color: #565656;
      }
    }
  }
  .pane-calc-preview {
    padding: 0 11px;
    cursor: pointer;
    min-height: 32px;
    border: 1px solid @border-color-base;
    border-radius: 2px;
    font-size: 13px;
    .placeholder-text {
      color: #bfbfbf;
      line-height: 32px;
      font-weight: 400;
      font-size: 14px;
    }
    span {
      line-height: 32px;
    }
    .calc-btn {
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .calc-btn {
    padding: 4px 8px;
    margin: 0 6px;
    background: @app-main-background;
    cursor: pointer;

    &.error {
      background: @error-color;
    }
    &:hover {
      background: @app-content-background;
    }
  }
  .calc-modal {
    .calc-box {
      font-size: 12px;
      line-height: 2;
      .calc-tip {
        margin: 10px 0;
        font-size: 12px;
        color: @text-color-secondary;
      }
      .empty-text {
        margin: 6px 0;
        color: @text-color-secondary;
      }
      .numBtn {
        width: 110px;
        line-height: 2.5;
        overflow: hidden;
      }
      .comBtn {
        .calc-btn {
          height: 22px;
          width: 22px;
          padding: 0;
          text-align: center;
          line-height: 22px;
          display: inline-block;
        }
      }

      .calc-preview {
        border: 1px solid @border-color-base1;
        border-radius: 2px;
        min-height: 60px;
        padding: 4px 10px;
        position: relative;

        &.error {
          border: 1px solid @error-color;
        }

        .preview-actions {
          position: absolute;
          bottom: 0;
          right: 0;
          .anticon {
            font-size: 14px;
            margin-right: 8px;
            cursor: pointer;
            &:hover {
              color: @error-color;
            }
          }
        }
      }
    }
  }
</style>
