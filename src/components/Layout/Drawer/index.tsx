import React, { useEffect } from 'react';
import {
    Drawer,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

type Props = {
    open?: boolean;
    toggle?: () => void;
    className?: string;
    classes?: {
        [s: string]: string;
    };
    children?: React.ReactChild | React.ReactChild[];
};

const useStyles = makeStyles((theme) => ({
    drawer: {},
    heading: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    paper: {
        // width: 300,
    },
}));

export default function LayoutDrawer(props: Props) {
    const { open, toggle, className, classes } = props;
    const theme = useTheme();
    const defaultClasses = useStyles();
    const { t } = useTranslation('layout');
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const onClose = (evt: React.SyntheticEvent) => {
        if (toggle) toggle();
    };

    return (
        <Drawer
            open={open}
            classes={{
                paper: clsx(classes?.paper, defaultClasses.paper),
            }}
            className={clsx(className, defaultClasses.drawer)}
            variant={isDesktop ? 'persistent' : 'temporary'}
            onClose={!isDesktop ? onClose : undefined}
        >
            {!isDesktop && (
                <Toolbar
                    disableGutters
                    className={clsx(defaultClasses.heading, classes?.heading)}
                >
                    <IconButton onClick={onClose}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant={'h6'} noWrap>
                        {t('title')}
                    </Typography>
                </Toolbar>
            )}
            {props.children}
        </Drawer>
    );
}
