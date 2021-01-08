import React, { useEffect } from 'react';
import {
    Container,
    Icon,
    makeStyles,
    Paper,
    lighten,
    Typography,
    Button,
} from '@material-ui/core';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserState } from '../../state';

const useStyles = makeStyles((theme) => ({
    root: {
        // transition: 'ease all 1s',
        display: 'flex',
        height: '100%',
        alignItems: 'start',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    container: {
        // background: lighten(theme.palette.background, .3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '2rem auto 0',
        width: '90%',
        [theme.breakpoints.up('sm')]: {
            width: 500,
            margin: '0 auto',
        },
    },
    heading: {
        margin: '2rem auto',
    },
    title: {
        marginBottom: '1rem',
    },
    icon: {
        height: '6em',
        width: '6em',
        // fontSize: '3em',
    },
    content: {
        textAlign: 'center',
        '& p, & h6': {
            color: theme.palette.getContrastText(theme.palette.background.paper),
        },
        padding: '0 1.5rem',
        margin: '0 auto 2rem',
    },
    btn: {
        marginTop: '2rem',
    },
}));

type Props = any;
export default function UnauthorizedPage(props: Props) {
    const classes = useStyles();
    const { t } = useTranslation('unauthorized');
    const { authenticate } = UserState.useContainer();
    const history = useHistory();
    const onAuthorize = (evt: React.SyntheticEvent) => {
        authenticate();
        history.push('/');
    };

    return (
        <Container className={classes.root}>
            <Paper elevation={3} className={classes.container}>
                <div className={classes.heading}>
                    <Icon>
                        <MoodBadIcon className={classes.icon} />
                    </Icon>
                </div>
                <div className={classes.content}>
                    <Typography className={classes.title} variant={'h3'}>
                        {t('title')}
                    </Typography>
                    <Typography variant={'body1'}>{t('description')}</Typography>

                    <Button
                        onClick={onAuthorize}
                        variant={'contained'}
                        className={classes.btn}
                        color={'primary'}
                    >
                        {t('button')}
                    </Button>

                    <Button
                        style={{ display: 'block', marginTop: '1rem' }}
                        href={'/oauth?code=341lj34kj3n2f&test=yes&bool&ofc=yes&ofc=no'}
                        target={'_blank'}
                    >
                        OAuth Authorization Demo
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}
