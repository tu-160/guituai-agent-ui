<template>
  <div class="column-design-container">
    <div class="main-board">
      <future-group-title content="查询字段" :bordered="false" />
      <a-table :data-source="columnData.searchList" :columns="searchColumns" size="small" :pagination="false" rowKey="id" class="search-table-app">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'drag'">
            <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
          </template>
          <template v-if="column.key === 'label'">
            <a-input v-model:value="record.label" placeholder="请输入" allowClear />
          </template>
          <template v-if="column.key === 'futureKey'">
            <future-select
              v-model:value="record.futureKey"
              :options="viewFutureKeyOptions"
              :disabled="record.__config__.isFromParam"
              class="!w-160px"
              @change="onFutureKeyChange($event, record, index)" />
            <template v-if="canSetAttrs.includes(record.futureKey) && !record.__config__.isFromParam">
              <i class="icon-ym icon-ym-shezhi cursor-pointer ml-8px leading-30px" title="组件属性设置" @click="openExtraConfig(record, index)" />
            </template>
          </template>
          <template v-if="column.key === 'searchType'">
            <future-select
              v-model:value="record.searchType"
              :options="searchTypeOptions"
              :disabled="!['input', 'textarea'].includes(record.futureKey)"
              v-if="!record.__config__.isFromParam" />
            <span v-else></span>
          </template>
          <template v-if="column.key === 'value'">
            <template v-if="showInputList.includes(record.futureKey)">
              <a-input v-model:value="record.value" placeholder="请输入" allowClear />
            </template>
            <template v-if="record.futureKey === 'inputNumber'">
              <future-number-range v-model:value="record.value" :precision="record.precision" :disabled="record.disabled" />
            </template>
            <template v-if="['rate', 'slider'].includes(record.futureKey)">
              <future-number-range v-model:value="record.value" :precision="record.allowHalf ? 1 : 0" :disabled="record.disabled" />
            </template>
            <template v-if="showSelectList.includes(record.futureKey)">
              <future-select
                v-model:value="record.value"
                :options="record.options"
                :fieldNames="record.props"
                :multiple="record.searchMultiple"
                showSearch
                allowClear />
            </template>
            <template v-if="record.futureKey === 'datePicker'">
              <future-date-range v-model:value="record.value" :format="record.format" allowClear />
            </template>
            <template v-if="record.futureKey === 'timePicker'">
              <future-time-range v-model:value="record.value" :format="record.format" allowClear />
            </template>
            <template v-if="record.futureKey === 'roleSelect'">
              <future-role-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'groupSelect'">
              <future-group-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'areaSelect'">
              <future-area-select v-model:value="record.value" :level="record.level" :multiple="record.searchMultiple" :key="record.cellKey" allowClear />
            </template>
            <template v-if="record.futureKey === 'organizeSelect'">
              <future-organize-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'cascader'">
              <future-cascader
                v-model:value="record.value"
                placeholder="请选择"
                :options="record.options"
                :fieldNames="record.props"
                :showAllLevels="record.showAllLevels"
                :multiple="record.searchMultiple"
                showSearch
                allowClear />
            </template>
            <template v-if="record.futureKey === 'depSelect'">
              <future-dep-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'posSelect'">
              <future-pos-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'userSelect'">
              <future-user-select
                v-model:value="record.value"
                :selectType="record.selectType != 'all' && record.selectType != 'custom' ? 'all' : record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'usersSelect'">
              <future-users-select
                v-model:value="record.value"
                :selectType="record.selectType"
                :ableIds="record.ableIds"
                :multiple="record.searchMultiple"
                allowClear />
            </template>
            <template v-if="record.futureKey === 'autoComplete'">
              <future-auto-complete
                v-model:value="record.value"
                :placeholder="record.placeholder"
                :allowClear="record.clearable"
                :disabled="record.disabled"
                :interfaceId="record.interfaceId"
                :relationField="record.relationField"
                :templateJson="record.templateJson"
                :total="record.total" />
            </template>
          </template>
          <template v-if="column.key === 'isKeyword'">
            <a-checkbox v-model:checked="record.isKeyword" :disabled="!canSetKeyword.includes(record.futureKey) || (getIsKeywordDisabled && !record.isKeyword)" />
          </template>
          <template v-if="column.key === 'searchMultiple'">
            <a-checkbox
              v-model:checked="record.searchMultiple"
              :disabled="!multipleList.includes(record.futureKey)"
              @change="onSearchMultipleChange(record, index)" />
          </template>
        </template>
      </a-table>
      <future-group-title content="列表字段" :bordered="false" class="mt-20px" />
      <a-table :data-source="columnData.columnList" :columns="columnColumns" size="small" :pagination="false" rowKey="id" class="column-table-app">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'drag'">
            <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
          </template>
          <template v-if="column.key === 'label' && webType == 4">
            <a-input v-model:value="record.label" placeholder="请输入" allowClear />
          </template>
          <template v-if="column.key === 'sortable'">
            <a-checkbox
              v-model:checked="record.sortable"
              :disabled="
                record.id.indexOf('_future_') > 0 || (record.__config__ && record.__config__.isSubTable) || noGroupList.includes(record.__config__.futureKey)
              " />
          </template>
        </template>
      </a-table>
    </div>
    <div class="right-board">
      <a-tabs v-model:activeKey="activeKey" :tabBarGutter="11" class="average-tabs">
        <a-tab-pane key="search" tab="查询字段"></a-tab-pane>
        <a-tab-pane key="field" tab="列表字段"></a-tab-pane>
        <a-tab-pane key="column" tab="列表属性"></a-tab-pane>
      </a-tabs>
      <div class="right-main">
        <div class="h-full" v-show="activeKey === 'search'">
          <a-table
            :data-source="getSearchOptions"
            :columns="rightColumns"
            size="small"
            :pagination="false"
            :scroll="{ y: 'calc(100vh - 161px)' }"
            rowKey="id"
            :row-selection="{ columnWidth: 50, selectedRowKeys: searchSelectedRowKeys, onChange: onSearchSelectChange }">
            <template #headerCell>查询字段</template>
          </a-table>
        </div>
        <div class="h-full" v-show="activeKey === 'field'">
          <a-table
            :data-source="state.columnOptions"
            :columns="rightColumns"
            size="small"
            :pagination="false"
            :scroll="{ y: 'calc(100vh - 161px)' }"
            rowKey="id"
            :row-selection="{ columnWidth: 50, selectedRowKeys: columnSelectedRowKeys, onChange: onColumnSelectChange }">
            <template #headerCell>列表字段</template>
          </a-table>
        </div>
        <ScrollContainer v-show="activeKey === 'column'">
          <a-form :colon="false" layout="vertical" class="right-board-form !-mt-10px">
            <a-divider>表格配置</a-divider>
            <a-form-item label="数据过滤" v-if="webType != 4">
              <a-button block @click="editRuleList">{{ getRuleBtnText }}</a-button>
            </a-form-item>
            <a-form-item label="默认排序">
              <a-button block @click="editDefaultSortConfig">默认排序配置</a-button>
            </a-form-item>
            <a-form-item label="分页设置">
              <a-switch v-model:checked="columnData.hasPage" :disabled="!!interfaceHasPage" />
            </a-form-item>
            <a-form-item label="分页条数" v-if="columnData.hasPage">
              <future-radio v-model:value="columnData.pageSize" :options="pageSizeOptions" optionType="button" button-style="solid" class="right-radio" />
            </a-form-item>
            <template v-if="webType != 4 && [1, 4].includes(columnData.type)">
              <a-form-item label="标签面板">
                <a-switch v-model:checked="columnData.tabConfig.on" />
              </a-form-item>
              <template v-if="columnData?.tabConfig?.on">
                <a-form-item label="筛选字段">
                  <future-select
                    v-model:value="columnData.tabConfig.relationField"
                    :options="state.tabRelationFieldOptions"
                    :fieldNames="{ options: 'options1' }"
                    showSearch
                    @change="onRelationChange" />
                </a-form-item>
                <a-form-item label="全部标签">
                  <a-switch v-model:checked="columnData.tabConfig.hasAllTab" />
                </a-form-item>
              </template>
            </template>
            <a-divider>按钮配置</a-divider>
            <div class="btnsList" v-if="webType != 4">
              <div v-for="item in columnData.btnsList" :key="item.value" class="btnsList-cell">
                <a-checkbox v-model:checked="item.show">{{ getBtnText(item.value) }}</a-checkbox>
                <a-input v-model:value="item.label" placeholder="按钮名称" />
              </div>
            </div>
            <div class="btnsList" v-if="webType != 4">
              <div v-for="(item, index) in columnData.columnBtnsList" :key="item.value" class="btnsList-cell">
                <a-checkbox v-model:checked="item.show">{{ getBtnText(item.value) }}</a-checkbox>
                <a-input v-model:value="item.label" placeholder="按钮名称">
                  <template #addonBefore>
                    <span class="cursor-pointer" @click="handleEnableRule(item, index)">启用规则<BasicHelp text="不支持代码生成" /></span>
                  </template>
                </a-input>
              </div>
            </div>
            <div>
              <p class="btn-cap">自定义按钮区<BasicHelp text="不支持代码生成" /></p>
              <div class="custom-btns-list">
                <draggable v-model="columnData.customBtnsList" :animation="300" group="selectItem" handle=".option-drag" itemKey="value">
                  <template #item="{ element, index }">
                    <div class="custom-item">
                      <div class="custom-line-icon option-drag">
                        <i class="icon-ym icon-ym-darg" />
                      </div>
                      <p class="custom-line-value">{{ element.value }}</p>
                      <a-input v-model:value="element.label" placeholder="按钮名称">
                        <template #addonBefore>
                          <span class="cursor-pointer" @click="editBtnEvent(element, index)">事件</span>
                        </template>
                      </a-input>
                      <div class="close-btn custom-line-icon" @click="columnData.customBtnsList.splice(index, 1)">
                        <i class="icon-ym icon-ym-btn-clearn" />
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="add-btn">
                  <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addCustomBtn">添加按钮</a-button>
                </div>
              </div>
            </div>
            <div v-if="webType != 4">
              <a-divider>权限设置</a-divider>
              <a-form-item label="按钮权限">
                <a-switch v-model:checked="columnData.useBtnPermission" />
              </a-form-item>
              <a-form-item label="列表权限">
                <a-switch v-model:checked="columnData.useColumnPermission" />
              </a-form-item>
              <a-form-item label="表单权限">
                <a-switch v-model:checked="columnData.useFormPermission" />
              </a-form-item>
              <a-form-item label="数据权限">
                <a-switch v-model:checked="columnData.useDataPermission" />
              </a-form-item>
            </div>
            <a-divider>脚本事件<BasicHelp text="不支持代码生成" /></a-divider>
            <a-form-item :label="getFuncText(key)" v-for="(_value, key) in columnData.funcs" :key="key">
              <a-button block @click="editFunc(key)">脚本编写</a-button>
            </a-form-item>
          </a-form>
        </ScrollContainer>
      </div>
    </div>
    <FormScript @register="registerScriptModal" @confirm="updateScript" />
    <BtnEvent @register="registerBtnEventModal" @confirm="updateBtnEvent" />
    <ConditionModal @register="registerConditionModal" @confirm="updateRuleList" />
    <DefaultSortConfigModal @register="registerDefaultSortConfigModal" @confirm="updateDefaultSortConfig" />
    <ExtraConfigModal @register="registerExtraConfigModal" @confirm="updateSearchRow" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, toRefs, unref, nextTick } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import {
    noColumnShowList,
    noSearchList,
    noGroupList,
    getSearchType,
    getDefaultValue,
    getSearchMultiple,
    defaultFuncsData,
    defaultAppColumnData,
    defaultBtnEnableFunc,
    defaultAppBtnsList,
    defaultColumnBtnsList,
  } from '../helper/config';
  import { cloneDeep } from 'lodash-es';
  import draggable from 'vuedraggable';
  import { buildBitUUID } from '@/utils/uuid';
  import { useModal } from '@/components/Modal';
  import FormScript from './FormScript.vue';
  import BtnEvent from './BtnEvent.vue';
  import ConditionModal from './ConditionModal.vue';
  import DefaultSortConfigModal from './DefaultSortConfigModal.vue';
  import ExtraConfigModal from './ExtraConfigModal.vue';
  import Sortablejs from 'sortablejs';
  import { dyOptionsList } from '@/components/FormGenerator/src/helper/config';
  import { getDictionaryDataSelector } from '@/api/systemData/dictionary';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { getParamList } from '@/utils/future';

  interface State {
    columnData: any;
    groupFieldOptions: any[];
    tabRelationFieldOptions: any[];
    columnOptions: any[];
    searchOptions: any[];
    defaultBtnsList: any[];
    defaultColumnBtnsList: any[];
    activeFunc: string;
    activeBtn: string;
    searchSelectedRowKeys: string[];
    columnSelectedRowKeys: string[];
    activeSearchRowIndex: number;
  }

  const props = defineProps(['conf', 'formInfo', 'viewFields', 'interfaceParam', 'interfaceHasPage']);
  defineExpose({ getData });

  const pageSizeOptions = [
    { id: 20, fullName: '20条' },
    { id: 50, fullName: '50条' },
    { id: 80, fullName: '80条' },
    { id: 100, fullName: '100条' },
  ];
  const rightColumns = [{ title: '字段', dataIndex: 'fullName', key: 'fullName' }];
  const columnColumns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '列名', dataIndex: 'label', key: 'label', width: '40%' },
    { title: '字段', dataIndex: 'prop', key: 'prop' },
    { title: '排序', dataIndex: 'sortable', key: 'sortable', width: 60, align: 'center' },
  ];
  const multipleList = ['select', 'depSelect', 'roleSelect', 'userSelect', 'usersSelect', 'organizeSelect', 'posSelect', 'groupSelect'];
  const canSetKeyword = ['input', 'textarea', 'autoComplete'];
  const canSetAttrs = ['select', 'datePicker', 'timePicker', 'organizeSelect', 'depSelect', 'userSelect'];
  const searchTypeOptions = [
    { id: 1, fullName: '等于查询' },
    { id: 2, fullName: '模糊查询' },
    { id: 3, fullName: '范围查询' },
  ];
  const viewFutureKeyOptions = [
    { id: 'input', fullName: '单行输入' },
    { id: 'inputNumber', fullName: '数字输入' },
    { id: 'select', fullName: '下拉选择' },
    { id: 'datePicker', fullName: '日期选择' },
    { id: 'timePicker', fullName: '时间选择' },
    { id: 'organizeSelect', fullName: '组织选择' },
    { id: 'depSelect', fullName: '部门选择' },
    { id: 'roleSelect', fullName: '角色选择' },
    { id: 'posSelect', fullName: '岗位选择' },
    { id: 'groupSelect', fullName: '分组选择' },
    { id: 'userSelect', fullName: '用户选择' },
  ];
  const showInputList = ['input', 'billRule'];
  const showSelectList = ['checkbox', 'radio', 'select'];

  const activeKey = ref('column');
  const state = reactive<State>({
    columnData: cloneDeep(defaultAppColumnData),
    groupFieldOptions: [],
    tabRelationFieldOptions: [],
    columnOptions: [],
    searchOptions: [],
    defaultBtnsList: [],
    defaultColumnBtnsList: [],
    activeFunc: '',
    activeBtn: '',
    searchSelectedRowKeys: [],
    columnSelectedRowKeys: [],
    activeSearchRowIndex: 0,
  });
  const { columnData, searchSelectedRowKeys, columnSelectedRowKeys } = toRefs(state);
  const [registerScriptModal, { openModal: openScriptModal }] = useModal();
  const [registerBtnEventModal, { openModal: openBtnEventModal }] = useModal();
  const [registerConditionModal, { openModal: openConditionModal }] = useModal();
  const [registerDefaultSortConfigModal, { openModal: openDefaultSortConfigModal }] = useModal();
  const [registerExtraConfigModal, { openModal: openExtraConfigModal }] = useModal();

  const webType = computed(() => props.formInfo?.webType);
  const getDrawingList = computed(() => {
    if (!props.formInfo || !props.formInfo.formData) return [];
    const formData = props.formInfo?.formData && JSON.parse(props.formInfo.formData);
    return formData.fields || [];
  });
  const getRuleBtnText = computed(() => (state.columnData?.ruleListApp?.conditionList?.length ? '编辑过滤条件' : '添加过滤条件'));
  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.futureKey) {
        const visibility = !data.__config__.visibility || (Array.isArray(data.__config__.visibility) && data.__config__.visibility.includes('app'));
        if (data.__config__.layout === 'colFormItem' && data.__vModel__ && visibility) {
          const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
          list.push({
            id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
            fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
            fullNameI18nCode: isTableChild
              ? [parent.__config__.labelI18nCode || '', data.__config__.labelI18nCode || '']
              : [data.__config__.labelI18nCode || ''],
            ...data,
          });
        }
      }
    };
    loop(unref(getDrawingList));
    return list;
  });
  const viewFieldOptions = computed(() => {
    if (!props.viewFields) return [];
    return props.viewFields.map(o => ({ id: o.defaultValue, fullName: o.field, __vModel__: o.defaultValue, __config__: { futureKey: 'input' } }));
  });
  const searchColumns = computed(() => {
    let list = [
      { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
      { title: '列名', dataIndex: 'label', key: 'label', width: 200 },
      { title: '字段', dataIndex: 'prop', key: 'prop' },
      { title: '输入类型', dataIndex: 'futureKey', key: 'futureKey', width: 200 },
      { title: '条件类型', dataIndex: 'searchType', key: 'searchType', width: 200 },
      { title: '默认值', dataIndex: 'value', key: 'value', width: 200 },
      { title: '关键词', dataIndex: 'isKeyword', key: 'isKeyword', width: 70, align: 'center' },
      { title: '是否多选', dataIndex: 'searchMultiple', key: 'searchMultiple', width: 80, align: 'center' },
    ];
    if (unref(webType) == 4) {
      list = list.filter(o => o.dataIndex != 'value' && o.dataIndex != 'isKeyword');
    } else {
      list = list.filter(o => o.dataIndex != 'futureKey');
    }
    return list;
  });
  const getSearchOptions = computed(() =>
    state.columnData.tabConfig.relationField && state.columnData.tabConfig.on
      ? state.searchOptions.filter(o => o.id !== state.columnData.tabConfig.relationField)
      : state.searchOptions,
  );
  const getIsKeywordDisabled = computed(() => state.columnData.searchList.filter(o => o.isKeyword).length >= 3);

  // 供父组件使用 获取表单JSON
  function getData() {
    state.columnData.defaultColumnList = state.columnOptions.map(o => ({
      ...o,
      checked: state.columnData.columnList.some(i => i.prop === o.prop),
    }));
    return state.columnData;
  }
  function getBtnText(key) {
    let text = '';
    switch (key) {
      case 'download':
        text = '导出';
        break;
      case 'batchRemove':
        text = '批量删除';
        break;
      case 'edit':
        text = '编辑';
        break;
      case 'remove':
        text = '删除';
        break;
      case 'detail':
        text = '详情';
        break;
      case 'upload':
        text = '导入';
        break;
      default:
        text = '新增';
        break;
    }
    return text;
  }
  function getFuncText(key) {
    let text = '';
    switch (key) {
      case 'afterOnload':
        text = '表格事件';
        break;
      case 'rowStyle':
        text = '表格行样式';
        break;
      case 'cellStyle':
        text = '单元格样式';
        break;
      default:
        text = '';
        break;
    }
    return text;
  }
  function addCustomBtn() {
    const id = buildBitUUID();
    state.columnData.customBtnsList.push({
      show: true,
      value: 'btn_' + id,
      label: '按钮' + id,
      labelI18nCode: '',
      event: {},
    });
  }
  function editBtnEvent(item, index) {
    state.activeBtn = index;
    openBtnEventModal(true, {
      showType: 'app',
      formFieldsOptions: unref(webType) == 4 ? state.columnOptions : unref(formFieldsOptions),
      dataForm: item.event,
    });
  }
  function updateBtnEvent(data) {
    state.columnData.customBtnsList[state.activeBtn].event = data;
  }
  function editRuleList() {
    if (!state.columnData.ruleListApp || !state.columnData.ruleListApp.matchLogic) state.columnData.ruleListApp = { matchLogic: 'and', conditionList: [] };
    openConditionModal(true, {
      ...state.columnData.ruleListApp,
      fieldOptions: unref(webType) == 4 ? state.columnOptions : unref(formFieldsOptions),
    });
  }
  function updateRuleList(data) {
    state.columnData.ruleListApp = data;
  }
  function editFunc(funcName) {
    state.activeFunc = funcName;
    if (!state.columnData.funcs[state.activeFunc]) state.columnData.funcs[state.activeFunc] = defaultFuncsData[state.activeFunc];
    openScriptModal(true, { text: state.columnData.funcs[state.activeFunc], funcName });
  }
  function handleEnableRule(item, index) {
    state.activeBtn = index;
    if (!item?.event?.enableFunc) item.event = { enableFunc: defaultBtnEnableFunc };
    openScriptModal(true, { text: item.event.enableFunc, funcName: 'btnEnableRule' });
  }
  function updateScript(data, funcName) {
    if (funcName == 'btnEnableRule') {
      state.columnData.columnBtnsList[state.activeBtn].event.enableFunc = data;
    } else {
      state.columnData.funcs[state.activeFunc] = data;
    }
  }
  function editDefaultSortConfig() {
    openDefaultSortConfigModal(true, {
      list: state.columnData.defaultSortConfig,
      columnOptions: state.groupFieldOptions.filter(o => o.id.indexOf('_future_') < 0),
    });
  }
  function updateDefaultSortConfig(data) {
    state.columnData.defaultSortConfig = data;
  }
  function openExtraConfig(record, index) {
    state.activeSearchRowIndex = index;
    openExtraConfigModal(true, { ...record });
  }
  function updateSearchRow(data) {
    state.columnData.searchList[state.activeSearchRowIndex] = data;
  }
  function onFutureKeyChange(val, record, i) {
    record.__config__.futureKey = val;
    let defaultItem: any = {
      id: record.id,
      fullName: record.fullName,
      label: record.label,
      prop: record.prop,
      futureKey: record.futureKey,
      value: getDefaultValue(record),
      searchType: getSearchType(record),
      __vModel__: record.__vModel__,
      searchMultiple: getSearchMultiple(val),
      isKeyword: false,
      __config__: {
        label: record.label,
        futureKey: val,
      },
    };
    if (val === 'datePicker') defaultItem.format = 'yyyy-MM-dd';
    if (val === 'timePicker') defaultItem.format = 'HH:mm:ss';
    if (val === 'select') {
      defaultItem.options = [];
      defaultItem.props = { label: 'fullName', value: 'id' };
      defaultItem.__config__ = {
        ...defaultItem.__config__,
        dataType: 'static',
        propsUrl: '',
        propsName: '',
        templateJson: [],
        dictionaryType: '',
      };
    }
    if (['organizeSelect', 'depSelect', 'userSelect'].includes(val)) {
      defaultItem.isIncludeSubordinate = false;
    }
    state.columnData.searchList[i] = cloneDeep(defaultItem);
  }
  function setBtnValue(data, defaultData) {
    outer: for (let i = 0; i < defaultData.length; i++) {
      inter: for (let ii = 0; ii < data.length; ii++) {
        if (defaultData[i].value === data[ii].value) {
          defaultData[i] = data[ii];
          if (!Reflect.has(defaultData[i], 'show')) defaultData[i].show = true;
          break inter;
        }
      }
    }
    return defaultData;
  }
  function setListValue(data, defaultData, type) {
    data = data.filter(o => defaultData.some(e => o.prop == e.prop));
    outer: for (let i = 0; i < data.length; i++) {
      inter: for (let ii = 0; ii < defaultData.length; ii++) {
        if (data[i].prop === defaultData[ii].prop) {
          if (type === 'column') {
            defaultData[ii].fixed = data[i].fixed;
            defaultData[ii].align = data[i].align;
            defaultData[ii].width = data[i].width;
            defaultData[ii].sortable = data[i].sortable;
            if (unref(webType) == 4) defaultData[ii].label = data[i].label;
          }
          if (type === 'search') {
            if (data[i].futureKey === defaultData[ii].futureKey) {
              defaultData[ii].searchType = data[i].searchType;
              defaultData[ii].searchMultiple = data[i].searchMultiple;
              defaultData[ii].value = data[i].value;
            }
            defaultData[ii].label = data[i].label;
            defaultData[ii].isKeyword = data[i].isKeyword;
            if (unref(webType) == 4) defaultData[ii] = data[i];
          }
          data[i] = defaultData[ii];
          break inter;
        }
      }
    }
    state[type + 'SelectedRowKeys'] = data.map(o => o.prop);
    return data;
  }
  function updateListValue(selectedRowKeys, selectedRows, type) {
    state[type + 'SelectedRowKeys'] = selectedRowKeys;
    if (!selectedRowKeys.length) return (state.columnData[type + 'List'] = []);
    state.columnData[type + 'List'] = state.columnData[type + 'List'].filter(o => selectedRowKeys.some(e => o.prop == e));
    for (let i = 0; i < selectedRows.length; i++) {
      if (!state.columnData[type + 'List'].some(o => o.prop === selectedRows[i].prop)) {
        state.columnData[type + 'List'].push(cloneDeep(selectedRows[i]));
        if (type == 'search') buildOptions([selectedRows[i]]);
      }
    }
  }
  function onSearchSelectChange(selectedRowKeys, selectedRows) {
    updateListValue(selectedRowKeys, selectedRows, 'search');
  }
  function onColumnSelectChange(selectedRowKeys, selectedRows) {
    updateListValue(selectedRowKeys, selectedRows, 'column');
  }
  function initSort() {
    const searchTable: any = document.querySelector(`.search-table-app .ant-table-tbody`);
    Sortablejs.create(searchTable, {
      handle: '.drag-handler',
      animation: 150,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      onStart: () => {},
      onEnd: ({ newIndex, oldIndex }: any) => {
        const currRow = state.columnData.searchList.splice(oldIndex, 1)[0];
        state.columnData.searchList.splice(newIndex, 0, currRow);
      },
    });
    const columnTable: any = document.querySelector(`.column-table-app .ant-table-tbody`);
    Sortablejs.create(columnTable, {
      handle: '.drag-handler',
      animation: 150,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      onStart: () => {},
      onEnd: ({ newIndex, oldIndex }: any) => {
        const currRow = state.columnData.columnList.splice(oldIndex, 1)[0];
        state.columnData.columnList.splice(newIndex, 0, currRow);
      },
    });
  }
  function init(list) {
    list = list.map(o => {
      if (o.__config__ && dyOptionsList.includes(o.__config__.futureKey) && o.__config__.dataType !== 'static') o.options = [];
      return o;
    });
    const columnOptions = list.filter(o => !noColumnShowList.includes(o.__config__.futureKey) || o.isStorage);
    let searchOptions = list.filter(o => !noSearchList.includes(o.__config__.futureKey));
    if (unref(webType) == 4) {
      const interfaceParam = (props.interfaceParam || [])
        .filter(o => o.useSearch)
        .map(o => {
          let futureKey = 'input';
          if (o.dataType === 'int' || o.dataType === 'decimal') futureKey = 'inputNumber';
          if (o.dataType === 'datetime') futureKey = 'datePicker';
          return {
            id: o.field,
            fullName: o.fieldName,
            __vModel__: o.field,
            __config__: { isFromParam: true, futureKey },
          };
        });
      if (props.interfaceHasPage) {
        searchOptions = interfaceParam;
      } else {
        searchOptions = searchOptions.filter(o => !interfaceParam.some(e => e.id === o.id));
        searchOptions = [...interfaceParam, ...searchOptions];
      }
    }
    state.groupFieldOptions = list.filter(o => o.id.indexOf('-') < 0 && !noGroupList.includes(o.__config__.futureKey)).map(o => ({ ...o, disabled: false }));
    state.tabRelationFieldOptions = list.filter(
      o => o.id.indexOf('-') < 0 && ['radio', 'select'].includes(o.__config__.futureKey) && o.__config__.dataType != 'dynamic' && !o.multiple,
    );
    state.columnOptions = columnOptions.map(o => ({
      label: o.fullName,
      labelI18nCode: o.__config__.labelI18nCode || '',
      prop: o.id,
      fixed: 'none',
      align: 'left',
      futureKey: o.__config__.futureKey,
      sortable: false,
      width: null,
      ...o,
    }));
    state.searchOptions = searchOptions.map(o => ({
      label: o.fullName,
      labelI18nCode: o.__config__.labelI18nCode || '',
      prop: o.id,
      futureKey: o.__config__.futureKey,
      value: getDefaultValue(o),
      searchType: getSearchType(o),
      searchMultiple: getSearchMultiple(o.__config__.futureKey),
      isKeyword: false,
      ...o,
    }));
    state.columnData.columnOptions = columnOptions;
    if (!state.columnOptions.length) state.columnData.columnList = [];
    if (!state.searchOptions.length) state.columnData.searchList = [];
    // 处理旧数据兼容问题
    state.columnData.btnsList = setBtnValue(state.columnData.btnsList, cloneDeep(state.defaultBtnsList));
    state.columnData.columnBtnsList = setBtnValue(state.columnData.columnBtnsList, cloneDeep(state.defaultColumnBtnsList));
    nextTick(() => {
      state.columnData.searchList = setListValue(state.columnData.searchList, cloneDeep(state.searchOptions), 'search');
      state.columnData.columnList = setListValue(state.columnData.columnList, cloneDeep(state.columnOptions), 'column');
      initSort();
      buildOptions(state.columnData.searchList);
    });
  }
  function onSearchMultipleChange(record, index) {
    state.columnData.searchList[index].value = getDefaultValue(record);
  }
  function buildOptions(componentList) {
    if (unref(webType) == 4) return;
    componentList.forEach(cur => {
      const config = cur.__config__;
      if (dyOptionsList.includes(config.futureKey)) {
        if (config.dataType === 'dictionary' && config.dictionaryType) {
          cur.options = [];
          getDictionaryDataSelector(config.dictionaryType).then(res => {
            cur.options = res.data.list;
          });
        }
        if (config.dataType === 'dynamic' && config.propsUrl) {
          cur.options = [];
          const query = { paramList: getParamList(config.templateJson) };
          getDataInterfaceRes(config.propsUrl, query).then(res => {
            cur.options = Array.isArray(res.data) ? res.data : [];
          });
        }
      }
    });
  }
  function onRelationChange(val) {
    if (!val) return;
    state.columnData.searchList = state.columnData.searchList.filter(o => o.id !== val);
    state.columnData.searchList = setListValue(state.columnData.searchList, cloneDeep(state.searchOptions), 'search');
  }

  onMounted(() => {
    if (typeof props.conf === 'object' && props.conf !== null) {
      state.columnData = cloneDeep(Object.assign({}, defaultAppColumnData, props.conf));
    }
    state.defaultBtnsList = defaultAppBtnsList;
    state.defaultColumnBtnsList = defaultColumnBtnsList;
    if (unref(webType) != 4) {
      init(unref(formFieldsOptions));
    } else {
      init(unref(viewFieldOptions));
    }
  });
</script>
