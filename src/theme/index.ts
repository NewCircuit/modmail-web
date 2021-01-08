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

export interface Theme extends _Theme {
    palette: Palette;
}

export default theme;
