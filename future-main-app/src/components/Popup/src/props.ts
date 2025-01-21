import type { PropType } from 'vue';
import { propTypes } from '@/utils/propTypes';

import { useI18n } from '@/hooks/web/useI18n';
const { t } = useI18n();

export const headerProps = {
  title: { type: String, default: '' },
  helpMessage: [String, Array] as PropType<string | string[]>,
  showBackIcon: { type: Boolean, default: true },
  confirmLoading: { type: Boolean },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: { type: String, default: t('common.cancelText') },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: false },
  okButtonProps: Object as PropType<Recordable>,
  okText: { type: String, default: t('common.okText') },
  okType: { type: String, default: 'primary' },
  continueText: { type: String, default: t('common.continueText') },
  continueType: { type: String, default: 'default' },
  showContinueBtn: { type: Boolean, default: false },
  continueButtonProps: Object as PropType<Recordable>,
  continueLoading: { type: Boolean },
};
export const basicProps = {
  defaultFullscreen: { type: Boolean, default: false },
  loadingText: { type: String },
  open: { type: Boolean },
  loading: { type: Boolean },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  destroyOnClose: { type: Boolean },
  closable: { type: Boolean, default: true },
  closeIcon: propTypes.any,
  width: propTypes.oneOfType([propTypes.string, propTypes.number]),
  zIndex: Number,
  ...headerProps,
};
