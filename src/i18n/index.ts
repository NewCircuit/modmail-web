import i18next from 'i18next';
import i18nBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export function init() {
    return i18next
        .use(initReactI18next)
        .use(i18nBackend)
        .init({
            fallbackNS: false,
            fallbackLng: false,
            lng: 'en',
            backend: {
                loadPath: '/i18n/{{lng}}/{{ns}}.json',
                queryStringParams: {
                    v: process.env.REACT_APP_VERSION,
                },
            },
            react: {
                transKeepBasicHtmlNodesFor: ['b', 'br', 'u', 'span'], // TODO add these as needed
            },
            interpolation: {
                format(value, format) {
                    if (format === 'firstUpper') {
                        return value.charAt(0).toUpperCase() + value.substr(1);
                    }
                    return value;
                },
            },
        });
}
