import { cloneDeep, upperFirst, lowerFirst } from 'lodash-es';
import { useInputList, useDateList, useSelectList } from '@/components/FormGenerator/src/helper/config';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const getRealProps = (data, futureKey) => {
  if (Reflect.has(data, 'clearable')) {
    data.allowClear = data.clearable;
    delete data.clearable;
  }
  if (Reflect.has(data, 'filterable')) {
    data.showSearch = data.filterable;
    delete data.filterable;
  }
  if (Reflect.has(data, 'props')) {
    data.fieldNames = data.props;
    delete data.props;
  }
  if (futureKey === 'switch') {
    data.checkedValue = data.activeValue;
    data.unCheckedValue = data.inactiveValue;
    delete data.activeValue;
    delete data.inactiveValue;
  }
  if (futureKey === 'card') {
    data.title = data.header;
    delete data.title;
    data.hoverable = data.shadow === 'hover';
    delete data.shadow;
  }
  return data;
};
export const getFormSchemaItem = data => {
  const item = getRealProps(data, data.__config__.futureKey);
  const componentProps = cloneDeep(item);
  // delete componentProps.__config__;
  delete componentProps.on;
  delete componentProps.__vModel__;
  // if (Reflect.has(item.__config__, 'children')) {
  //   componentProps.children = item.__config__.children;
  // }

  let rules: any[] = [];
  const regList = item.__config__.regList;
  if (regList) {
    for (let i = 0; i < regList.length; i++) {
      rules.push({
        pattern: eval(regList[i].pattern),
        message: regList[i].messageI18nCode ? t(regList[i].messageI18nCode, regList[i].message) : regList[i].message,
        trigger: item.__config__.trigger,
      });
    }
  }

  const schema = {
    field: item.prop,
    label: item.labelI18nCode ? t(item.labelI18nCode, item.label) : item.label,
    defaultValue: item.__config__.defaultValue,
    component: upperFirst(item.__config__.futureKey),
    componentProps,
    labelWidth: item.__config__.labelWidth || null,
    required: item.__config__.required || false,
    colProps: { span: item.__config__.span || 24 },
    className: item.__config__.className,
    value: item.value,
    rules,
    __config__: item.__config__,
  };
  return schema;
};
export const getFormSchemas = (list: any[]) => {
  const schemas: any[] = [];
  const list1: any[] = [];
  const loop = list => {
    for (let i = 0; i < list.length; i++) {
      const schema = getFormSchemaItem(list[i]);
      list1.push({ ...list[i], schema });
      schemas.push(schema);
    }
  };
  loop(list);
  return schemas;
};
export const getFormConfig = formConf => {
  return {
    labelWidth: formConf.labelWidth,
    schemas: getFormSchemas(formConf.fields),
    layout: formConf.labelPosition === 'top' ? 'vertical' : 'horizontal',
    labelAlign: formConf.labelPosition === 'right' ? 'right' : 'left',
    disabled: formConf.disabled,
  };
};
export const getSearchFormSchemas = (list: any[]) => {
  const schemas: any[] = getFormSchemas(list);
  for (let i = 0; i < schemas.length; i++) {
    const e = schemas[i];
    let delList = ['className', 'colProps', 'labelWidth', 'required', 'rules', 'defaultValue'];
    for (let i = 0; i < delList.length; i++) {
      delete e[delList[i]];
    }
    if (useInputList.includes(lowerFirst(e.component))) {
      e.component = 'Input';
      e.componentProps = { placeholder: t('common.inputTextPrefix') + e.label, allowClear: true };
    }
    if (useDateList.includes(lowerFirst(e.component))) {
      e.component = 'DateRange';
      e.componentProps = { format: 'YYYY-MM-DD HH:mm:ss' };
    }
    if (e.component === 'Switch') {
      e.componentProps = {
        checkedValue: e.componentProps.checkedValue,
        unCheckedValue: e.componentProps.unCheckedValue,
      };
    }
    if (useSelectList.includes(lowerFirst(e.component))) {
      e.component = 'Select';
      e.componentProps = {
        options: e.componentProps.options,
        showSearch: true,
        multiple: e.componentProps.searchMultiple || false,
        fieldNames: e.componentProps.fieldNames,
        placeholder: t('common.chooseTextPrefix') + e.label,
      };
    }
    if (['InputNumber', 'Calculate', 'Rate', 'Slider'].includes(e.component)) {
      let precision = e.componentProps.precision;
      if ((!e.componentProps.precision && e.component === 'Calculate') || e.component === 'Slider') precision = 0;
      if (e.component === 'Rate') precision = e.componentProps.allowHalf ? 1 : 0;
      if (!e.__config__.isFromParam) e.component = 'NumberRange';
      e.componentProps = { precision };
    }
    if (e.component === 'Cascader') {
      e.componentProps = {
        options: e.componentProps.options,
        showSearch: true,
        multiple: e.componentProps.searchMultiple || false,
        fieldNames: e.componentProps.fieldNames,
        showAllLevels: e.componentProps.showAllLevels,
        placeholder: t('common.chooseTextPrefix') + e.label,
      };
    }
    if (e.component === 'TimePicker') {
      e.component = 'TimeRange';
      e.componentProps = { format: e.componentProps.format };
    }
    if (e.component === 'DatePicker') {
      if (!e.__config__.isFromParam) e.component = 'DateRange';
      e.componentProps = { format: e.componentProps.format || 'yyyy-MM-dd HH:mm:ss' };
    }
    if (e.component === 'AreaSelect') {
      e.componentProps = { placeholder: t('common.chooseTextPrefix') + e.label, level: e.componentProps.level };
    }
    if (e.component === 'TreeSelect') {
      e.componentProps = {
        options: e.componentProps.options,
        showSearch: true,
        multiple: e.componentProps.searchMultiple || false,
        fieldNames: e.componentProps.fieldNames,
        placeholder: t('common.chooseTextPrefix') + e.label,
      };
    }
    if (['CreateUser', 'ModifyUser'].includes(e.component)) {
      e.component = 'UserSelect';
      e.componentProps = { placeholder: t('common.chooseTextPrefix') + e.label };
    }
    if (e.component === 'CurrOrganize') {
      e.component = 'OrganizeSelect';
      e.componentProps = { multiple: e.componentProps.searchMultiple || false, placeholder: t('common.chooseTextPrefix') + e.label };
    }
    if (e.component === 'CurrPosition') {
      e.component = 'PosSelect';
      e.componentProps = { multiple: e.componentProps.searchMultiple || false, placeholder: t('common.chooseTextPrefix') + e.label };
    }
    if (['OrganizeSelect', 'DepSelect', 'PosSelect', 'RoleSelect', 'GroupSelect', 'UsersSelect'].includes(e.component)) {
      e.componentProps = {
        selectType: e.componentProps.selectType,
        ableIds: e.componentProps.ableIds,
        multiple: e.componentProps.searchMultiple || false,
        placeholder: t('common.chooseTextPrefix') + e.label,
      };
    }
    if (e.component === 'UserSelect') {
      e.componentProps = {
        selectType: e.componentProps.selectType != 'all' && e.componentProps.selectType != 'custom' ? 'all' : e.componentProps.selectType,
        ableIds: e.componentProps.ableIds,
        multiple: e.componentProps.searchMultiple || false,
        placeholder: t('common.chooseTextPrefix') + e.label,
      };
    }
    if (e.component === 'AutoComplete') {
      e.componentProps = {
        total: e.componentProps.total,
        interfaceId: e.componentProps.interfaceId,
        relationField: e.componentProps.relationField,
        templateJson: e.componentProps.templateJson,
        placeholder: t('common.inputTextPrefix') + e.label,
      };
    }
  }
  if (list.some(o => o.isKeyword)) {
    const keywordItem = {
      field: 'futureKeyword',
      label: t('common.keyword'),
      component: 'Input',
      componentProps: { placeholder: t('common.leftTreeSearchText'), allowClear: true },
      value: undefined,
      __config__: { futureKey: 'input' },
    };
    schemas.unshift(keywordItem);
  }
  return schemas;
};
