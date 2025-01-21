<template>
  <a-form :colon="false" layout="vertical" class="right-board-form">
    <a-form-item label="表单尺寸">
      <future-radio v-model:value="formConf.size" :options="sizeOptions" optionType="button" button-style="solid" />
    </a-form-item>
    <a-form-item label="标签对齐">
      <future-radio v-model:value="formConf.labelPosition" :options="labelPositionOptions" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-form-item label="标题宽度">
      <a-input-number v-model:value="formConf.labelWidth" placeholder="请输入" :min="0" />
    </a-form-item>
    <a-form-item label="标题后缀">
      <a-input v-model:value="formConf.labelSuffix" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="栅格间隔">
      <a-input-number v-model:value="formConf.gutter" placeholder="请输入" :min="0" />
    </a-form-item>
    <a-form-item label="弹窗类型">
      <future-select v-model:value="formConf.popupType" :options="popupTypeOptions" />
    </a-form-item>
    <a-form-item label="表单样式">
      <a-select v-model:value="formConf.formStyle" :options="formStyleOptions" :fieldNames="{ value: 'id', label: 'fullName' }" />
    </a-form-item>
    <a-form-item label="表单宽度" v-if="formConf.popupType === 'general'">
      <a-select v-model:value="formConf.generalWidth">
        <a-select-option v-for="item in generalWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="表单宽度" v-if="formConf.popupType === 'fullScreen'">
      <a-select v-model:value="formConf.fullScreenWidth">
        <a-select-option v-for="item in fullScreenWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="表单宽度" v-if="formConf.popupType === 'drawer'">
      <a-select v-model:value="formConf.drawerWidth">
        <a-select-option v-for="item in generalWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <template #label>表单Css<BasicHelp text="不支持代码生成" /></template>
      <a-button block @click="editStyle()">编写样式</a-button>
    </a-form-item>
    <a-form-item>
      <template #label>表单Class<BasicHelp text="不支持代码生成" /></template>
      <future-select v-model:value="formConf.className" multiple allowClear :options="getClassNameOptions" showSearch />
    </a-form-item>
    <a-form-item label="主键策略">
      <future-select v-model:value="formConf.primaryKeyPolicy" :options="policyOptions" :disabled="!!formInfo.id" />
    </a-form-item>
    <a-form-item>
      <template #label>并发锁定<BasicHelp text="并发提交表单时候，加乐观锁机制以保证数据提交准确性" /></template>
      <a-switch v-model:checked="formConf.concurrencyLock" />
    </a-form-item>
    <a-form-item>
      <template #label>逻辑删除<BasicHelp text="表单是否增加删除标志、删除时间和删除用户字段" /></template>
      <a-switch v-model:checked="formConf.logicalDelete" />
    </a-form-item>
    <a-divider>表单按钮</a-divider>
    <div class="btn-config-list">
      <div class="btn-cell">
        <a-checkbox v-model:checked="formConf.hasConfirmBtn" disabled>确定</a-checkbox>
        <future-i18n-input v-model:value="formConf.confirmButtonText" v-model:i18n="formConf.confirmButtonTextI18nCode" placeholder="请输入" />
      </div>
      <div class="btn-cell">
        <a-checkbox v-model:checked="formConf.hasCancelBtn" disabled>取消</a-checkbox>
        <future-i18n-input v-model:value="formConf.cancelButtonText" v-model:i18n="formConf.cancelButtonTextI18nCode" placeholder="请输入" />
      </div>
      <div class="btn-cell" v-if="showType == 'pc'">
        <a-checkbox v-model:checked="formConf.hasPrintBtn">打印<BasicHelp text="启用流程后,操作按钮以流程节点为准" /></a-checkbox>
        <future-i18n-input v-model:value="formConf.printButtonText" v-model:i18n="formConf.printButtonTextI18nCode" placeholder="请输入" />
      </div>
      <a-form-item v-if="formConf.hasPrintBtn && showType == 'pc'" class="!pl-100px">
        <future-tree-select
          v-model:value="formConf.printId"
          placeholder="请选择"
          multiple
          :options="printTplOptions"
          lastLevel
          :showCheckedStrategy="TreeSelect.SHOW_CHILD" />
      </a-form-item>
      <div class="btn-cell" v-if="showType == 'pc'">
        <a-checkbox class="!w-full" v-model:checked="formConf.hasConfirmAndAddBtn">
          确定并继续操作<BasicHelp text="选中后显示“确定并新增”、“确定并继续”、“上一条”、“下一条”按钮" />
        </a-checkbox>
      </div>
    </div>
    <template v-if="formConf.funcs">
      <a-divider>脚本事件<BasicHelp text="不支持代码生成" /></a-divider>
      <a-form-item label="onLoad">
        <a-button block @click="editFunc('onLoad')">表单加载触发</a-button>
      </a-form-item>
      <a-form-item label="beforeSubmit">
        <a-button block @click="editFunc('beforeSubmit')">提交前置触发</a-button>
      </a-form-item>
      <a-form-item label="afterSubmit">
        <a-button block @click="editFunc('afterSubmit')">提交后置触发</a-button>
      </a-form-item>
    </template>
    <FormScript type="form" @register="registerScriptModal" :treeTitle="formInfo.fullName" :drawingList="drawingList" @confirm="updateScript" />
    <StyleScript @register="registerStyleScriptModal" @confirm="updateStyleScript" />
  </a-form>
