import { watch, ref, unref, computed } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useGlobSetting } from '@/hooks/setting';
import { useRouter } from 'vue-router';
import { useLocaleStore } from '@/store/modules/locale';
import { useAppStore } from '@/store/modules/app';
import { REDIRECT_NAME } from '@/router/constant';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { title } = useGlobSetting();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();
  const appStore = useAppStore();
  const pageTitle = usePageTitle();
  const customPageTitle = ref(appStore.getSysConfigInfo.title);

  const getTitle = computed(() =>
    localeStore.getLocale === 'en' ? 'FUTURE' : localeStore.getLocale === 'zh_TW' ? 'FUTURE軟件開發平臺' : customPageTitle.value || title,
  );

  watch(
    () => appStore.getSysConfigInfo,
    (val, oldVal) => {
      if (oldVal?.title === val.title) return;
    },
  );
  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute);

      if (route.name === REDIRECT_NAME) {
        return;
      }

      const tTitle = t(route?.meta?.title as string, route?.meta?.defaultTitle as string);
      pageTitle.value = tTitle ? ` ${tTitle} - ${unref(getTitle)} ` : `${unref(getTitle)}`;
    },
    { immediate: true },
  );
}
