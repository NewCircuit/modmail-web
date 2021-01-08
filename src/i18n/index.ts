import i18next, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './en/common.json';
import errors from './en/errors.json';
import layout from './en/layout.json';

export const resources: Resource = {
    en: {
        common,
        errors,
        layout,
    },
};

export function init() {
    return i18next.use(initReactI18next).init({
        lng: 'en',
        ns: ['common', 'errors', 'layout'],
        debug: true,
        resources,
        react: {
            // transKeepBasicHtmlNodesFor: ['b', 'br', 'u', 'span'],
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
