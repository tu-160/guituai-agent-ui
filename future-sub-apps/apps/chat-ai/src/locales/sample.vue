<template>
  <div>
    <!-- 更改语言的按钮 -->
    <button @click="changeLanguage('en')">English</button>
    <button @click="changeLanguage('zh')">中文</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loadLanguageAsync, i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const tt = i18n.global.t;

// t('chat_index.deleteAgentMessageTip', {'name': dialog.name})
// t('chat_index.deleteAgentMessageTip', '123456')
export default defineComponent({
  name: 'LanguageSwitcher',
  methods: {
    async changeLanguage(lang: string) {
      // 动态加载指定语言包
      await loadLanguageAsync(lang);
      // 更新应用当前语言
      this.$i18n.locale = lang;
    }
  }
});
</script>