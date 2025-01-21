import { defineComponent, h, ref, unref, onMounted, getCurrentInstance } from 'vue';
import { cloneDeep, upperFirst } from 'lodash-es';
import { componentMap } from '@/components/Form/src/componentMap';
import type { ComponentType } from '@/components/Form/src/types/index';
import { getRealProps } from './transform';

export default defineComponent({
  props: {
    conf: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      default: () => {},
    },
    size: {
      type: String,
      default: 'default',
    },
    relations: Object,
  },
  setup(props, { emit, expose }) {
    const tableRef = ref<any>(null);

    expose({ tableRef });
    function buildVModel(dataObject, defaultValue) {
      dataObject.value = defaultValue;
      let obj = dataObject.on ?? {};
      obj['update:value'] = val => {
        emit('update:value', val);
      };
      dataObject.on = obj;
    }

    function emitEvents(confClone) {
      ['on', 'nativeOn'].forEach(attr => {
        const eventKeyList = Object.keys(confClone[attr] || {});
        eventKeyList.forEach(key => {
          if (typeof key === 'string') {
            confClone[attr][key] = (...arg) => emit(key, arg);
          }
        });
      });
    }

    function buildDataObject(confClone, dataObject, formData) {
      const futureKey = confClone.__config__.futureKey;
      Object.keys(confClone).forEach(key => {
        const val = confClone[key];
        if (key === '__vModel__') {
          buildVModel(dataObject, confClone.__config__.defaultValue);
        } else if (dataObject[key] !== undefined) {
          if (dataObject[key] === null || dataObject[key] instanceof RegExp || ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
            dataObject[key] = val;
          } else if (Array.isArray(dataObject[key])) {
            dataObject[key] = [...dataObject[key], ...val];
          } else {
            dataObject[key] = { ...dataObject[key], ...val };
          }
        } else {
          dataObject[key] = val;
        }
      });
      if (['calculate', 'table', 'barcode', 'qrcode', 'popupSelect', 'popupTableSelect', 'autoComplete'].includes(futureKey)) {
        dataObject['formData'] = formData;
      }
      if (['table'].includes(futureKey)) {
        dataObject['relations'] = props.relations;
        dataObject['vModel'] = confClone.__vModel__;
        dataObject['ref'] = 'tableRef';
      }
      if (['relationForm', 'popupSelect'].includes(futureKey)) {
        dataObject['field'] = confClone.__config__.tableName
          ? confClone.__vModel__ + '_futureTable_' + confClone.__config__.tableName + (confClone.__config__.isSubTable ? '0' : '1')
          : confClone.__vModel__;
      }
      // 清理属性
      clearAttrs(dataObject);
    }

    function clearAttrs(dataObject) {
      delete dataObject.__config__;
      delete dataObject.__slot__;
      delete dataObject.__methods__;
      delete dataObject.on;
    }
    onMounted(() => {
      const instance = getCurrentInstance();
      tableRef.value = unref(instance?.refs?.tableRef);
    });

    return () => {
      const dataObject = {};
      const confClone = cloneDeep(props.conf);
      // 将字符串类型的事件，发送为消息
      emitEvents(confClone);
      // 将json表单配置转化为vue render可以识别的数据对象(dataObject)
      buildDataObject(confClone, dataObject, props.formData);
      const futureKey = upperFirst(props.conf.__config__.futureKey) === 'Table' ? 'InputTable' : upperFirst(props.conf.__config__.futureKey);
      const Comp = componentMap.get(futureKey as ComponentType) as ReturnType<typeof defineComponent>;
      if (!Comp) return null;
      const realDataObject = getRealProps(dataObject, props.conf.__config__.futureKey);
      return h(Comp, realDataObject as any);
    };
  },
});
