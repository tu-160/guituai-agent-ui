import { ref, unref } from 'vue';

export interface MaskOptions {
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

/**
 * maskType
 * 1 - 全掩盖
 * 2 - 姓名-显示前1个字，后1个字
 * 3 - 手机号-显示前3位，后4位
 * 4 - 邮箱-显示前3个字，@和之后的字
 * 5 - 身份证-显示前6位，后3位，虚拟为4位
 * 6 - IP地址-显示第1段IP
 * 7 - 车牌号-显示前1个字，后2位
 * 8 - 银行卡号-显示前6位，后4位
 * 0 - 自定义规则
 */
export const defaultMaskOptions: MaskOptions = {
  filler: '*', // 填充符号
  maskType: 1, // 掩码规则
  prefixType: 1, // 开头显示
  prefixLimit: 0, // 开头字数
  prefixSpecifyChar: '', // 开头字符
  suffixType: 1, // 结尾显示
  suffixLimit: 0, // 结尾字数
  suffixSpecifyChar: '', // 结尾字符
  ignoreChar: '', // 显示字符
  useUnrealMask: false, // 虚拟掩码
  unrealMaskLength: 1, // 虚拟掩码长度
};

export function useTextMask(options?: Nullable<Partial<MaskOptions>>) {
  const config = ref({ ...defaultMaskOptions, ...(options || {}) });

  // 全掩盖
  function maskAll(str: string): string {
    return unref(config).filler.repeat(str.length);
  }
  //姓名 显示前1个字，后1个字
  function maskName(str: string): string {
    if (str.length <= 1) return str;
    const prefix = str[0];
    if (str.length === 2) return prefix + unref(config).filler;
    const suffix = str.slice(-1);
    const maskedChars = unref(config).filler.repeat(str.length - 2);
    return prefix + maskedChars + suffix;
  }
  // 手机号 - 显示前3位，后4位
  function maskPhoneNumber(str: string): string {
    if (str.length <= 7) return str;
    const prefix = str.slice(0, 3);
    const suffix = str.slice(-4);
    const maskedChars = unref(config).filler.repeat(str.length - 7);
    return prefix + maskedChars + suffix;
  }
  // 邮箱 - 显示前3个字，@和之后的字
  function maskEmailAddress(str: string): string {
    const atIndex = str.indexOf('@');
    if (str.length <= 3 || (atIndex > -1 && atIndex < 3)) return str;
    let suffixLength = 0;
    let maskedCharsLength = str.length - 3;
    if (atIndex > 0) {
      suffixLength = atIndex;
      maskedCharsLength = atIndex - 3;
    }
    const prefix = str.slice(0, 3);
    const suffix = suffixLength ? str.slice(suffixLength) : '';
    const maskedChars = unref(config).filler.repeat(maskedCharsLength);
    return prefix + maskedChars + suffix;
  }
  // 身份证 - 显示前6位，后3位，虚拟为4位
  function maskIdNumber(str: string): string {
    if (str.length <= 9) return str;
    const prefix = str.slice(0, 6);
    const suffix = str.slice(-3);
    const maskedChars = unref(config).filler.repeat(4);
    return prefix + maskedChars + suffix;
  }
  // IP地址-显示第1段IP
  function maskIPAddress(str: string): string {
    const segments = str.split('.');
    if (segments.length < 1) return str;
    const maskedChars = ('.' + unref(config).filler.repeat(3)).repeat(3);
    return segments[0] + maskedChars;
  }
  // 车牌号-显示前1个字，后2位
  function maskLicensePlate(str: string): string {
    if (str.length <= 3) return str;
    const prefix = str[0];
    const suffix = str.slice(-2);
    const maskedChars = unref(config).filler.repeat(str.length - 3);
    return prefix + maskedChars + suffix;
  }
  // 银行卡号-显示前6位，后4位
  function maskBankCard(str: string): string {
    if (str.length <= 10) return str;
    const prefix = str.slice(0, 6);
    const suffix = str.slice(-4);
    const maskedChars = unref(config).filler.repeat(str.length - 10);
    return prefix + maskedChars + suffix;
  }
  // 自定义掩码规则
  function maskCustom(str: string): string {
    let prefixLength = 0,
      suffixLength = 0;
    if (unref(config).prefixType === 2) prefixLength = unref(config).prefixLimit || 0;
    if ((unref(config).prefixType === 3 || unref(config).prefixType === 4) && unref(config).prefixSpecifyChar) {
      let specifyCharIndex = str.indexOf(unref(config).prefixSpecifyChar);
      if (specifyCharIndex > -1) prefixLength = unref(config).prefixType === 3 ? specifyCharIndex : specifyCharIndex + unref(config).prefixSpecifyChar.length;
    }
    if (unref(config).suffixType === 2) suffixLength = unref(config).suffixLimit || 0;
    if ((unref(config).suffixType === 3 || unref(config).suffixType === 4) && unref(config).suffixSpecifyChar) {
      let specifyCharIndex = str.indexOf(unref(config).suffixSpecifyChar);
      if (specifyCharIndex > -1)
        suffixLength = unref(config).suffixType === 3 ? str.length - specifyCharIndex - unref(config).suffixSpecifyChar.length : str.length - specifyCharIndex;
    }
    if (prefixLength + suffixLength >= str.length) return str;
    const prefix = prefixLength ? str.slice(0, prefixLength) : '';
    const suffix = suffixLength ? str.slice(-suffixLength) : '';
    let middleChar = '';
    if (!unref(config).ignoreChar) {
      const maskedLength = unref(config).useUnrealMask ? unref(config).unrealMaskLength || 1 : str.length - prefixLength - suffixLength;
      middleChar = unref(config).filler.repeat(maskedLength);
    } else {
      const ignoreCharList = unref(config).ignoreChar.split(',');
      const middleStr = str.slice(prefixLength, str.length - suffixLength);
      const reg = new RegExp('(' + ignoreCharList.map(o => o.replace(/\*/g, '\\*')).join('|') + ')', 'g');
      let list = middleStr.split(reg);
      list = list.map(o => {
        if (o && !ignoreCharList.includes(o)) {
          const maskedLength = unref(config).useUnrealMask ? unref(config).unrealMaskLength || 1 : o.length;
          o = unref(config).filler.repeat(maskedLength);
        }
        return o;
      });
      middleChar = list.join('');
    }

    return prefix + middleChar + suffix;
  }

  // 获取掩码后文本
  function getMaskedText(str: string): string {
    if (!str) return '';
    if (unref(config).maskType === 1) return maskAll(str);
    if (unref(config).maskType === 2) return maskName(str);
    if (unref(config).maskType === 3) return maskPhoneNumber(str);
    if (unref(config).maskType === 4) return maskEmailAddress(str);
    if (unref(config).maskType === 5) return maskIdNumber(str);
    if (unref(config).maskType === 6) return maskIPAddress(str);
    if (unref(config).maskType === 7) return maskLicensePlate(str);
    if (unref(config).maskType === 8) return maskBankCard(str);
    if (unref(config).maskType === 0) return maskCustom(str);
    return str;
  }

  return { maskAll, maskName, maskPhoneNumber, maskEmailAddress, maskIdNumber, maskIPAddress, maskLicensePlate, maskBankCard, maskCustom, getMaskedText };
}
