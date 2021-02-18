import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import {
    CircularProgress,
    Container,
    Paper,
    Typography,
    useTheme,
} from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import UserHistoryTitleCard from 'components/UserHistoryTitleCard';
import { FetchState, MembersState, NavigationState, UserState } from '../../state';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';
import ThreadsContainer from '../../components/ThreadsContainer';
import ThreadListItem from '../../components/ThreadListItem';
import { MemberState, MutatedThread, Nullable } from '../../types';

type Props = any;

type Params = {
    categoryId: string;
    userId: 'me' | string;
};

type CurrentUserState = {
    loaded: FetchState;
    data?: Nullable<MemberState>;
};

const useStyle = makeStyles((theme) => ({
    root: {
        position: 'relative',
        minHeight: '80vh',
        padding: '1rem',
    },
    title: {
        marginBottom: '1rem',
    },
}));

function UserHistoryPage(props: Props) {
    const { t } = useTranslation('pages');
    const classes = useStyle();
    const theme = useTheme();
    const history = useHistory();
    const { getMember } = MembersState.useContainer();
    const { userId } = UserState.useContainer();
    const {
        threads: threadsHandler,
        categories: categoriesHandler,
    } = NavigationState.useContainer();
    const { userId: targetUserId, categoryId } = useParams<Params>();
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [threads, setThreads] = useState<MutatedThread[]>([]);

    const category = categoriesHandler.findById(categoryId);

    useEffect(() => {
        if (fetchState === FetchState.EMPTY) {
            setFetchState(FetchState.LOADING);
            threadsHandler
                .fetchByUserId(categoryId, targetUserId)
                .then((currentThreads) => {
                    setFetchState(FetchState.LOADED);
                    setThreads(currentThreads);
                });
        }
    }, [fetchState]);

    useEffect(() => {
        if (targetUserId === 'me') {
            history.push(`/category/${categoryId}/user/${userId}`);
            // return;
        }
    }, [targetUserId]);

    const onThreadClicked = (evt, thread: MutatedThread) => {
        console.log({ evt, thread });
        history.push(`/category/${categoryId}/${thread.id}`);
    };

    const renderLoading = (
        <LocalizedBackdrop open fadeOut>
            <CircularProgress />
        </LocalizedBackdrop>
    );

    return (
        <Container className={classes.root}>
            <UserHistoryTitleCard
                className={classes.title}
                total={threads.length}
                user={userId}
                fetch={getMember(categoryId, userId)}
            />

            <ThreadsContainer
                threads={threads}
                loaded={fetchState === FetchState.LOADED}
                itemProps={{
                    full: true,
                    style: { height: 150 },
                    replied: true,
                    onClick: onThreadClicked,
                }}
                empty={{
                    title: t('category.noThreadsTitle'),
                    description: t('category.noThreadsDesc'),
                }}
            >
                {ThreadListItem}
            </ThreadsContainer>
        </Container>
    );
}

export type UserHistoryPageProps = Props;
export default UserHistoryPage;
