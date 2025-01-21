import type { PropType, CSSProperties } from 'vue';
import type { ModalWrapperProps } from './typing';
import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const modalProps = {
  open: { type: Boolean },
  scrollTop: { type: Boolean, default: true },
  height: { type: Number },
  minHeight: { type: Number },
  // open drag
  draggable: { type: Boolean, default: false },
  centered: { type: Boolean, default: true },
  cancelText: { type: String, default: t('common.cancelText') },
  okText: { type: String, default: t('common.okText') },
  continueText: { type: String, default: t('common.continueText') },

  closeFunc: Function as PropType<() => Promise<boolean>>,
};

export const basicProps = Object.assign({}, modalProps, {
  defaultFullscreen: { type: Boolean },
  // Can it be full screen
  canFullscreen: { type: Boolean, default: false },
  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: { type: Number, default: -160 },
  // Warm reminder message
  helpMessage: [String, Array] as PropType<string | string[]>,
  // Whether to setting wrapper
  useWrapper: { type: Boolean, default: true },
  loading: { type: Boolean },
  loadingTip: { type: String },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },

  showContinueBtn: { type: Boolean, default: false },

  wrapperProps: Object as PropType<Partial<ModalWrapperProps>>,

  afterClose: Function as PropType<() => Promise<VueNode>>,

  bodyStyle: Object as PropType<CSSProperties>,

  closable: { type: Boolean, default: true },

  closeIcon: Object as PropType<VueNode>,

  confirmLoading: { type: Boolean },

  continueLoading: { type: Boolean },

  destroyOnClose: { type: Boolean },

  footer: Object as PropType<VueNode>,

  getContainer: Function as PropType<() => any>,

  mask: { type: Boolean, default: true },

  maskClosable: { type: Boolean, default: false },

  keyboard: { type: Boolean, default: false },

  maskStyle: Object as PropType<CSSProperties>,

  okType: { type: String, default: 'primary' },

  continueType: { type: String, default: 'default' },

  okButtonProps: Object as PropType<ButtonProps>,

  cancelButtonProps: Object as PropType<ButtonProps>,

  continueButtonProps: Object as PropType<ButtonProps>,

  title: { type: String },

  open: { type: Boolean },

  width: {
    type: [String, Number] as PropType<string | number>,
    default: 600,
  },

  wrapClassName: { type: String },

  zIndex: { type: Number },
});
