import React, { RefObject, useEffect, useState } from 'react';
import {
    AppBar,
    Button,
    IconButton,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
    withStyles,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Route, Switch } from 'react-router-dom';
import Drawer from './Drawer';
import CommonDrawerItems from './CommonDrawerItems';
import { UserState } from '../../state';

type Props = {
    ref?: RefObject<Layout>;
    i18n: TFunction;
    classes: { [s: string]: string };
    theme: any;
    isDesktop: boolean;
    user: FG.State.UserState;
    children: React.ReactNode;
};

type State = {
    drawerOpen: boolean;
};

const toolbarHeight = 64;
const drawerWidth = 240;
const drawerWidthDesktop = 300;

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '2em',
        color: theme.palette.primary.contrastText,
        marginLeft: '.5rem',
    },
    toolbar: {
        height: toolbarHeight,
    },
    icon: {
        fontSize: '2em',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    heading: {
        height: toolbarHeight,
    },
    drawer: {
        // paddingTop: toolbarHeight,
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            marginTop: toolbarHeight,
            paddingTop: 0,
            width: drawerWidthDesktop,
        },
    },
    container: {
        transition: 'ease margin-left .5s',
        marginLeft: 0,
        marginTop: toolbarHeight,
        height: `calc(100vh - ${toolbarHeight}px)`,
    },
    open: {
        marginLeft: drawerWidthDesktop,
    },
}));

export class Layout extends React.Component<Props, State> {
    static ready = false;

    state = {
        drawerOpen: false,
    };

    componentWillUnmount() {
        if (!Layout.ready) Layout.ready = true;
    }

    componentDidMount() {
        if (Layout.ready) {
            const { isDesktop } = this.props;
            this.setState({
                drawerOpen: isDesktop
                    ? sessionStorage.getItem('drawerOpen') === '1'
                    : false,
            });
        }
    }

    onHandleMenuClick = () => {
        const { isDesktop } = this.props;
        const { drawerOpen } = this.state;
        if (isDesktop) sessionStorage.setItem('drawerOpen', drawerOpen ? '0' : '1');
        this.setState({ drawerOpen: !drawerOpen });
    };

    render() {
        const { onHandleMenuClick } = this;
        const { classes, isDesktop, children, i18n: t, user } = this.props;
        const { drawerOpen } = this.state;
        return (
            <>
                <AppBar>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            onClick={user.authenticated ? onHandleMenuClick : undefined}
                            className={classes.icon}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant={'h6'} noWrap>
                            {t('appName')}
                        </Typography>
                        <div style={{ marginLeft: 'auto' }}>
                            <Button
                                onClick={
                                    () => this.props.user.authenticate()
                                    // this.setState({ authenticated: !authenticated })
                                }
                            >
                                Toggle Authenticated
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                {user.authenticated && (
                    <Drawer
                        classes={{
                            paper: classes.drawer,
                            heading: classes.heading,
                        }}
                        open={typeof drawerOpen === 'undefined' ? false : drawerOpen}
                        toggle={onHandleMenuClick}
                    >
                        <Switch>
                            <Route path={'/'} component={CommonDrawerItems} />
                        </Switch>
                    </Drawer>
                )}
                <div
                    className={clsx(classes.container, {
                        [classes.open]: drawerOpen && isDesktop && user.authenticated,
                    })}
                >
                    {children}
                </div>
            </>
        );
    }
}

type Props2 = {
    layoutRef?: RefObject<Layout>;
    children: React.ReactChild;
};
export default function LayoutHOC(props: Props2) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const userState = UserState.useContainer();
    const { t } = useTranslation(['layout', 'errors']);
    const ForwardedLayout = React.forwardRef((p: Props2, ref: any) => (
        <Layout
            ref={ref}
            {...p}
            i18n={t}
            user={userState}
            classes={classes}
            theme={theme}
            isDesktop={isDesktop}
        />
    ));
    return <ForwardedLayout ref={props.layoutRef} {...props} />;
}
