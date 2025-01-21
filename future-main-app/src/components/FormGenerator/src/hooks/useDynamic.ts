import { inject, computed, unref } from 'vue';
import { buildBitUUID } from '@/utils/uuid';
import { getDictionaryDataSelector } from '@/api/systemData/dictionary';
import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
import { noAllowRelationList, noAllowSelectList } from '@/components/FormGenerator/src/helper/config';
import { getParamList } from '@/utils/future';

export function useDynamic(activeData, initFieldData?) {
  const dataTypeOptions = [
    { id: 'static', fullName: '静态数据' },
    { id: 'dictionary', fullName: '数据字典' },
    { id: 'dynamic', fullName: '远端数据' },
  ];
  const valueOptions = [
    { id: 'id', fullName: 'id' },
    { id: 'enCode', fullName: 'enCode' },
  ];
  const sizeOptions = [
    { id: 'large', fullName: '较大' },
    { id: 'default', fullName: '中等' },
    { id: 'small', fullName: '较小' },
  ];
  const optionTypeOptions = [
    { id: 'default', fullName: '默认' },
    { id: 'button', fullName: '按钮' },
  ];
  const getShowType: (() => string | undefined) | undefined = inject('getShowType');
  const showType = computed(() => (getShowType as () => string | undefined)());
  const getDrawingList: (() => any[]) | undefined = inject('getDrawingList');
  const drawingList = computed(() => (getDrawingList as () => any[])());
  const defaultValue = computed(() => {
    if (activeData.__config__.futureKey === 'checkbox' || activeData.__config__.futureKey === 'cascader' || activeData.multiple) return [];
    return '';
  });
  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && isIncludesTable(data) && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && !noAllowRelationList.includes(data.__config__.futureKey) && data.__vModel__ !== activeData.__vModel__) {
        const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
        list.push({
          id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
          ...data,
          disabled: false,
        });
      }
    };
    loop(unref(drawingList));
    return list;
  });

  const formFieldsSelectOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && isIncludesTable(data) && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && !noAllowSelectList.includes(data.__config__.futureKey) && data.__vModel__ !== activeData.__vModel__) {
        const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
        list.push({
          id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
          ...data,
          disabled: false,
        });
      }
    };
    loop(unref(drawingList));
    return list;
  });

  const isIncludesTable = data => {
    if ((!data.__config__.layout || data.__config__.layout === 'rowFormItem') && data.__config__.futureKey !== 'table') return true;
    if (activeData.__config__.isSubTable) return activeData.__config__.parentVModel === data.__vModel__;
    return data.__config__.futureKey !== 'table';
  };

  const onDataTypeChange = () => {
    activeData.__config__.defaultValue = unref(defaultValue);
    activeData.options = [];
    activeData.props.value = 'id';
    activeData.props.label = 'fullName';
    if (Reflect.has(activeData.props, 'children')) activeData.props.children = 'children';
    activeData.__config__.dictionaryType = '';
    activeData.__config__.propsUrl = '';
    activeData.__config__.propsName = '';
    activeData.__config__.templateJson = [];
  };
  const onDictionaryTypeChange = val => {
    activeData.__config__.defaultValue = unref(defaultValue);
    if (!val) return (activeData.options = []);
    getDictionaryDataSelector(val)
      .then(res => {
        activeData.options = res.data.list;
      })
      .catch(() => {
        activeData.options = [];
      });
  };
  const onPropsUrlChange = (val, row) => {
    activeData.__config__.defaultValue = unref(defaultValue);
    if (!val) {
      activeData.__config__.propsUrl = '';
      activeData.__config__.propsName = '';
      activeData.__config__.templateJson = [];
      activeData.options = [];
      initFieldData && initFieldData();
      return;
    }
    if (activeData.__config__.propsUrl === val) return;
    const list = row.parameterJson ? JSON.parse(row.parameterJson) : [];
    activeData.__config__.propsUrl = val;
    activeData.__config__.propsName = row.fullName;
    activeData.__config__.templateJson = list.map(o => ({ ...o, relationField: '', sourceType: 1 }));
    const query = { paramList: getParamList(activeData.__config__.templateJson) };
    getDataInterfaceRes(val, query)
      .then(res => {
        activeData.options = Array.isArray(res.data) ? res.data : [];
        initFieldData && initFieldData();
      })
      .catch(() => {
        activeData.__config__.propsUrl = '';
        activeData.__config__.propsName = '';
        activeData.__config__.templateJson = [];
        activeData.options = [];
        initFieldData && initFieldData();
      });
  };
  const onRelationFieldChange = (val, row) => {
    if (!val) return (row.futureKey = '');
    let list = unref(formFieldsOptions).filter(o => o.id === val);
    if (!list.length) return (row.futureKey = '');
    let item = list[0];
    row.futureKey = item.__config__.futureKey;
  };
  const onMultipleChange = val => {
    activeData.__config__.defaultValue = val ? [] : '';
  };
  const addSelectItem = () => {
    const uuid = buildBitUUID();
    activeData.options.push({
      fullName: '选项' + uuid,
      id: uuid,
    });
  };
  const onBatchOperateConfirm = options => {
    activeData.options = options;
  };

  return {
    showType,
    onDataTypeChange,
    onDictionaryTypeChange,
    onPropsUrlChange,
    formFieldsOptions,
    formFieldsSelectOptions,
    onRelationFieldChange,
    sizeOptions,
    optionTypeOptions,
    dataTypeOptions,
    valueOptions,
    addSelectItem,
    onMultipleChange,
    onBatchOperateConfirm,
  };
}
