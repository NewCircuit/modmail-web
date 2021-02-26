import { createMuiTheme, Theme as _Theme, ThemeOptions } from '@material-ui/core';

import { Palette } from '@material-ui/core/styles/createPalette';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

export interface CustomPalette extends Palette {
    background: {
        paper: string;
        default: string;
    };
    text: Palette['text'] & {
        link: string;
    };
    icon: string;
}

export interface DarkTheme extends _Theme {
    palette: CustomPalette;
    mode: 'dark';
}

export interface LightTheme extends _Theme {
    palette: CustomPalette;
    mode: 'light';
}

export type Theme = DarkTheme | LightTheme;

interface CustomThemeOptions extends ThemeOptions {
    mode: 'dark' | 'light';
}

const generateDarkTheme = () =>
    createMuiTheme({
        palette,
        typography,
        overrides,
        zIndex: {
            appBar: 1200,
            drawer: 1100,
        },
        mode: 'dark',
    } as CustomThemeOptions) as DarkTheme;

const generateLightTheme = () =>
    createMuiTheme({
        palette,
        typography,
        overrides,
        zIndex: {
            appBar: 1200,
            drawer: 1100,
        },
        mode: 'light',
    } as CustomThemeOptions) as LightTheme;

export const APPBAR_HEIGHT = 64;
export const FOOTER_HEIGHT = 40;
export const DRAWER_WIDTH = {
    mobile: 240,
    desktop: 300,
};

export const themes = {
    dark: generateDarkTheme,
    light: generateLightTheme,
};

export default generateDarkTheme();
