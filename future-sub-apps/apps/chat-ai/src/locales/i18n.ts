import { createI18n } from "vue-i18n";
import en from './lang/en';
import zh from './lang/zh';

interface MessageSchema {
    message: {
        hello: string;
        welcome: string;
    };
}

const messages = {
    en,
    zh,
} as const;

// 获取浏览器的默认语言
function getBrowserLocale() {
    // 使用 navigator.languages 如果存在，否则 fallback 到 navigator.language
    const nav = window.navigator;
    const browserLocale = nav.languages ? nav.languages[0] : nav.language;

    // 确保只取语言部分，例如 "en-US" -> "en"
    return browserLocale.split('-')[0].toLowerCase();
}

export const i18n = createI18n({
    locale: getBrowserLocale(), // 设置默认语言
    fallbackLocale: 'en', // 设置回退语言
    messages, // 加载消息
});


// 动态加载语言包
export async function loadLanguageAsync(lang: string) {
    let langMessages: any;
    switch (lang) {
        case 'en':
            langMessages = await import(/* webpackChunkName: "lang-en" */ './lang/en');
            break;
        case 'zh':
            langMessages = await import(/* webpackChunkName: "lang-zh" */ './lang/zh');
            break;
        default:
            langMessages = await import(/* webpackChunkName: "lang-en" */ './lang/en');
    }

    // 使用 setLocaleMessage 方法来设置新的语言消息
    i18n.global.setLocaleMessage(lang, langMessages.default);
}