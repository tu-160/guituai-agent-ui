export interface RegItem {
  pattern: string;
  message: string;
}
export interface MaskConfig {
  filler: string;
  maskType: number;
  prefixType: number;
  prefixLimit: number;
  prefixSpecifyChar: string;
  suffixType: number;
  suffixLimit: number;
  suffixSpecifyChar: string;
  ignoreChar: string;
  useUnrealMask: boolean;
  unrealMaskLength: number;
}
export interface SelectProps {
  label: string;
  value: string;
}
export interface TreeProps extends SelectProps {
  children: string;
}
export type DateFormatType =
  | 'yyyy'
  | 'yyyy-MM'
  | 'yyyy-MM-dd'
  | 'yyyy-MM-dd HH:mm'
  | 'yyyy-MM-dd HH:mm:ss'
  | 'YYYY'
  | 'YYYY-MM'
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD HH:mm:ss';
export type TimeFormatType = 'HH:mm' | 'HH:mm:ss';
export type SizeUnitType = 'KB' | 'MB' | 'GB';
export type AlignType = 'left' | 'center' | 'right';
