import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { Container, Grid, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import UserHistoryTitleCard from 'components/UserHistoryTitleCard';
import UserSearchDialog, {
    UserSearchDialog as UserSearchDialogClass,
} from 'components/UserSearchDialog';
import { Category } from '@Floor-Gang/modmail-types';
import { FetchState, ModmailState, UserState } from '../../state';
import ThreadsContainer from '../../components/ThreadsContainer';
import ThreadListItem from '../../components/ThreadListItem';
import { MemberState, MutatedThread, Nullable } from '../../types';
import UserHistoryActions from '../../components/UserHistoryActions';

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
    const dialogRef = React.createRef<UserSearchDialogClass>();

    useEffect(() => {
        const currentCategory = categoriesHandler.findById(categoryId);
        if (currentCategory === null) {
            console.log('Collecting current category...');
            categoriesHandler.fetchOne(categoryId).then((response) => {
                setCategory(response);
            });
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

    const onThreadClicked = (evt, thread: MutatedThread) => {
        console.log({ evt, thread });
        history.push(`/category/${categoryId}/threads/${thread.id}`);
    };

    const handleLookup = (evt) => {
        if (dialogRef.current) {
            const dialog = dialogRef.current;
            dialog.open();
        }
    };

    const onSearch = (evt, value) => {
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
            <UserSearchDialog ref={dialogRef} onSubmit={onSearch} />
            <Grid container spacing={4}>
                <Grid item md={4} xs={12}>
                    <UserHistoryActions actions={actions} />
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
                </Grid>
            </Grid>
        </Container>
    );
}

export type UserHistoryPageProps = Props;
export default UserHistoryPage;
