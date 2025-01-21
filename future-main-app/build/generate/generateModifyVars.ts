import { primaryColor } from '../config/themeConfig';
import { resolve } from 'path';
import { generate } from '@ant-design/colors';
import { theme } from 'ant-design-vue/lib';
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';
const { defaultAlgorithm, defaultSeed } = theme;

function generateAntColors(color: string, theme: 'default' | 'dark' = 'default') {
  return generate(color, {
    theme,
  });
}

/**
 * less global variable
 */
export function generateModifyVars() {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  const mapToken = defaultAlgorithm(defaultSeed);
  const v3Token = convertLegacyToken(mapToken);
  return {
    ...v3Token,
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'btn-info-color': '#909399',
    'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
    'border-color-base1': '#f0f0f0',
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-base-background': '#eaecf0',
    'app-content-background': '#F1F4F8', //   Link color
    'app-main-background': '#ebeef5',
    'selected-hover-bg': '#f5f5f5',
    'hover-background': '#f5f7fa',
  };
}
