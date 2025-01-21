import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        message: {
            hello: 'Hello {name}!'
        },
        rawMessage: {
            placeholder: 'This is a raw placeholder: {}'
        }
    },
    zh: {
        message: {
            hello: '你好 {name}！'
        },
        rawMessage: {
            placeholder: '这是原始占位符: {}'
        }
    }
};

const i18n = createI18n({
    locale: 'en', // 设置默认语言环境
    messages,
    missing: (locale, key) => {
        return key;
    },
    silentTranslationWarn: true,
    warnHtmlInMessage: 'off',
    messageResolver: function(key, options) {
        const value = this.messages[this.locale][key];
        if (!value) return key;

        // 检查是否需要保留原始占位符
        if (key.includes('rawMessage')) {
            return value.replace(/\{([^}]+)\}/g, '\\{$1\\}');
        }

        return value;
    }
});

const app = createApp({
    template: `
    <div>
      <p>{{ $t('message.hello', { name: 'World' }) }}</p>
      <p v-html="$t('rawMessage.placeholder')"></p>
      <select v-model="currentLocale">
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  `,
    data() {
        return {
            currentLocale: 'en'
        };
    },
    watch: {
        currentLocale(newVal) {
            this.$i18n.locale = newVal;
        }
    }
});

app.use(i18n);
app.mount('#app');



