import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, List, ListItem, Paper, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { Category } from '@Floor-Gang/modmail-types';
import { useTranslation, Trans } from 'react-i18next';
import { MemberState, Nullable } from '../../types';
import { FetchState } from '../../state';
import { getNameFromMemberState } from '../../util';

type Props = {
    user: string;
    total: number;
    fetch: () => Promise<Nullable<MemberState>>;
    category: Nullable<Category>;
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
    const { user, total, fetch, category } = props as Props;
    const { t, i18n } = useTranslation('pages');
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

    const Container = ({ children: cn }: any) => (
        <Paper className={clsx(classes.root, props.className)}>{cn}</Paper>
    );

    const parts: { [s: string]: JSX.Element | string } = {
        avatar: <Skeleton className={classes.avatar} variant={'circle'} />,
        historyFor: <Skeleton width={250} height={25} />,
        total: <Skeleton width={150} height={25} />,
        categoryName: <Skeleton width={150} height={25} />,
    };

    if (fetchState === FetchState.LOADED && userData) {
        parts.avatar = (
            <Avatar src={userData.avatarURL} className={classes.avatar}>
                {getNameFromMemberState(userData).substr(0, 2)}
            </Avatar>
        );

        parts.historyFor = (
            <Trans
                i18n={i18n}
                ns={'pages'}
                tOptions={{ user: getNameFromMemberState(userData) }}
                i18nKey={'userHistory.profile.historyFor'}
            />
        );

        parts.total = (
            <Trans
                i18n={i18n}
                ns={'pages'}
                tOptions={{ total }}
                i18nKey={'userHistory.profile.total'}
            />
        );

        parts.categoryName = (
            <Trans
                i18n={i18n}
                ns={'pages'}
                tOptions={{
                    category: category?.name,
                }}
                i18nKey={'userHistory.profile.categoryName'}
            />
        );
    } else if (fetchState === FetchState.LOADED && userData === null) {
        parts.avatar = <Avatar className={classes.avatar}>N/A</Avatar>;
        parts.historyFor = t('userHistory.profile.unknownUser');
        parts.total = t('userHistory.profile.unknownUser');
        parts.categoryName = t('userHistory.profile.unknownCategory');
    }

    return (
        <Container className={clsx(props.className)}>
            <Typography variant={'h3'} className={classes.title}>
                {t('userHistory.profile.title')}
            </Typography>
            <div className={classes.body}>
                <div className={classes.left}>{parts.avatar}</div>
                <List className={classes.list}>
                    <ListItem>
                        <Typography variant={'subtitle1'}>{parts.historyFor}</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant={'subtitle1'}>
                            {parts.categoryName}
                        </Typography>
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
