import React from 'react';
import { lighten, darken, Paper, PaperProps, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

type Props = PaperProps & {
    alertTitle?: React.ReactNode;
    alertDesc?: React.ReactNode;
};

const useStyle = makeStyles((theme) => ({
    root: {
        padding: '.75rem',
    },
    'alert-primary': {
        background: `linear-gradient(90deg, ${lighten(
            theme.palette.primary.dark,
            0.15
        )} 0%, ${lighten(theme.palette.primary.dark, 0.2)} 100%)`,
    },
    'alert-secondary': {
        background: `linear-gradient(90deg, ${lighten(
            theme.palette.secondary.dark,
            0.15
        )} 0%, ${lighten(theme.palette.secondary.dark, 0.2)} 100%)`,
    },
    'alert-error': {
        background: `linear-gradient(90deg, ${lighten(
            theme.palette.error.dark,
            0.0
        )} 0%, ${darken(theme.palette.error.dark, 0.1)} 100%)`,
    },
    'alert-default': {
        background: `linear-gradient(90deg, ${lighten(
            theme.palette.background.paper,
            0.15
        )} 0%, ${lighten(theme.palette.background.paper, 0.2)} 100%)`,
    },
}));

function Alert(props: Props) {
    const {
        alertTitle,
        alertDesc,
        children,
        className,
        color,
        elevation,
        ...otherProps
    } = props;
    const classes = useStyle();

    if (typeof children !== 'undefined') {
        return (
            <Paper
                className={clsx(classes.root, classes[`alert-${color}`], className)}
                {...otherProps}
            >
                {children}
            </Paper>
        );
    }

    return (
        <Paper
            elevation={elevation || 2}
            className={clsx(classes.root, classes[`alert-${color}`], className)}
            {...otherProps}
        >
            <Typography variant={'h3'}>{alertTitle}</Typography>
            <Typography variant={'subtitle1'}>{alertDesc}</Typography>
        </Paper>
    );
}

Alert.defaultProps = {
    color: 'default',
};

export type AlertProps = Props;
export default Alert;
