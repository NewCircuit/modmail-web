import { colors, darken } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';
const darkBackground = darken('#191919', 0.3);
const pdpRedMain = '#bc0707';
const pdpRedDark = '#400000';

export default {
    black,
    white,
    primary: {
        contrastText: white,
        dark: pdpRedDark,
        main: pdpRedMain,
        light: pdpRedMain,
    },
    secondary: {
        contrastText: white,
        dark: colors.blue[900],
        main: colors.blue.A400,
        light: colors.blue.A400,
    },
    success: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[400],
    },
    info: {
        contrastText: white,
        dark: colors.blue[900],
        main: colors.blue[600],
        light: colors.blue[400],
    },
    warning: {
        contrastText: white,
        dark: colors.orange[900],
        main: colors.orange[600],
        light: colors.orange[400],
    },
    error: {
        contrastText: white,
        dark: colors.red[900],
        main: colors.red[600],
        light: colors.red[400],
    },
    text: {
        primary: white, // colors.blueGrey[900],
        secondary: colors.blueGrey[600],
        link: colors.blue[600],
    },
    background: {
        default: darkBackground, // '#F4F6F8',
        paper: darken(darkBackground, 0.1),
    },
    icon: colors.blueGrey[600],
    divider: colors.grey[800],
};
