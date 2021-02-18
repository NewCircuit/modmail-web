import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, List, ListItem, Paper, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { MemberState, Nullable } from '../../types';
import { FetchState } from '../../state';
import { getNameFromMemberState } from '../../util';

type Props = {
    user: string;
    total: number;
    fetch: () => Promise<Nullable<MemberState>>;
    className?: string;
};

const useStyle = makeStyles((theme) => ({
    root: {
        padding: '.25rem',
    },
    title: {
        padding: '.25rem .25rem .5rem',
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    subtitle: {},
    body: {
        marginTop: '.25rem',
        display: 'flex',
    },
    left: {
        padding: '.5rem .5rem .5rem .25rem',
    },
    list: {
        '& > li': {
            padding: '0 .5rem .25rem',
        },
    },
    avatar: {
        height: 60,
        width: 60,
        boxShadow: theme.shadows[2],
    },
    user: {},
    threadCount: {},
    inlineSkeleton: {
        display: 'inline',
        width: 50,
        height: 15,
    },
}));

function UserHistoryTitleCard(props: Partial<Props>) {
    const { user, total, fetch } = props as Props;
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [userData, setUserData] = useState<Nullable<MemberState>>(null);
    const classes = useStyle();

    useEffect(() => {
        if (user === 'me') return;
        setUserData(null);
        setFetchState(FetchState.LOADING);
        fetch().then((data) => {
            setFetchState(FetchState.LOADED);
            setUserData(data);
        });
    }, [user]);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const Container = ({ children: cn }: any) => (
        <Paper className={clsx(classes.root, props.className)}>{cn}</Paper>
    );

    const userEl = (
        <span className={classes.user}>
            {fetchState === FetchState.LOADED
                ? getNameFromMemberState(userData)
                : 'Unknown'}
        </span>
    );
    const threadCountEl = <span className={classes.threadCount}> {'x'} </span>;

    const parts: { [s: string]: JSX.Element | string } = {
        avatar: <Skeleton className={classes.avatar} variant={'circle'} />,
        historyFor: <Skeleton width={250} height={25} />,
        total: <Skeleton width={150} height={25} />,
    };

    if (fetchState === FetchState.LOADED && userData) {
        parts.avatar = (
            <Avatar src={userData.avatarURL} className={classes.avatar}>
                {getNameFromMemberState(userData).substr(0, 2)}
            </Avatar>
        );
        parts.historyFor = `Viewing history for: ${getNameFromMemberState(userData)}`;
        parts.total = `Total Threads: ${total}`;
    } else if (fetchState === FetchState.LOADED && userData === null) {
        parts.avatar = <Avatar className={classes.avatar}>N/A</Avatar>;
        parts.historyFor = 'Unknown user selected.';
        parts.total = 'Unknown user selected.';
    }

    return (
        <Container className={clsx(props.className)}>
            <Typography variant={'h3'} className={classes.title}>
                Thread history
            </Typography>
            <div className={classes.body}>
                <div className={classes.left}>{parts.avatar}</div>
                <List className={classes.list}>
                    <ListItem>
                        <Typography variant={'subtitle1'}>{parts.historyFor}</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant={'subtitle1'}>{parts.total}</Typography>
                    </ListItem>
                </List>
            </div>
        </Container>
    );
}

UserHistoryTitleCard.defaultProps = {
    total: 0,
    user: '',
    fetch: () => Promise.resolve(null),
};

export type UserHistoryTitleCardProps = Partial<Props>;
export default UserHistoryTitleCard;