</template>
<script lang="ts" setup>
  import { inject, computed, ref, unref } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import FormScript from './FormScript.vue';
  import StyleScript from './StyleScript.vue';
  import { useModal } from '@/components/Modal';
  import { cloneDeep } from 'lodash-es';

  const sizeOptions = [
    { id: 'large', fullName: '较大' },
    { id: 'middle', fullName: '中等' },
    { id: 'small', fullName: '较小' },
  ];
  const defaultLabelPositionOptions = [
    { id: 'left', fullName: '左对齐', disabled: false },
    { id: 'right', fullName: '右对齐', disabled: false },
    { id: 'top', fullName: '顶部对齐', disabled: false },
  ];
  const popupTypeOptions = [
    { id: 'general', fullName: '居中弹窗' },
    { id: 'drawer', fullName: '右侧弹窗' },
    { id: 'fullScreen', fullName: '全屏弹窗' },
  ];
  const formStyleOptions = [
    { id: '', fullName: '默认风格' },
    { id: 'word-form', fullName: '公文风格' },
  ];
  const policyOptions = [
    { id: 1, fullName: '雪花ID' },
    { id: 2, fullName: '自增长ID' },
  ];
  const generalWidthOptions = ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'];
  const fullScreenWidthOptions = ['800px', '1000px', '1200px', '1400px', '50%', '60%', '70%', '80%', '90%', '100%'];

  const props = defineProps(['activeData', 'formConf', 'drawingList', 'formInfo', 'dbType', 'printTplOptions']);

  const getShowType: (() => string | undefined) | undefined = inject('getShowType');
  const showType = computed(() => (getShowType as () => string | undefined)());
  const [registerScriptModal, { openModal: openScriptModal }] = useModal();
  const [registerStyleScriptModal, { openModal: openStyleScriptModal }] = useModal();
  const activeFunc = ref('');

  const labelPositionOptions = computed(() => {
    const options = cloneDeep(defaultLabelPositionOptions);
    options[2].disabled = props.formConf.formStyle === 'word-form';
    return options;
  });
  const getClassNameOptions = computed(() => unref(props.formConf).classNames.map(o => ({ id: o, fullName: o })));

  function editFunc(funcName) {
    activeFunc.value = funcName;
    openScriptModal(true, { text: unref(props.formConf).funcs[funcName] });
  }
  function updateScript(data) {
    props.formConf.funcs[activeFunc.value] = data;
  }
  function editStyle() {
    openStyleScriptModal(true, { text: unref(props.formConf).classJson });
  }
  function updateStyleScript(data) {
    props.formConf.classJson = data;
    props.formConf.classNames = spiltByDoc(data);
  }
  function spiltByDoc(str) {
    str = str.trim();
    let arr: any[] = [];
    let cut = str.split('}');
    cut.forEach(item => {
      if (item) {
        let afterCut = item.split('{');
        let classObject = { key: '', value: '' };
        let name = '';
        if (afterCut[0].split(' ').length > 1) {
          name = afterCut[0].split(' ')[0];
        } else {
          name = afterCut[0];
        }
        if (name.split('\.').length > 1) {
          name = name.split('\.')[1];
        }
        name = name.split('\:')[0];
        let matching = new RegExp(/^[a-zA-Z]-?.*[a-zA-Z0-9_]*$/);
        if (matching.test(name)) {
          classObject.key = name.replace(/\r|\n/gi, '').trim();
          classObject.value = item.replace(/\r|\n/gi, '') + '}';
          arr.push(classObject);
        }
      }
    });
    return arr.map(o => o.key);
  }
</script>
