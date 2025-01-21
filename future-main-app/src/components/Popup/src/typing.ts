import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes';
import type { VNodeChild, ComputedRef } from 'vue';
import type { ScrollContainerOptions } from '@/components/Container/index';

export interface PopupInstance {
  setPopupProps: (props: Partial<PopupProps> | boolean) => void;
  emitOpen?: (open: boolean, uid: number) => void;
}

export interface ReturnMethods extends PopupInstance {
  openPopup: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
  closePopup: () => void;
  getOpen?: ComputedRef<boolean>;
}

export type RegisterFn = (popupInstance: PopupInstance, uuid?: string) => void;

export interface ReturnInnerMethods extends PopupInstance {
  closePopup: () => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  changeContinueLoading: (loading: boolean) => void;
  getOpen?: ComputedRef<boolean>;
}

export type UsePopupReturnType = [RegisterFn, ReturnMethods];

export type UsePopupInnerReturnType = [RegisterFn, ReturnInnerMethods];

export interface PopupHeaderProps {
  /**
   * The title for Popup.
   * @type any (string | slot)
   */
  title?: VNodeChild | JSX.Element;
  helpMessage?: Array<any> | string;
  showBackIcon: boolean;
  showOkBtn: boolean;
  showContinueBtn: boolean;
  showCancelBtn: boolean;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  continueText?: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';

  continueType?: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { props: ButtonProps; on: {} };

  continueButtonProps: { props: ButtonProps; on: {} };

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { props: ButtonProps; on: {} };
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  continueLoading?: boolean;
}
export interface PopupProps extends PopupHeaderProps {
  defaultFullscreen?: boolean;
  loading?: boolean;
  open?: boolean;
  /**
   * Built-in ScrollContainer component configuration
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;
  closeFunc?: () => Promise<any>;
  triggerWindowResize?: boolean;
  /**
   * Whether a close (x) button is open on top right of the Popup dialog or not.
   * @default true
   * @type boolean
   */
  closable?: boolean;

  /**
   * Whether to unmount child components on closing popup or not.
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;

  /**
   * Return the mounted node for Popup.
   * @default 'body'
   * @type any ( HTMLElement| () => HTMLElement | string)
   */
  getContainer?: () => HTMLElement | string;

  class?: string;

  /**
   * Width of the Popup dialog.
   * @default 100%
   * @type string | number
   */
  width?: string | number;

  /**
   * The z-index of the Popup.
   * @default 1000
   * @type number
   */
  zIndex?: number;

  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  onClose?: (e?: Event) => void;
}
export interface PopupActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
