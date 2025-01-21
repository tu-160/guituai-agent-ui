import { i18n } from '@/locales/i18n';

export function getTimeState() {
  // 获取当前时间
  const timeNow = new Date();
  // 获取当前小时
  const hours = timeNow.getHours();
  // 设置默认文字
  let state = ``;
  // 判断当前时间段
  // 包含Unicode中的表情符号
  // if (hours >= 0 && hours <= 6) {
  //   state = `🌗 ` + i18n.global.t('chat_index.wonderfulStart');
  // } else if (hours > 6 && hours <= 10) {
  //   state = `🌞 ` + i18n.global.t('chat_index.goodMorning');
  // } else if (hours > 10 && hours <= 11) {
  //   state = `🌞 ` + i18n.global.t('chat_index.goodMorning');
  // } else if (hours > 11 && hours <= 13) {
  //   state = `☀️ ` + i18n.global.t('chat_index.goodafternoon');
  // } else if (hours > 13 && hours <= 18) {
  //   state = `🍮 ` + i18n.global.t('chat_index.goodafternoon');
  // } else if (hours > 18 && hours <= 24) {
  //   state = `🌙 ` + i18n.global.t('chat_index.goodEvening');
  // }
  if (hours >= 0 && hours <= 6) {
    state = i18n.global.t('chat_index.wonderfulStart');
  } else if (hours > 6 && hours <= 10) {
    state = i18n.global.t('chat_index.goodMorning');
  } else if (hours > 10 && hours <= 11) {
    state = i18n.global.t('chat_index.goodMorning');
  } else if (hours > 11 && hours <= 13) {
    state = i18n.global.t('chat_index.goodafternoon');
  } else if (hours > 13 && hours <= 18) {
    state = i18n.global.t('chat_index.goodafternoon');
  } else if (hours > 18 && hours <= 24) {
    state = i18n.global.t('chat_index.goodEvening');
  }
  return state;
}
