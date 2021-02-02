import { createMuiTheme, Theme as _Theme } from '@material-ui/core';

import { Palette } from '@material-ui/core/styles/createPalette';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme: Theme = createMuiTheme({
    palette,
    typography,
    overrides,
    zIndex: {
        appBar: 1200,
        drawer: 1100,
    },
});

export const APPBAR_HEIGHT = 64;
export const DRAWER_WIDTH = {
    mobile: 240,
    desktop: 300,
};

export interface Theme extends _Theme {
    palette: Palette;
}

export default theme;
