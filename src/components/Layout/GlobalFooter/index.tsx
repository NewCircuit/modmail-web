import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Tooltip, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GitHub } from '@material-ui/icons';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        background: theme.palette.background.paper,
        alignItems: 'center',
        padding: '.5rem 1rem',
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: 'auto',
    },
    edge: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
    },
    github: {
        display: 'inline-flex',
        alignItems: 'center',
        color: 'unset',
        marginLeft: '.5rem',
        textDecoration: 'none !important',
    },
    link: {
        marginLeft: '.25rem',
        marginRight: '.25rem',
    },
    version: {
        marginLeft: '.5rem',
    },
}));

function GlobalFooter() {
    const { t } = useTranslation();
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <div className={classes.edge}>
                <Typography variant={'subtitle2'}>
                    Made with ❤️ by
                    <Link
                        className={classes.link}
                        target={'_blank'}
                        href={'https://github.com/NewCircuit'}
                    >
                        NewCircuit.io
                    </Link>
                    &copy; 2020-2021
                </Typography>
                <Tooltip title={t('viewGithub') as string}>
                    <Link
                        className={classes.github}
                        href={'https://github.com/NewCircuit/modmail-web'}
                        target={'_blank'}
                    >
                        <GitHub />
                        <Typography variant={'subtitle2'} className={classes.version}>
                            v{process.env.REACT_APP_VERSION}
                        </Typography>
                    </Link>
                </Tooltip>
            </div>
        </div>
    );
}

export default GlobalFooter;
