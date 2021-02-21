import { colors, darken } from '@material-ui/core';
import { CustomPalette } from './index';

const darkBackground = darken('#191919', 0.3);
const pdpRedLight = '#e93030';
const pdpRedMain = '#bc0707';
const pdpRedDark = '#750202';

const secondaryLight = '#7289da';
const secondaryMain = '#3358d7';
const secondaryDark = '#162a6e';

const palette: CustomPalette = {
    primary: {
        contrastText: colors.common.white,
        dark: pdpRedDark,
        main: pdpRedMain,
        light: pdpRedLight,
    },
    secondary: {
        contrastText: colors.common.white,
        light: secondaryLight,
        main: secondaryMain,
        dark: secondaryDark,
    },
    success: {
        contrastText: colors.common.white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[400],
    },
    info: {
        contrastText: colors.common.white,
        dark: colors.blue[900],
        main: colors.blue[600],
        light: colors.blue[400],
    },
    warning: {
        contrastText: colors.common.white,
        dark: colors.orange[900],
        main: colors.orange[600],
        light: colors.orange[400],
    },
    error: {
        contrastText: colors.common.white,
        dark: colors.red[900],
        main: colors.red[600],
        light: colors.red[400],
    },
    text: {
        primary: colors.grey[300],
        secondary: colors.grey[600],
        link: colors.blue[600],
    },
    background: {
        default: darkBackground,
        paper: darken(darkBackground, 0.1),
    },
    icon: colors.blueGrey[600],
    divider: colors.grey[800],
} as never;

export default palette;
