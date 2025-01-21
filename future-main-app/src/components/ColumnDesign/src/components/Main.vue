<template>
  <div class="column-design-container">
    <div class="main-board">
      <future-group-title content="查询字段" :bordered="false" />
      <a-table :data-source="columnData.searchList" :columns="searchColumns" size="small" :pagination="false" rowKey="id" class="search-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'drag'">
            <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
          </template>
          <template v-if="column.key === 'label'">
            <future-i18n-input v-model:value="record.label" v-model:i18n="record.labelI18nCode" placeholder="请输入" allowClear />
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
      <a-table :data-source="columnData.columnList" :columns="columnColumns" size="small" :pagination="false" rowKey="id" class="column-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'drag'">
            <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
          </template>
          <template v-if="column.key === 'label' && webType == 4">
            <future-i18n-input v-model:value="record.label" v-model:i18n="record.labelI18nCode" placeholder="请输入" allowClear />
          </template>
          <template v-if="column.key === 'sortable'">
            <a-checkbox
              v-model:checked="record.sortable"
              :disabled="
                record.id.indexOf('_future_') > 0 || (record.__config__ && record.__config__.isSubTable) || noGroupList.includes(record.__config__.futureKey)
              " />
          </template>
          <template v-if="column.key === 'fixed'">
            <future-select
              v-model:value="record.fixed"
              :options="fixedOptions"
              :disabled="record.__config__ && record.__config__.isSubTable"
              @change="onFixedChange" />
          </template>
          <template v-if="column.key === 'align'">
            <future-select v-model:value="record.align" :options="alignOptions" />
          </template>
          <template v-if="column.key === 'width'">
            <a-input-number v-model:value="record.width" placeholder="请输入" :min="0" :precision="0" />
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
          <a-form :colon="false" layout="vertical" class="right-board-form">
            <div class="typeList">
              <div class="item" :class="{ 'view-item': webType == 4 }" v-for="(item, index) in getTypeList" :key="index" @click="toggleType(item.value)">
                <div class="item-img" :class="{ checked: columnData.type == item.value }">
                  <img :src="item.url" />
                  <div class="icon-checked" v-if="columnData.type == item.value">
                    <check-outlined />
                  </div>
                </div>
                <p class="item-name">{{ item.name }}</p>
              </div>
            </div>
            <div v-if="columnData.type == 2">
              <a-divider>左侧配置</a-divider>
              <a-form-item>
                <template #label>左侧查询<BasicHelp text="暂不支持异步的左侧查询" /></template>
                <a-switch v-model:checked="columnData.hasTreeQuery" />
              </a-form-item>
              <a-form-item label="左侧标题">
                <future-i18n-input v-model:value="columnData.treeTitle" v-model:i18n="columnData.treeTitleI18nCode" placeholder="请输入" />
              </a-form-item>
              <a-form-item label="数据来源">
                <future-select
                  v-model:value="columnData.treeDataSource"
                  :options="treeDataSourceOptions"
                  showSearch
                  placeholder="请选择"
                  @change="dataTypeChange" />
              </a-form-item>
              <div v-if="columnData.treeDataSource === 'dictionary'">
                <a-form-item label="数据字典">
                  <future-tree-select v-model:value="columnData.treeDictionary" :options="dicOptions" lastLevel allowClear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="主键字段">
                  <a-select v-model:value="columnData.treePropsValue" placeholder="请选择">
                    <a-select-option value="id">id</a-select-option>
                    <a-select-option value="enCode">enCode</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div v-if="columnData.treeDataSource === 'api'">
                <a-form-item label="数据接口">
                  <interface-modal :value="columnData.treePropsUrl" :title="columnData.treePropsName" popupTitle="数据接口" @change="onTreePropsUrlChange" />
                </a-form-item>
                <a-form-item label="参数设置" v-if="columnData.treeTemplateJson?.length">
                  <select-interface-btn :templateJson="columnData.treeTemplateJson" :showSystemFormId="false" :type="2" />
                </a-form-item>
                <a-form-item label="主键字段">
                  <a-auto-complete
                    v-model:value="columnData.treePropsValue"
                    placeholder="请输入"
                    :options="options"
                    @focus="onFocus(columnData.treePropsValue)"
                    @search="debounceOnSearch(columnData.treePropsValue)" />
                </a-form-item>
                <a-form-item label="显示字段">
                  <a-auto-complete
                    v-model:value="columnData.treePropsLabel"
                    placeholder="请输入"
                    :options="options"
                    @focus="onFocus(columnData.treePropsLabel)"
                    @search="debounceOnSearch(columnData.treePropsLabel)" />
                </a-form-item>
                <a-form-item label="子级字段">
                  <a-input v-model:value="columnData.treePropsChildren" placeholder="请输入" />
                </a-form-item>
              </div>
              <a-form-item label="关联字段">
                <future-select
                  v-model:value="columnData.treeRelation"
                  :options="selectOptions"
                  placeholder="请选择"
                  :fieldNames="{ options: 'options1' }"
                  showSearch
                  @change="onRelationChange" />
              </a-form-item>
              <div v-if="columnData.treeDataSource === 'api'">
                <a-form-item label="数据加载">
                  <future-radio v-model:value="columnData.treeSyncType" :options="treeSyncTypeOptions" />
                </a-form-item>
                <a-form-item v-if="columnData.treeSyncType == 1">
                  <template #label>数据接口<BasicHelp text="提供异步调用的数据接口" /></template>
                  <interface-modal
                    :value="columnData.treeSyncInterfaceId"
                    :title="columnData.treeSyncInterfaceName"
                    popupTitle="数据接口"
                    @change="onTreeSyncInterfaceChange" />
                </a-form-item>
                <a-table
                  :data-source="columnData.treeSyncTemplateJson"
                  :columns="treeSyncTemplateJsonColumns"
                  size="small"
                  :pagination="false"
                  v-if="columnData.treeSyncTemplateJson.length && columnData.treeSyncType == 1">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'field'">
                      <span class="required-sign">{{ record.required ? '*' : '' }}</span>
                      {{ record.field }}{{ record.fieldName ? '(' + record.fieldName + ')' : '' }}
                    </template>
                    <template v-if="column.key === 'relationField'">
                      <a-input v-model:value="record.relationField" placeholder="请输入" />
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
            <a-divider>表格配置</a-divider>
            <a-form-item label="数据过滤" v-if="webType != 4">
              <a-button block @click="editRuleList">{{ getRuleBtnText }}</a-button>
            </a-form-item>
            <a-form-item label="复杂表头" v-if="columnData.type !== 3 && columnData.type !== 5">
              <a-button block @click="handleComplexHeader">{{ state.columnData.complexHeaderList?.length ? '编辑复杂表头' : '复杂表头配置' }}</a-button>
            </a-form-item>
            <a-form-item label="分组字段" v-if="columnData.type == 3">
              <future-select
                v-model:value="columnData.groupField"
                :options="state.groupFieldOptions"
                placeholder="请选择"
                :fieldNames="{ options: 'options1' }"
                showSearch />
            </a-form-item>
            <a-form-item label="父级字段" v-if="columnData.type == 5">
              <future-select
                v-model:value="columnData.parentField"
                :options="state.treeFieldOptions"
                placeholder="请选择"
                :fieldNames="{ options: 'options1' }"
                showSearch />
            </a-form-item>
            <a-form-item label="默认排序">
              <a-button block @click="editDefaultSortConfig">默认排序配置</a-button>
            </a-form-item>
            <a-form-item label="高级查询" v-if="webType != 4">
              <a-switch v-model:checked="columnData.hasSuperQuery" />
            </a-form-item>
            <a-form-item>
              <template #label>溢出省略<BasicHelp :text="['启用：溢出省略号显示；', '禁用：显示全部信息，溢出换行显示']" /></template>
              <a-switch v-model:checked="columnData.showOverflow" />
            </a-form-item>
            <div v-if="columnData.type !== 3 && columnData.type !== 5">
              <a-form-item label="分页设置">
                <a-switch v-model:checked="columnData.hasPage" :disabled="!!interfaceHasPage" />
              </a-form-item>
              <a-form-item label="分页条数" v-if="columnData.hasPage">
                <future-radio v-model:value="columnData.pageSize" :options="pageSizeOptions" optionType="button" button-style="solid" class="right-radio" />
              </a-form-item>
              <a-form-item label="合计配置">
                <a-switch v-model:checked="columnData.showSummary" />
              </a-form-item>
              <a-form-item label="合计字段" v-if="columnData.showSummary">
                <future-select
                  v-model:value="columnData.summaryField"
                  :options="summaryFieldOptions"
                  placeholder="请选择"
                  :fieldNames="{ options: 'options1' }"
                  showSearch
                  allowClear
                  multiple />
              </a-form-item>
            </div>
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
            <a-form-item label="子表样式" v-if="(columnData.type == 1 || columnData.type == 2) && webType != 4">
              <future-select v-model:value="columnData.childTableStyle" :options="childTableStyleOptions" placeholder="请选择" />
            </a-form-item>
            <a-divider>按钮配置</a-divider>
            <div class="btnsList">
              <template v-for="item in columnData.btnsList" :key="item.value">
                <div v-if="columnData.type !== 5 || (columnData.type == 5 && item.value === 'add')" class="btnsList-cell">
                  <a-checkbox v-model:checked="item.show">{{ getBtnText(item.value) }}</a-checkbox>
                  <div class="flex-1 overflow-hidden">
                    <future-i18n-input v-model:value="item.label" v-model:i18n="item.labelI18nCode" placeholder="按钮名称" />
                    <div class="btn-upload" v-if="item.value === 'upload' && item.show">
                      <a-button block @click="editUpLoadTpl">请设置导入模板</a-button>
                    </div>
                    <div class="btn-upload" v-if="item.value === 'batchPrint' && item.show">
                      <future-tree-select
                        v-model:value="columnData.printIds"
                        placeholder="请选择"
                        multiple
                        :options="printTplOptions"
                        lastLevel
                        :showCheckedStrategy="TreeSelect.SHOW_CHILD"
                        class="w-full" />
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="btnsList">
              <div v-for="(item, index) in columnData.columnBtnsList" :key="item.value" class="btnsList-cell">
                <a-checkbox v-model:checked="item.show">{{ getBtnText(item.value) }}</a-checkbox>
                <future-i18n-input v-model:value="item.label" v-model:i18n="item.labelI18nCode" placeholder="按钮名称">
                  <template #addonBefore>
                    <span class="cursor-pointer px-11px" @click="handleEnableRule(item, index)">启用规则<BasicHelp text="不支持代码生成" /></span>
                  </template>
                </future-i18n-input>
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
                      <future-i18n-input v-model:value="element.label" v-model:i18n="element.labelI18nCode" placeholder="按钮名称">
                        <template #addonBefore>
                          <span class="cursor-pointer" @click="editBtnEvent(element, index)">事件</span>
                        </template>
                      </future-i18n-input>
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
    <UpLoadTpl @register="registerUpLoadTplModal" @confirm="updateUpLoadTpl" />
    <BtnEvent @register="registerBtnEventModal" @confirm="updateBtnEvent" />
    <ConditionModal @register="registerConditionModal" @confirm="updateRuleList" />
    <ComplexHeaderModal @register="registerComplexHeaderModal" @confirm="updateComplexHeaderList" />
    <DefaultSortConfigModal @register="registerDefaultSortConfigModal" @confirm="updateDefaultSortConfig" />
    <ExtraConfigModal @register="registerExtraConfigModal" @confirm="updateSearchRow" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, toRefs, unref, nextTick } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { ScrollContainer } from '@/components/Container';
  import { InterfaceModal } from '@/components/CommonModal';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import {
    noColumnShowList,
    noSearchList,
    noGroupList,
    noUploadList,
    getSearchType,
    getDefaultValue,
    getSearchMultiple,
    defaultFuncsData,
    defaultColumnData,
    defaultBtnEnableFunc,
    defaultBtnsList,
    defaultColumnBtnsList,
  } from '../helper/config';
  import { cloneDeep } from 'lodash-es';
  import { getDictionaryTypeSelector } from '@/api/systemData/dictionary';
  import { getPrintDevSelector } from '@/api/system/printDev';
  import draggable from 'vuedraggable';
  import { buildBitUUID } from '@/utils/uuid';
  import columnType1 from '@/assets/images/generator/columnType1.png';
  import columnType2 from '@/assets/images/generator/columnType2.png';
  import columnType3 from '@/assets/images/generator/columnType3.png';
  import columnType4 from '@/assets/images/generator/columnType4.png';
  import columnType5 from '@/assets/images/generator/columnType5.png';
  import columnTypeDark1 from '@/assets/images/generator/columnType1-dark.png';
  import columnTypeDark2 from '@/assets/images/generator/columnType2-dark.png';
  import columnTypeDark3 from '@/assets/images/generator/columnType3-dark.png';
  import columnTypeDark4 from '@/assets/images/generator/columnType4-dark.png';
  import columnTypeDark5 from '@/assets/images/generator/columnType5-dark.png';
  import { useModal } from '@/components/Modal';
  import FormScript from './FormScript.vue';
  import UpLoadTpl from './UpLoadTpl.vue';
  import BtnEvent from './BtnEvent.vue';
  import ConditionModal from './ConditionModal.vue';
  import ComplexHeaderModal from './ComplexHeaderModal.vue';
  import DefaultSortConfigModal from './DefaultSortConfigModal.vue';
  import ExtraConfigModal from './ExtraConfigModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useAppStore } from '@/store/modules/app';
  import Sortablejs from 'sortablejs';
  import { dyOptionsList } from '@/components/FormGenerator/src/helper/config';
  import { getDictionaryDataSelector } from '@/api/systemData/dictionary';
  import { getDataInterfaceRes, getDataInterfaceInfo } from '@/api/systemData/dataInterface';
  import { useDebounceFn } from '@vueuse/core';
  import { SelectInterfaceBtn } from '@/components/Interface';
  import { getParamList } from '@/utils/future';

  interface State {
    columnData: any;
    groupFieldOptions: any[];
    treeFieldOptions: any[];
    tabRelationFieldOptions: any[];
    columnOptions: any[];
    searchOptions: any[];
    defaultBtnsList: any[];
    defaultColumnBtnsList: any[];
    activeFunc: string;
    activeBtn: string;
    searchSelectedRowKeys: string[];
    columnSelectedRowKeys: string[];
    printTplOptions: any[];
    allOptions: any[];
    options: any[];
    activeSearchRowIndex: number;
  }

  defineExpose({ getData });
  const props = defineProps(['conf', 'formInfo', 'viewFields', 'interfaceParam', 'interfaceHasPage']);
  const appStore = useAppStore();
  const { createMessage } = useMessage();
  const debounceOnSearch = useDebounceFn(onSearch, 300);
  const treeDataSourceOptions = [
    { id: 'dictionary', fullName: '数据字典' },
    { id: 'api', fullName: '远端数据' },
    { id: 'organize', fullName: '组织数据' },
    { id: 'formField', fullName: '表单控件' },
  ];
  const treeSyncTypeOptions = [
    { id: 0, fullName: '同步' },
    { id: 1, fullName: '异步' },
  ];
  const childTableStyleOptions = [
    { id: 1, fullName: '分组展示' },
    { id: 2, fullName: '折叠展示' },
  ];
  const pageSizeOptions = [
    { id: 20, fullName: '20条' },
    { id: 50, fullName: '50条' },
    { id: 80, fullName: '80条' },
    { id: 100, fullName: '100条' },
  ];
  const treeSyncTemplateJsonColumns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '参数名称', dataIndex: 'field', key: 'field', width: 135 },
    { title: '表单字段', dataIndex: 'relationField', key: 'relationField', width: 135 },
  ];
  const rightColumns = [{ title: '字段', dataIndex: 'fullName', key: 'fullName' }];
  const getTypeList = computed(() => {
    const isLight = appStore.getDarkMode === 'light';
    const type1 = isLight ? columnType1 : columnTypeDark1;
    const type2 = isLight ? columnType2 : columnTypeDark2;
    const type3 = isLight ? columnType3 : columnTypeDark3;
    const type4 = isLight ? columnType4 : columnTypeDark4;
    const type5 = isLight ? columnType5 : columnTypeDark5;
    let list = [
      { url: type1, value: 1, name: '普通表格' },
      { url: type2, value: 2, name: '左侧树+普通表格' },
      { url: type4, value: 4, name: '编辑表格' },
      { url: type3, value: 3, name: '分组表格' },
      { url: type5, value: 5, name: '树形表格' },
    ];
    if (unref(webType) == 4) list = list.filter(o => o.value == 1 || o.value == 3);
    return list;
  });
  const columnColumns = computed(() => {
    let list = [
      { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
      { title: '列名', dataIndex: 'label', key: 'label', width: 200 },
      { title: '字段', dataIndex: 'prop', key: 'prop' },
      { title: '排序', dataIndex: 'sortable', key: 'sortable', width: 60, align: 'center' },
      { title: '冻结', dataIndex: 'fixed', key: 'fixed', width: 150 },
      { title: '对齐', dataIndex: 'align', key: 'align', width: 150 },
      { title: '宽度', dataIndex: 'width', key: 'width', width: 150 },
    ];
    if (state.columnData.childTableStyle == 2) {
      list = list.filter(o => o.dataIndex != 'fixed');
    }
    return list;
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
  const alignOptions = [
    { id: 'left', fullName: 'left' },
    { id: 'center', fullName: 'center' },
    { id: 'right', fullName: 'right' },
  ];
  const fixedOptions = [
    { id: 'none', fullName: 'none' },
    { id: 'left', fullName: 'left' },
    { id: 'right', fullName: 'right' },
  ];
  const showInputList = ['input', 'billRule'];
  const showSelectList = ['checkbox', 'radio', 'select'];

  const activeKey = ref('column');
  const dicOptions = ref<any[]>([]);
  const state = reactive<State>({
    columnData: cloneDeep(defaultColumnData),
    groupFieldOptions: [],
    treeFieldOptions: [],
    tabRelationFieldOptions: [],
    columnOptions: [],
    searchOptions: [],
    defaultBtnsList: [],
    defaultColumnBtnsList: [],
    activeFunc: '',
    activeBtn: '',
    searchSelectedRowKeys: [],
    columnSelectedRowKeys: [],
    printTplOptions: [],
    allOptions: [],
    options: [],
    activeSearchRowIndex: 0,
  });
  const { columnData, searchSelectedRowKeys, columnSelectedRowKeys, printTplOptions, options } = toRefs(state);
  const [registerScriptModal, { openModal: openScriptModal }] = useModal();
  const [registerUpLoadTplModal, { openModal: openUpLoadTplModal }] = useModal();
  const [registerBtnEventModal, { openModal: openBtnEventModal }] = useModal();
  const [registerConditionModal, { openModal: openConditionModal }] = useModal();
  const [registerComplexHeaderModal, { openModal: openComplexHeaderModal }] = useModal();
  const [registerDefaultSortConfigModal, { openModal: openDefaultSortConfigModal }] = useModal();
  const [registerExtraConfigModal, { openModal: openExtraConfigModal }] = useModal();

  const webType = computed(() => props.formInfo?.webType);
  const getDrawingList = computed(() => {
    if (!props.formInfo || !props.formInfo.formData) return [];
    const formData = props.formInfo?.formData && JSON.parse(props.formInfo.formData);
    return formData.fields || [];
  });
  const getRuleBtnText = computed(() => (state.columnData?.ruleList?.conditionList?.length ? '编辑过滤条件' : '添加过滤条件'));
  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.futureKey) {
        const visibility = !data.__config__.visibility || (Array.isArray(data.__config__.visibility) && data.__config__.visibility.includes('pc'));
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
  const selectOptions = computed(() => {
    let options = unref(formFieldsOptions).map(o => ({ ...o, disabled: false }));
    if (state.columnData.treeDataSource === 'formField') options = options.filter(o => ['organizeSelect', 'depSelect'].includes(o.__config__.futureKey));
    return options;
  });
  const summaryFieldOptions = computed(() =>
    state.groupFieldOptions.filter(o => ['input', 'inputNumber', 'calculate'].includes(o.__config__.futureKey) && o.__vModel__ && !o.useMask),
  );
  const getSearchOptions = computed(() => {
    if (state.columnData.type == 2 && state.columnData.treeRelation) return state.searchOptions.filter(o => o.id !== state.columnData.treeRelation);
    if ([1, 4].includes(state.columnData.type) && state.columnData.tabConfig.relationField && state.columnData.tabConfig.on) {
      return state.searchOptions.filter(o => o.id !== state.columnData.tabConfig.relationField);
    }
    return state.searchOptions;
  });
  const getIsKeywordDisabled = computed(() => state.columnData.searchList.filter(o => o.isKeyword).length >= 3);

  // 供父组件使用 获取表单JSON
  function getData() {
    if (!state.columnData.columnList.length) {
      createMessage.warning('列表字段不允许为空');
      return;
    }
    if (state.columnData.type == 2) {
      if (state.columnData.treeDataSource === 'dictionary' && !state.columnData.treeDictionary) {
        createMessage.warning('请选择数据字典');
        return;
      }
      if (state.columnData.treeDataSource === 'api') {
        if (!state.columnData.treePropsValue) {
          createMessage.warning('请输入主键字段');
          return;
        }
        if (!state.columnData.treePropsLabel) {
          createMessage.warning('请输入显示字段');
          return;
        }
        if (!state.columnData.treePropsChildren) {
          createMessage.warning('请输入子级字段');
          return;
        }
      }
      if (!state.columnData.treeRelation) {
        createMessage.warning('请选择关联字段');
        return;
      }
      if (!state.columnData.treeSyncInterfaceId && state.columnData.treeSyncType == 1) {
        createMessage.warning('请选择异步数据接口');
        return;
      }
    }
    if (state.columnData.type == 3 && !state.columnData.groupField) {
      createMessage.warning('请选择分组字段');
      return;
    }
    if (state.columnData.type == 5 && !state.columnData.parentField) {
      createMessage.warning('请选择父级字段');
      return;
    }
    if (
      state.columnData.type !== 5 &&
      state.columnData.btnsList.some(o => o.value === 'upload' && o.show) &&
      !state.columnData.uploaderTemplateJson?.selectKey
    ) {
      createMessage.warning('请设置导入模板');
      return;
    }
    if (state.columnData.type !== 5 && state.columnData.btnsList.some(o => o.value === 'batchPrint' && o.show) && !state.columnData.printIds?.length) {
      createMessage.warning('请选择打印模板');
      return;
    }
    state.columnData.defaultColumnList = state.columnOptions.map(o => ({
      ...o,
      checked: state.columnData.columnList.some(i => i.prop === o.prop),
    }));
    return state.columnData;
  }
  function getDictionaryType() {
    getDictionaryTypeSelector().then(res => {
      dicOptions.value = res.data.list.filter(o => o.children && o.children.length);
    });
  }
  function getPrintTplList() {
    getPrintDevSelector().then(res => {
      state.printTplOptions = res.data.list.filter(o => o.children && o.children.length).map(o => ({ ...o, hasChildren: true }));
    });
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
      case 'batchPrint':
        text = '批量打印';
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
  function toggleType(val) {
    if (state.columnData.type == val) return;
    state.columnData.type = val;
    if (val == 2) updateSearchList(state.columnData.treeRelation);
    if (val == 3 || val == 5) state.columnData.childTableStyle = 1;
    if (val == 5) resetBtnsList();
  }
  function resetBtnsList() {
    for (let i = 0; i < state.columnData.btnsList.length; i++) {
      let item = state.columnData.btnsList[i];
      if (item.value != 'add') {
        item.show = false
        state.columnData.printIds =[]  
        state.columnData.uploaderTemplateJson ={}
      }
    }
  }
  function dataTypeChange(val) {
    state.columnData.treePropsValue = 'id';
    state.columnData.treePropsLabel = 'fullName';
    state.columnData.treePropsChildren = 'children';
    if (val === 'formField') state.columnData.treeRelation = '';
  }
  function onTreePropsUrlChange(val, row) {
    if (!val) {
      state.columnData.treePropsUrl = '';
      state.columnData.treePropsName = '';
      state.columnData.treeTemplateJson = [];
      initFieldData();
      return;
    }
    if (state.columnData.treePropsUrl === val) return;
    state.columnData.treePropsUrl = val;
    state.columnData.treePropsName = row.fullName;
    state.columnData.treeTemplateJson = row.parameterJson ? JSON.parse(row.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
    initFieldData();
  }
  function onTreeSyncInterfaceChange(val, row) {
    if (!val) {
      state.columnData.treeSyncInterfaceId = '';
      state.columnData.treeSyncInterfaceName = '';
      state.columnData.treeSyncTemplateJson = [];
      return;
    }
    if (state.columnData.treeSyncInterfaceId === val) return;
    state.columnData.treeSyncInterfaceId = val;
    state.columnData.treeSyncInterfaceName = row.fullName;
    state.columnData.treeSyncTemplateJson = row.templateJson ? row.templateJson.map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
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
      showType: 'pc',
      formFieldsOptions: unref(webType) == 4 ? state.columnOptions : unref(formFieldsOptions),
      dataForm: item.event,
    });
  }
  function updateBtnEvent(data) {
    state.columnData.customBtnsList[state.activeBtn].event = data;
  }
  function editRuleList() {
    if (!state.columnData.ruleList || !state.columnData.ruleList.matchLogic) state.columnData.ruleList = { matchLogic: 'and', conditionList: [] };
    openConditionModal(true, {
      ...state.columnData.ruleList,
      fieldOptions: unref(webType) == 4 ? state.columnOptions : unref(formFieldsOptions),
    });
  }
  function handleComplexHeader() {
    const columnOptions = state.columnData.columnList.filter(o => o.fixed === 'none' && o.id.indexOf('-') < 0);
    openComplexHeaderModal(true, { list: state.columnData.complexHeaderList, columnOptions });
  }
  function editDefaultSortConfig() {
    openDefaultSortConfigModal(true, {
      list: state.columnData.defaultSortConfig,
      columnOptions: state.groupFieldOptions.filter(o => o.id.indexOf('_future_') < 0),
    });
  }
  function onFixedChange() {
    updateComplexHeader();
  }
  function updateRuleList(data) {
    state.columnData.ruleList = data;
  }
  function updateComplexHeaderList(data) {
    state.columnData.complexHeaderList = data;
  }
  function updateDefaultSortConfig(data) {
    state.columnData.defaultSortConfig = data;
  }
  function updateComplexHeader() {
    if (!state.columnData?.complexHeaderList?.length) return;
    const columnOptions = state.columnData.columnList.filter(o => o.fixed === 'none' && o.id.indexOf('-') < 0);
    for (let i = 0; i < state.columnData.complexHeaderList.length; i++) {
      const e = state.columnData.complexHeaderList[i];
      e.childColumns = e.childColumns.filter(o => columnOptions.some(item => item.id == o));
    }
  }
  // 更新合计字段
  function updateSummaryField() {
    state.columnData.summaryField = state.columnData.summaryField.filter(o => unref(summaryFieldOptions).some(item => item.id == o));
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
  function editUpLoadTpl() {
    const data = { selectKey: [], dataType: '1', ...state.columnData.uploaderTemplateJson, fieldsOptions: unref(formFieldsOptions) };
    openUpLoadTplModal(true, data);
  }
  function updateUpLoadTpl(data) {
    state.columnData.uploaderTemplateJson = data;
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
            if (unref(webType) == 4) {
              defaultData[ii].label = data[i].label;
              defaultData[ii].labelI18nCode = data[i].labelI18nCode;
            }
          }
          if (type === 'search') {
            if (data[i].futureKey === defaultData[ii].futureKey) {
              defaultData[ii].searchType = data[i].searchType;
              defaultData[ii].searchMultiple = data[i].searchMultiple;
              defaultData[ii].value = data[i].value;
            }
            defaultData[ii].label = data[i].label;
            defaultData[ii].labelI18nCode = data[i].labelI18nCode;
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
    updateComplexHeader();
  }
  function setDefaultUpLoadData() {
    const selectKey = state.columnData.uploaderTemplateJson?.selectKey || [];
    const newList: any[] = [];
    for (let i = 0; i < selectKey.length; i++) {
      if (unref(formFieldsOptions).some(item => item.id == selectKey[i])) newList.push(selectKey[i]);
    }
    for (let i = 0; i < unref(formFieldsOptions).length; i++) {
      const e = unref(formFieldsOptions)[i];
      const required = e.__config__.required;
      const futureKey = e.__config__.futureKey;
      if (!noUploadList.includes(futureKey) && required && !newList.includes(e.id)) newList.push(e.id);
    }
    state.columnData.uploaderTemplateJson.selectKey = newList;
  }
  function initSort() {
    const searchTable: any = document.querySelector(`.search-table .ant-table-tbody`);
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
    const columnTable: any = document.querySelector(`.column-table .ant-table-tbody`);
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
    state.treeFieldOptions = list.filter(o => o.id.indexOf('-') < 0 && o.__config__.futureKey == 'treeSelect');
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
      if (state.columnData.btnsList.some(o => o.value === 'upload' && o.show)) setDefaultUpLoadData();
      updateTreeRelationInfo();
      state.columnData.searchList = setListValue(state.columnData.searchList, cloneDeep(state.searchOptions), 'search');
      state.columnData.columnList = setListValue(state.columnData.columnList, cloneDeep(state.columnOptions), 'column');
      initSort();
      setTimeout(() => {
        buildOptions(state.columnData.searchList);
        initFieldData();
      }, 300);
    });
    updateSummaryField();
  }
  function initFieldData() {
    if (!state.columnData.treePropsUrl) return (state.allOptions = []);
    getDataInterfaceInfo(state.columnData.treePropsUrl).then(res => {
      const data = res.data;
      let list = data.fieldJson ? JSON.parse(data.fieldJson) : [];
      state.allOptions = list.map(o => ({ ...o, value: o.defaultValue }));
    });
  }
  function onSearch(searchText: string) {
    state.options = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText) {
    onSearch(searchText);
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
  function updateTreeRelationInfo() {
    if (!state.columnData.treeRelation) return;
    for (let i = 0; i < unref(selectOptions).length; i++) {
      const e = unref(selectOptions)[i];
      if (e.id === state.columnData.treeRelation && e.__config__?.futureKey && ['organizeSelect', 'depSelect'].includes(e.__config__.futureKey)) {
        state.columnData.treeRelationFieldSelectType = e.selectType;
        state.columnData.treeRelationFieldAbleIds = e.ableIds;
        break;
      }
    }
  }
  function onRelationChange(val, data) {
    if (data.__config__?.futureKey && ['organizeSelect', 'depSelect'].includes(data.__config__.futureKey)) {
      state.columnData.treeRelationFieldSelectType = data.selectType;
      state.columnData.treeRelationFieldAbleIds = data.ableIds;
    }
    updateSearchList(val);
  }
  function updateSearchList(val) {
    if (!val) return;
    state.columnData.searchList = state.columnData.searchList.filter(o => o.id !== val);
    state.columnData.searchList = setListValue(state.columnData.searchList, cloneDeep(state.searchOptions), 'search');
  }

  onMounted(() => {
    getDictionaryType();
    getPrintTplList();
    if (typeof props.conf === 'object' && props.conf !== null) {
      state.columnData = cloneDeep(Object.assign({}, defaultColumnData, props.conf));
    }
    if (unref(webType) != 4) {
      // 树形表格过滤按钮
      state.defaultBtnsList = defaultBtnsList;
      state.defaultColumnBtnsList = defaultColumnBtnsList;
      init(unref(formFieldsOptions));
    } else {
      state.defaultBtnsList = defaultBtnsList.filter(o => o.value === 'download');
      state.defaultColumnBtnsList = [];
      init(unref(viewFieldOptions));
    }
  });
</script>
