import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { CircularProgress, Container, Paper, Typography } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { Category, Thread } from 'modmail-types';
import { NavigationState } from '../../state';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';
import ThreadsContainer from '../../components/ThreadsContainer';
import ThreadListItem from '../../components/ThreadListItem';

type ThreadsPageParams = {
    categoryId: string;
};

const useStyle = makeStyles(() => ({
    root: {
        position: 'relative',
        minHeight: '80vh',
        padding: '1rem',
    },
    title: { padding: '.5rem' },
}));

enum FetchState {
    EMPTY,
    LOADING,
    LOADED,
}

function ThreadsPage(): JSX.Element {
    const { t } = useTranslation('pages');
    const classes = useStyle();
    const { categoryId } = useParams<ThreadsPageParams>();
    const history = useHistory();
    const { threads, categories } = NavigationState.useContainer();
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [category, setCategory] = useState<Category | null>(null);
    const isThreadsLoaded = threads.items instanceof Array;

    useEffect(() => {
        if (fetchState === FetchState.EMPTY) {
            setFetchState(FetchState.LOADING);
            threads.fetch(categoryId).then(() => {
                setFetchState(FetchState.LOADED);
            });
        }
    }, [fetchState]);

    useEffect(() => {
        setFetchState(FetchState.EMPTY);
        threads.reset();
        setCategory(categories.findById(categoryId));
    }, [categoryId]);

    const onThreadClicked = (evt: React.SyntheticEvent, thread: Thread) => {
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
            <Paper>
                <Typography variant={'h2'} className={classes.title}>
                    <Trans
                        i18nKey={'category.title'}
                        ns={'pages'}
                        tOptions={{
                            category: category ? category.name : 'Unknown',
                        }}
                    />
                </Typography>
            </Paper>
            {isThreadsLoaded ? (
                <ThreadsContainer
                    threads={threads.items}
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
            ) : (
                renderLoading
            )}
        </Container>
    );
}

export default ThreadsPage;
