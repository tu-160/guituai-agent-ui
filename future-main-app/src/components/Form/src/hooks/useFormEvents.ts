import type { ComputedRef, Ref } from 'vue';
import type { FormProps, FormSchema, FormActionType } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import { unref, toRaw, nextTick } from 'vue';
import { isArray, isFunction, isObject, isString, isDef, isNullOrUnDef, isEmpty } from '@/utils/is';
import { deepMerge } from '@/utils';
import { dateItemType, handleInputNumberValue, defaultValueComponents, noFieldComponents } from '../helper';
import { cloneDeep, uniqBy } from 'lodash-es';
import { error } from '@/utils/log';

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  defaultValueRef: Ref<Recordable>;
  fullValueRef: Ref<Recordable>;
  formElRef: Ref<FormActionType>;
  schemaRef: Ref<FormSchema[]>;
  handleFormValues: Fn;
  isInitedDefaultRef: Ref<boolean>;
}
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  fullValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
  isInitedDefaultRef,
}: UseFormActionContext) {
  async function resetFields(): Promise<void> {
    fullValueRef.value = {};
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    Object.keys(formModel).forEach(key => {
      const schema = unref(getSchema).find(item => item.field === key);
      const isInput = schema?.component && defaultValueComponents.includes(schema.component);
      const defaultValue = cloneDeep(defaultValueRef.value[key]);
      formModel[key] = isInput ? defaultValue || '' : defaultValue;
    });
    nextTick(() => clearValidate());

    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    fullValueRef.value = { ...fullValueRef.value, ...values };
    const fields = unref(getSchema)
      .map(item => item.field)
      .filter(Boolean);

    // key 支持 a.b.c 的嵌套写法
    const delimiter = '.';
    const nestKeyArray = fields.filter(item => item.indexOf(delimiter) >= 0);

    const validKeys: string[] = [];
    Object.keys(values).forEach(key => {
      const schema = unref(getSchema).find(item => item.field === key);
      let value = values[key];

      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        formModel[key] = value;
        validKeys.push(key);
      } else {
        nestKeyArray.forEach((nestKey: string) => {
          try {
            const value = nestKey.split('.').reduce((out, item) => out[item], values);
            if (isDef(value)) {
              formModel[nestKey] = value;
              validKeys.push(nestKey);
            }
          } catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              formModel[nestKey] = cloneDeep(defaultValueRef.value[nestKey]);
            }
          }
        });
      }
    });
    validateFields(validKeys).catch(_ => {});
  }
  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByField(fields: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields;
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      _removeSchemaByField(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByField(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const index = schemaList.findIndex(schema => schema.field === field);
      if (index !== -1) {
        delete formModel[field];
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(schema: FormSchema | FormSchema[], prefixField?: string, first = false) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    const addSchemaIds: string[] = Array.isArray(schema) ? schema.map(item => item.field) : [schema.field];
    if (schemaList.find(item => addSchemaIds.includes(item.field))) {
      error('There are schemas that have already been added');
      return;
    }
    const index = schemaList.findIndex(schema => schema.field === prefixField);
    const _schemaList = isObject(schema) ? [schema as FormSchema] : (schema as FormSchema[]);
    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(..._schemaList) : schemaList.push(..._schemaList);
      schemaRef.value = schemaList;
      _setDefaultValue(schema);
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, ..._schemaList);
    }
    _setDefaultValue(schema);

    schemaRef.value = schemaList;
  }

  async function resetSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(item => noFieldComponents.includes(item.component as string) || (Reflect.has(item, 'field') && item.field));

    if (!hasField) {
      error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    schemaRef.value = updateData as FormSchema[];
  }

  async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(item => noFieldComponents.includes(item.component as string) || (Reflect.has(item, 'field') && item.field));

    if (!hasField) {
      error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    const schema: FormSchema[] = [];
    unref(getSchema).forEach(val => {
      let _val;
      updateData.forEach(item => {
        if (val.field === item.field) {
          _val = item;
        }
      });
      if (_val !== undefined && val.field === _val.field) {
        const newSchema = deepMerge(val, _val);
        if (Reflect.has(_val, 'componentProps') && Reflect.has(_val.componentProps, 'options')) {
          newSchema.componentProps.options = _val.componentProps.options;
        }
        schema.push(newSchema as FormSchema);
      } else {
        schema.push(val);
      }
    });
    _setDefaultValue(schema);

    schemaRef.value = uniqBy(schema, 'field');
    isInitedDefaultRef.value = false;
  }

  function _setDefaultValue(data: FormSchema | FormSchema[]) {
    let schemas: FormSchema[] = [];
    if (isObject(data)) {
      schemas.push(data as FormSchema);
    }
    if (isArray(data)) {
      schemas = [...data];
    }

    const obj: Recordable = {};
    const currentFieldsValue = getFieldsValue();
    schemas.forEach(item => {
      if (
        !noFieldComponents.includes(item.component) &&
        Reflect.has(item, 'field') &&
        item.field &&
        !isNullOrUnDef(item.defaultValue) &&
        (!(item.field in currentFieldsValue) || isNullOrUnDef(currentFieldsValue[item.field]) || isEmpty(currentFieldsValue[item.field]))
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(obj);
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(unref(formModel)));
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some(item => {
      return item.field === key ? dateItemType.includes(item.component) : false;
    });
  }

  async function validateFields(nameList?: NamePath[] | undefined) {
    return unref(formElRef)?.validateFields(nameList);
  }

  async function validate(nameList?: NamePath[] | undefined) {
    try {
      const values = await unref(formElRef)?.validate(nameList);
      return { ...fullValueRef.value, ...values };
    } catch (error: any) {
      if (!error.errorFields.length) {
        return { ...fullValueRef.value, ...error.values };
      } else {
        return false;
      }
    }
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef)?.clearValidate(name);
  }

  async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
    await unref(formElRef)?.scrollToField(name, options);
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit('submit', res);
    } catch (error: any) {
      if (error?.outOfDate === false && error?.errorFields) {
        return;
      }
      throw new Error(error);
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
    setFieldsValue,
    scrollToField,
    itemIsDateType,
  };
}
