import type { VNode, HTMLAttributes, VNodeChild } from 'vue';
import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface';
import type { ColProps } from 'ant-design-vue/lib/grid/Col';

// [field, [startTimeKey, endTimeKey], format = '']
// [ 'timeRange', [ 'startTime', 'endTime' ], 'YYYY-MM-DD HH:mm:ss' ]
// [ 'timeRange', [ 'startTime', 'endTime' ], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'] ]
export type FieldMapToTime = [string, [string, string], (string | [string, string])?][];

export type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams {
  schema: FormSchema;
  values: Recordable;
  model: Recordable;
  field: string;
}

// 帮助提示组件属性数据定义
export interface HelpComponentProps {
  maxWidth: string;
  // Whether to display the serial number
  showIndex: boolean;
  // Text list
  text: any;
  // colour
  color: string;
  // font size
  fontSize: string;
  icon: string;
  absolute: boolean;
  // Positioning
  position: any;
}

// 字段描述元数据定义
export interface FormSchema {
  // 字段名称
  field: string;
  // Event name triggered by internal value change, default change
  changeEvent?: string;
  // Variable name bound to v-model Default value
  valueField?: string;
  className?: string | string[];
  // Label name
  label: string | VNode;
  extra?: string;
  // 权限编码控制是否显示
  auth?: string;
  // Auxiliary text
  subLabel?: string;
  // Help text on the right side of the text
  helpMessage?: string | string[] | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
  // BaseHelp component props (Partial 定义属性都可选填)
  helpComponentProps?: Partial<HelpComponentProps>;
  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: string | number;
  // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  // render component
  component: ComponentType;
  // Component parameters
  //componentProps?: ((opt: { schema: FormSchema; tableAction: TableActionType; formActionType: FormActionType; formModel: Recordable }) => Recordable) | object;
  // Required
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  suffix?: string | number | ((values: RenderCallbackParams) => string | number);

  // Validation rules
  rules?: Rule[];
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;

  // Reference formModelItem
  itemProps?: Partial<FormItem>;

  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;

  // 默认值
  defaultValue?: any;
  isAdvanced?: boolean;

  // Matching details components
  span?: number;

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  // Render the content in the form-item tag
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

  renderComponentContent?: ((renderCallbackParams: RenderCallbackParams) => any) | VNode | VNode[] | string;

  // Custom slot, in from-item
  slot?: string;

  // Custom slot, similar to renderColContent
  colSlot?: string;

  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
}

export type ComponentType =
  | 'InputGroup'
  | 'InputSearch'
  | 'InputCountDown'
  | 'AutoComplete'
  | 'MonthPicker'
  | 'WeekPicker'
  | 'StrengthMeter'
  | 'IconPicker'
  | 'Render'
  | 'Alert'
  | 'AreaSelect'
  | 'Button'
  | 'Cron'
  | 'Cascader'
  | 'ColorPicker'
  | 'Checkbox'
  | 'FutureCheckboxSingle'
  | 'DatePicker'
  | 'DateRange'
  | 'TimePicker'
  | 'TimeRange'
  | 'Divider'
  | 'Editor'
  | 'GroupTitle'
  | 'Input'
  | 'InputPassword'
  | 'Textarea'
  | 'InputNumber'
  | 'Link'
  | 'OrganizeSelect'
  | 'DepSelect'
  | 'PosSelect'
  | 'GroupSelect'
  | 'RoleSelect'
  | 'UserSelect'
  | 'UsersSelect'
  | 'Qrcode'
  | 'Barcode'
  | 'Radio'
  | 'Rate'
  | 'Select'
  | 'Slider'
  | 'Sign'
  | 'Signature'
  | 'Switch'
  | 'Text'
  | 'TreeSelect'
  | 'UploadFile'
  | 'UploadImg'
  | 'UploadImgSingle'
  | 'RelationForm'
  | 'RelationFormAttr'
  | 'PopupSelect'
  | 'PopupTableSelect'
  | 'PopupAttr'
  | 'NumberRange'
  | 'Calculate'
  | 'InputTable'
  | 'BillRule'
  | 'ModifyUser'
  | 'ModifyTime'
  | 'CreateUser'
  | 'CreateTime'
  | 'CurrOrganize'
  | 'CurrPosition'
  | 'Location'
  | 'Iframe';

type ColSpanType = number | string;
export interface ColEx {
  style?: any;
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}

export interface FormItem {
  /**
   * Used with label, whether to display : after label text.
   * @default true
   * @type boolean
   */
  colon?: boolean;

  /**
   * The extra prompt message. It is similar to help. Usage example: to display error message and prompt message at the same time.
   * @type any (string | slot)
   */
  extra?: string | VNodeChild | JSX.Element;

  /**
   * Used with validateStatus, this option specifies the validation status icon. Recommended to be used only with Input.
   * @default false
   * @type boolean
   */
  hasFeedback?: boolean;

  /**
   * The prompt message. If not provided, the prompt message will be generated by the validation rule.
   * @type any (string | slot)
   */
  help?: string | VNodeChild | JSX.Element;

  /**
   * Label test
   * @type any (string | slot)
   */
  label?: string | VNodeChild | JSX.Element;

  /**
   * The layout of label. You can set span offset to something like {span: 3, offset: 12} or sm: {span: 3, offset: 12} same as with <Col>
   * @type Col
   */
  labelCol?: ColProps & HTMLAttributes;

  /**
   * Whether provided or not, it will be generated by the validation rule.
   * @default false
   * @type boolean
   */
  required?: boolean;

  /**
   * The validation status. If not provided, it will be generated by validation rule. options: 'success' 'warning' 'error' 'validating'
   * @type string
   */
  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating';

  /**
   * The layout for input controls, same as labelCol
   * @type Col
   */
  wrapperCol?: ColProps;
  /**
   * Set sub label htmlFor.
   */
  htmlFor?: string;
  /**
   * text align of label
   */
  labelAlign?: 'left' | 'right';
  /**
   * a key of model. In the setting of validate and resetFields method, the attribute is required
   */
  name?: NamePath;
  /**
   * validation rules of form
   */
  rules?: object | object[];
  /**
   * Whether to automatically associate form fields. In most cases, you can setting automatic association.
   * If the conditions for automatic association are not met, you can manually associate them. See the notes below.
   */
  autoLink?: boolean;
  /**
   * Whether stop validate on first rule of error for this field.
   */
  validateFirst?: boolean;
  /**
   * When to validate the value of children node
   */
  validateTrigger?: string | string[] | false;
}
