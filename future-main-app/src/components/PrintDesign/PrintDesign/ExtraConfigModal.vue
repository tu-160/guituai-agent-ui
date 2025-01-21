<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="转换配置" @ok="handleSubmit" destroyOnClose class="extra-config-modal">
    <div class="extra-config-modal-body" :style="{ 'min-height': activeData.type === 'select' ? '300px' : '150px' }">
      <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }" class="right-board-form">
        <template v-if="activeData.type === 'select'">
          <a-form-item label="数据来源">
            <future-radio
              v-model:value="activeData.config.dataType"
              :options="dataTypeOptions"
              optionType="button"
              buttonStyle="solid"
              @change="onDataTypeChange" />
          </a-form-item>
          <div class="options-list" v-if="activeData.config.dataType === 'static'">
            <draggable v-model="activeData.config.options" :animation="300" group="selectItem" handle=".option-drag" itemKey="uuid">
              <template #item="{ element, index }">
                <div class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <a-input v-model:value="element.fullName" placeholder="选项名" />
                  <a-input v-model:value="element.id" placeholder="选项值" />
                  <div class="close-btn select-line-icon" @click="activeData.config.options.splice(index, 1)">
                    <i class="icon-ym icon-ym-btn-clearn" />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
          <div class="add-btn" v-if="activeData.config.dataType === 'static'">
            <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addSelectItem" class="!px-0">添加选项</a-button>
            <a-divider type="vertical"></a-divider>
            <a-button type="link" @click="openModal(true, { options: activeData.config.options })" class="!px-0">批量编辑</a-button>
          </div>
          <div v-if="activeData.config.dataType === 'dictionary'">
            <a-form-item label="数据字典">
              <future-tree-select
                :options="dicOptions"
                v-model:value="activeData.config.dictionaryType"
                placeholder="请选择"
                lastLevel
                allowClear
                @change="onDictionaryTypeChange" />
            </a-form-item>
            <a-form-item label="存储字段">
              <future-select v-model:value="activeData.config.propsValue" placeholder="请选择" :options="valueOptions" />
            </a-form-item>
          </div>
        </template>
        <a-form-item label="日期类型" v-if="activeData.type === 'date'">
          <future-select v-model:value="activeData.config.format" placeholder="请选择" :options="dateFormatOptions" />
        </a-form-item>
        <template v-if="activeData.type === 'number'">
          <a-form-item label="小数位数">
            <a-input-number v-model:value="activeData.config.precision" placeholder="请输入" :precision="0" :min="0" :max="15" />
          </a-form-item>
          <a-form-item label="千位分隔">
            <a-switch v-model:checked="activeData.config.thousands" />
          </a-form-item>
        </template>
      </a-form>
      <BatchOperate @register="registerBatchOperate" @confirm="onBatchOperateConfirm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getDictionaryTypeSelector } from '@/api/systemData/dictionary';
  import { reactive, toRefs } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import draggable from 'vuedraggable';
  import { buildBitUUID } from '@/utils/uuid';
  import BatchOperate from '@/components/FormGenerator/src/rightComponents/components/BatchOperate.vue';

  interface State {
    activeData: any;
    dicOptions: any[];
  }

  const emit = defineEmits(['register', 'confirm']);
  const dataTypeOptions = [
    { id: 'static', fullName: '静态数据' },
    { id: 'dictionary', fullName: '数据字典' },
  ];
  const valueOptions = [
    { id: 'id', fullName: 'id' },
    { id: 'enCode', fullName: 'enCode' },
  ];
  const dateFormatOptions = [
    { id: 'yyyy', fullName: 'yyyy' },
    { id: 'yyyy-MM', fullName: 'yyyy-MM' },
    { id: 'yyyy-MM-dd', fullName: 'yyyy-MM-dd' },
    { id: 'yyyy-MM-dd HH:mm', fullName: 'yyyy-MM-dd HH:mm' },
    { id: 'yyyy-MM-dd HH:mm:ss', fullName: 'yyyy-MM-dd HH:mm:ss' },
  ];
  const state = reactive<State>({
    activeData: {
      config: {},
    },
    dicOptions: [],
  });
  const { activeData, dicOptions } = toRefs(state);
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerBatchOperate, { openModal }] = useModal();

  const onDataTypeChange = () => {
    state.activeData.config.options = [];
    state.activeData.config.dictionaryType = '';
    state.activeData.config.propsValue = 'id';
  };
  const onDictionaryTypeChange = () => {
    state.activeData.config.options = [];
  };
  const addSelectItem = () => {
    const uuid = buildBitUUID();
    state.activeData.config.options.push({
      fullName: '选项' + uuid,
      id: uuid,
    });
  };
  const onBatchOperateConfirm = options => {
    state.activeData.config.options = options;
  };
  function init(data) {
    state.activeData = cloneDeep(data);
    if (data.type === 'select') getDicOptions();
  }
  function getDicOptions() {
    getDictionaryTypeSelector().then(res => {
      state.dicOptions = res.data.list;
    });
  }
  function handleSubmit() {
    emit('confirm', state.activeData);
    closeModal();
  }
</script>
<style lang="less" scoped>
  .extra-config-modal {
    .extra-config-modal-body {
      min-height: 150px;
      padding-bottom: 20px;

      .options-list {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: -10px;
        .scrollbar__wrap {
          margin-bottom: 0 !important;
        }
        .select-item {
          display: flex;
          border: 1px dashed @component-background;
          box-sizing: border-box;
          & .ant-input + .ant-input {
            margin-left: 4px;
          }
          .ant-select {
            width: 100%;
          }
          & + .select-item {
            margin-top: 4px;
          }
          &.sortable-chosen {
            border: 1px dashed @primary-color;
          }
          .select-line-icon {
            line-height: 31px;
            font-size: 22px;
            padding: 0 4px;
            color: #606266;
            .icon-ym-darg {
              font-size: 20px;
              line-height: 31px;
              display: inline-block;
            }
            .icon-ym-btn-clearn {
              font-size: 18px;
            }
          }
          .close-btn {
            cursor: pointer;
            color: @error-color;
            height: 32px;
            display: flex;
            align-items: center;
          }
          .option-drag {
            cursor: move;
          }
        }

        .future-tree__name {
          width: calc(100% - 60px);
        }
      }
      .add-btn {
        padding-left: 27px;
        margin-top: 10px;
      }
    }
  }
</style>
