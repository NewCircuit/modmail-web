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
import { UserState } from '../../state';

const useStyles = makeStyles((theme) => ({
    root: {
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
        margin: '0 auto 2rem',
    },
    btn: {
        marginTop: '2rem',
    },
}));

type Props = any;
export default function UnauthorizedPage(props: Props) {
    const classes = useStyles();
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
                        Discord Authenticated Required
                    </Typography>
                    <Typography variant={'body1'}>
                        In order to use this web app, you must first login with Discord
                        and authorize access to your account.
                    </Typography>

                    <Button
                        onClick={onAuthorize}
                        variant={'contained'}
                        className={classes.btn}
                        color={'primary'}
                    >
                        Authorize Account
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}
