import type { CSSProperties, PropType, ExtractPublicPropTypes } from 'vue';
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { FieldMapToTime, FormSchema, ColEx } from './types';

/**
 * 表单配置项
 *
 */
export const basicProps = {
  // 表单对象
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 80,
  },
  // 时间范围映射转换
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  // 是否紧凑
  compact: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 表单配置规则
  schemas: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  // 合并动态数据
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  // 基础行样式
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  // 基础列属性
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
    default: () => ({ span: 24 }),
  },
  autoSetPlaceHolder: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  submitOnReset: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  submitOnChange: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  size: {
    type: String as PropType<'default' | 'small' | 'large'>,
    default: 'default',
  },
  // 禁用表单
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  emptySpan: {
    type: [Number, Object] as PropType<number | Recordable>,
    default: 0,
  },
  // 是否显示收起展开按钮
  showAdvancedButton: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 转化时间
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },
  //
  rulesMessageJoinLabel: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number as PropType<number>,
    default: 30,
  },
  // 不受折叠影响的行数
  alwaysShowLines: {
    type: Number as PropType<number>,
    default: 1,
  },

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 操作列Col配置
  actionColOptions: Object as PropType<Partial<ColEx>>,
  // 显示重置按钮
  showResetButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 重置按钮配置
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // 显示确认按钮
  showSubmitButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // 自定义重置函数
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,

  // 以下为默认props
  hideRequiredMark: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  labelCol: Object as PropType<Partial<ColEx>>,

  layout: {
    type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
    default: 'horizontal',
  },
  // tableAction: {
  //   type: Object as PropType<TableActionType>,
  // },
  wrapperCol: Object as PropType<Partial<ColEx>>,

  colon: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  labelAlign: {
    type: String as PropType<string>,
    default: '',
  },

  rowProps: Object as PropType<RowProps>,
} as const;

export type Props = ExtractPublicPropTypes<typeof basicProps>;
