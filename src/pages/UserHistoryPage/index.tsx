import React, { ForwardedRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { Container, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import UserHistoryTitleCard from 'components/UserHistoryTitleCard';
import UserSearchDialog, {
    UserSearchDialog as UserSearchDialogClass,
} from 'components/UserSearchDialog';
import { Category } from '@NewCircuit/modmail-types';
import { Helmet } from 'react-helmet';
import { FetchState, ModmailState, UserState } from '../../state';
import ThreadsContainer from '../../components/ThreadsContainer';
import ThreadListItem from '../../components/ThreadListItem';
import { MutatedThread, Nullable } from '../../types';
import UserHistoryActions from '../../components/UserHistoryActions';
import Async from '../../components/Async';
import { getNameFromMemberState, Logger } from '../../util';

const logger = Logger.getLogger('UserHistoryPage');

type Params = {
    categoryId: string;
    userId: 'me' | string;
};

const useStyle = makeStyles(() => ({
    root: {
        position: 'relative',
        padding: '1rem',
    },
    title: {
        marginBottom: '1rem',
    },
    actions: {},
}));

function UserHistoryPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyle();
    const history = useHistory();
    const { userId } = UserState.useContainer();
    const {
        threads: threadsHandler,
        categories: categoriesHandler,
        members: memberHandler,
    } = ModmailState.useContainer();
    const { userId: targetUserId, categoryId } = useParams<Params>();
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [threads, setThreads] = useState<MutatedThread[]>([]);
    const [category, setCategory] = useState<Nullable<Category>>(
        categoriesHandler.findById(categoryId)
    );
    const dialogRef: ForwardedRef<UserSearchDialogClass> = React.createRef<UserSearchDialogClass>();
    const targetUser = memberHandler.members[targetUserId];

    useEffect(() => {
        if (category === null) {
            categoriesHandler
                .fetchOne(categoryId)
                .then((response) => setCategory(response));
        }
    }, []);

    useEffect(() => {
        if (fetchState === FetchState.EMPTY && targetUserId !== 'me') {
            setFetchState(FetchState.LOADING);
            threadsHandler
                .fetchByUserId(categoryId, targetUserId)
                .then((currentThreads) => {
                    setFetchState(FetchState.LOADED);
                    setThreads(currentThreads);
                });
        }
    }, [fetchState, targetUserId]);

    useEffect(() => {
        if (targetUserId === 'me') {
            history.replace(`/category/${categoryId}/users/${userId}/history`);
            // return;
        } else {
            setThreads([]);
            setFetchState(FetchState.EMPTY);
        }
    }, [targetUserId]);

    const onThreadClicked = (evt: React.SyntheticEvent, thread?: MutatedThread) =>
        logger.verbose({
            message: 'Thread Clicked',
            data: {
                id: thread?.id,
                authorId: thread?.author.id,
                category: thread?.category,
            },
        });

    const handleLookup = () => {
        if (dialogRef.current) {
            const dialog = dialogRef.current;
            dialog.open();
        }
    };

    const onSearch = (evt, value) => {
        logger.verbose(`searching user history ${value}`);
        history.push(`/category/${categoryId}/users/${value}/history`);
    };

    const actions = [
        {
            render: t('userHistory.actions.archive'),
            href: `/category/${categoryId}/threads`,
        },
        {
            render: t('userHistory.actions.lookup'),
            onClick: handleLookup,
        },
    ];

    return (
        <Container className={classes.root}>
            {targetUser && targetUser.promise && (
                <Async promise={targetUser.promise}>
                    {(user) =>
                        user && (
                            <Helmet>
                                <title>
                                    {t('guildName', { ns: 'translation' })} |{' '}
                                    {getNameFromMemberState(user)}
                                </title>
                            </Helmet>
                        )
                    }
                </Async>
            )}
            <UserSearchDialog ref={dialogRef} onSubmit={onSearch} />
            <Grid container spacing={isDesktop ? 4 : 2}>
                <Grid item md={4} xs={12}>
                    <UserHistoryActions className={classes.actions} actions={actions} />
                </Grid>
                <Grid item md={8} xs={12}>
                    <UserHistoryTitleCard
                        className={classes.title}
                        total={threads.length}
                        user={targetUserId}
                        category={category}
                        fetch={memberHandler.get(categoryId, targetUserId)}
                    />

                    <ThreadsContainer
                        threads={threads}
                        loaded={fetchState === FetchState.LOADED}
                        itemProps={{
                            full: true,
                            style: { height: 150 },
                            onClick: onThreadClicked,
                        }}
                        empty={{
                            title: t('category.noThreadsTitle'),
                            description: t('category.noThreadsDesc'),
                        }}
                    >
                        {ThreadListItem}
                    </ThreadsContainer>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UserHistoryPage;
