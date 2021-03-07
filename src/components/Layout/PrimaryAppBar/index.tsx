import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { Link, useLocation } from 'react-router-dom';
import UrlPattern from 'url-pattern';
import { useTranslation } from 'react-i18next';
import { NC } from '../../../types';
import { APPBAR_HEIGHT } from '../../../theme';

type Props = {
    user: NC.State.UserState;
    onHandleMenuClick?: (evt: React.SyntheticEvent<HTMLButtonElement>) => unknown;
};

const categoryPattern = new UrlPattern('/category/:id1(/:page1(/:id2(/:page2)))');

const useStyle = makeStyles((theme) => ({
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
        height: APPBAR_HEIGHT,
    },
    icon: {
        fontSize: '2em',
    },
}));

function PrimaryAppBar(props: Props) {
    const { user } = props;
    const { t } = useTranslation();
    const classes = useStyle();
    const location = useLocation();
    const [homeLink, setHomeLink] = useState('/');

    useEffect(() => {
        const matched = categoryPattern.match(location.pathname);
        if (matched) {
            if (matched.page2 === 'history') {
                setHomeLink('/');
            } else {
                setHomeLink(`/category/${matched.id1}/users/me/history`);
            }
        } else {
            setHomeLink('/');
        }
    }, [location]);

    return (
        <AppBar>
            <Toolbar className={classes.toolbar}>
                {/* Disabled for V1 since there is no real use for the menu right now */}
                {/* <IconButton */}
                {/*    onClick={user.authenticated ? onHandleMenuClick : undefined} */}
                {/*    className={classes.icon} */}
                {/* > */}
                {/*    <MenuIcon /> */}
                {/* </IconButton> */}
                {user.authenticated ? (
                    <Link to={homeLink} className={classes.title}>
                        {t('appName')}
                    </Link>
                ) : (
                    <Typography className={classes.title} variant={'h6'}>
                        {t('appName')}
                    </Typography>
                )}
                <div style={{ marginLeft: 'auto' }}>
                    {user.authenticated && (
                        <Button startIcon={<ExitToApp />} onClick={user.logout}>
                            Logout
                        </Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export type PrimaryAppBarProps = Props;
export default PrimaryAppBar;
