import antdLocale from 'ant-design-vue/es/locale/zh_TW';
import zhTWCustomLocale from './zh_TW.json';

(antdLocale as any).Calendar.timePickerLocale.rangePlaceholder = ['開始時間', '結束時間'];

export default {
  message: {
    ...zhTWCustomLocale,
    antdLocale,
  },
};
