import React, { ForwardedRef, RefObject } from 'react';
import {
    AppBar,
    Button,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { FG } from 'types';
import { Link } from 'react-router-dom';
import Drawer from './Drawer';
import CommonDrawerItems from './CommonDrawerItems';
import { UserState } from '../../state';
import { APPBAR_HEIGHT, DRAWER_WIDTH, Theme } from '../../theme';

type Props = {
    ref: ForwardedRef<Layout>;
    i18n: TFunction;
    classes: { [s: string]: string };
    theme: Theme;
    isDesktop: boolean;
    user: FG.State.UserState;
    children: React.ReactNode;
};

type State = {
    drawerOpen: boolean;
};

const toolbarHeight = APPBAR_HEIGHT;
const drawerWidth = DRAWER_WIDTH.mobile;
const drawerWidthDesktop = DRAWER_WIDTH.desktop;

const useStyles = makeStyles((theme) => ({
    title: {
        'a&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 0,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.text.primary,
            transition: 'width .25s ease',
        },
        '&:hover:after': {
            width: '100%',
        },
        position: 'relative',
        fontSize: '2em',
        color: theme.palette.primary.contrastText,
        marginLeft: '.5rem',
        textDecoration: 'none',
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
        minHeight: toolbarHeight,
        height: toolbarHeight,
    },
    drawer: {
        // paddingTop: toolbarHeight,
        width: drawerWidth,
        overflowX: 'hidden',
        [theme.breakpoints.up('sm')]: {
            height: `calc(100% - ${toolbarHeight}px)`,
            marginTop: toolbarHeight,
            paddingTop: 0,
            width: drawerWidthDesktop,
        },
    },
    container: {
        transition: 'ease margin-left .5s',
        marginLeft: 0,
        height: `100vh`,
        position: 'relative',
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
                        {user.authenticated ? (
                            <Link to={'/'} className={classes.title}>
                                {t('appName')}
                            </Link>
                        ) : (
                            <Typography className={classes.title} variant={'h6'}>
                                {t('appName')}
                            </Typography>
                        )}
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
                        <CommonDrawerItems />
                    </Drawer>
                )}
                <div
                    className={clsx(classes.container, {
                        [classes.open]: drawerOpen && isDesktop && user.authenticated,
                    })}
                >
                    <div className={classes.toolbar} />
                    {children}
                </div>
            </>
        );
    }
}

type LayoutHOCProps = {
    layoutRef?: RefObject<Layout>;
    children: React.ReactChild;
};
export default function LayoutHOC(props: LayoutHOCProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const userState = UserState.useContainer();
    const { t } = useTranslation();
    const ForwardedLayout = React.forwardRef(
        (forwardedProps: LayoutHOCProps, ref: ForwardedRef<Layout>) => (
            <Layout
                ref={ref}
                {...forwardedProps}
                i18n={t}
                user={userState}
                classes={classes}
                theme={theme}
                isDesktop={isDesktop}
            />
        )
    );
    return <ForwardedLayout ref={props.layoutRef} {...props} />;
}
