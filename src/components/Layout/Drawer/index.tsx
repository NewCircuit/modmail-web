import React from 'react';
import {
    Drawer,
    IconButton,
    lighten,
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
        backgroundColor: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    paper: {
        // width: 300,
    },
    modal: {
        background: lighten(theme.palette.background.paper, 0.05),
    },
    anchorLeft: {
        boxShadow: `0px 0px 5px rgb(0 0 0 / 40%)`,
        borderRight: 'none', // `1px solid ${theme.palette.primary.main}`,
    },
}));

export default function LayoutDrawer(props: Props) {
    const { open, toggle, className, classes } = props;
    const theme = useTheme();
    const defaultClasses = useStyles();
    const { t } = useTranslation();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const onClose = () => {
        if (toggle) toggle();
    };

    return (
        <Drawer
            open={open}
            classes={{
                paper: clsx(classes?.paper, defaultClasses.paper, {
                    [defaultClasses.modal]: !isDesktop,
                }),
                paperAnchorDockedLeft: defaultClasses.anchorLeft,
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
                        {t('appName')}
                    </Typography>
                </Toolbar>
            )}
            {props.children}
        </Drawer>
    );
}
