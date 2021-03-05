import React, { ForwardedRef, RefObject } from 'react';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { NC } from 'types';
import Drawer from './Drawer';
import CommonDrawerItems from './CommonDrawerItems';
import { UserState } from '../../state';
import { APPBAR_HEIGHT, DRAWER_WIDTH, Theme } from '../../theme';
import PrimaryAppBar from './PrimaryAppBar';
import GlobalFooter from './GlobalFooter';

type Props = {
    ref: ForwardedRef<Layout>;
    classes: { [s: string]: string };
    theme: Theme;
    isDesktop: boolean;
    user: NC.State.UserState;
    children: React.ReactNode;
};

type State = {
    drawerOpen: boolean;
};

const toolbarHeight = APPBAR_HEIGHT;
const drawerWidth = DRAWER_WIDTH.mobile;
const drawerWidthDesktop = DRAWER_WIDTH.desktop;

const useStyles = makeStyles((theme) => ({
    toolbar: {
        height: APPBAR_HEIGHT,
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
    wrapper: {
        transition: 'ease margin-left .5s',
        marginLeft: 0,
        height: `100vh`,
        position: 'relative',
        overflow: 'hidden',
    },
    container: {
        position: 'relative',
        height: `calc(100% - ${toolbarHeight}px)`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
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
        const { classes, isDesktop, children, user } = this.props;
        const { drawerOpen } = this.state;

        return (
            <>
                <PrimaryAppBar onHandleMenuClick={onHandleMenuClick} user={user} />
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
                    className={clsx(classes.wrapper, {
                        [classes.open]: drawerOpen && isDesktop && user.authenticated,
                    })}
                >
                    <div className={classes.toolbar} />
                    <div id={'main-container'} className={classes.container}>
                        {children}
                        <GlobalFooter />
                    </div>
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
    const theme = useTheme<Theme>();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const userState = UserState.useContainer();
    const ForwardedLayout = React.forwardRef(
        (forwardedProps: LayoutHOCProps, ref: ForwardedRef<Layout>) => (
            <Layout
                ref={ref}
                {...forwardedProps}
                user={userState}
                classes={classes}
                theme={theme}
                isDesktop={isDesktop}
            />
        )
    );
    return <ForwardedLayout ref={props.layoutRef} {...props} />;
}
