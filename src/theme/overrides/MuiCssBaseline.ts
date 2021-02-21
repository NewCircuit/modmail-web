import { lighten } from '@material-ui/core';
import palette from '../palette';

const direction = 360;
const primary = palette.background.default;
const secondary = lighten(primary, 0.1);
const gradient = `linear-gradient(${direction}deg, ${primary} 0%, ${secondary} 100%)`;

const styles = {
    '@global': {
        body: {
            background: gradient,
            backgroundColor: 'unset',
        },
        '#root': {
            overflow: 'hidden',
        },
        '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(-360deg)' },
        },
    },
};

export default styles;
