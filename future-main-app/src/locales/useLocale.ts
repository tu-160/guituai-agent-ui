/**
 * Multi-language related operations
 */
import type { LocaleType } from '#/config';

import { i18n } from './setupI18n';
import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { unref, computed } from 'vue';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { localeSetting } from '@/settings/localeSetting';

interface LangModule {
  message: Recordable;
  dateLocale: Recordable;
  dateLocaleName: string;
}

const { availableLocales } = localeSetting;

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut();

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  localeStore.setLocaleInfo({ locale });
  setHtmlPageLang(locale);
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  const getLocale = computed<LocaleType>(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);

  const getAntdLocale = computed((): any => {
    return (i18n.global.getLocaleMessage(unref(getLocale)) as any)?.antdLocale ?? {};
  });

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }
    if (!availableLocales.includes(locale)) locale = 'zh_CN';
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
    if (!langModule) return;

    const { message } = langModule;

    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);

    setI18nLanguage(locale);
    return locale;
  }
  async function initLocale(locale: LocaleType) {
    const res : any = null;
    if (!res || !res.data) return;
    const message = JSON.parse(res.data);
    if (!availableLocales.includes(locale)) locale = 'zh_CN';
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
    if (!langModule) return setLocale(locale, message);
    const { message: defaultMessage } = langModule;
    setLocale(locale, { ...defaultMessage, ...message });
  }
  function setLocale(locale: LocaleType, message) {
    const globalI18n = i18n.global;
    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);
    setI18nLanguage(locale);
  }

  return {
    getLocale,
    getShowLocalePicker,
    changeLocale,
    initLocale,
    getAntdLocale,
  };
}
