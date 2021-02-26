import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Toolbar, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 'auto',
        padding: '0 .5rem',
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    refreshIcon: {
        backgroundColor: theme.palette.primary.dark,
        width: 50,
        height: 50,
        fontSize: '1.25rem',
        lineHeight: '1.25rem',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
}));

export default function DrawerFooter(): JSX.Element {
    const classes = useStyles();
    return (
        <Toolbar disableGutters className={classes.root}>
            <Tooltip title={'Time to refresh'}>
                <IconButton className={classes.refreshIcon}>999</IconButton>
            </Tooltip>
        </Toolbar>
    );
}
