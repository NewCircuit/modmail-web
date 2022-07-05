import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { CircularProgress, Container, Paper, Typography } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { Category } from '@fg-devs/modmail-types';
import { Helmet } from 'react-helmet';
import { ModmailState, FetchState } from '../../state';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';
import ThreadsContainer from '../../components/ThreadsContainer';
import ThreadListItem from '../../components/ThreadListItem';
import { Logger } from '../../util';
import { MutatedThread } from '../../types';

const logger = Logger.getLogger('ThreadsPage');

type ThreadsPageParams = {
    categoryId: string;
};

const useStyle = makeStyles(() => ({
    root: {
        position: 'relative',
        padding: '1rem',
    },
    titlePaper: {
        marginBottom: '1rem',
    },
    title: { padding: '.5rem' },
}));

function ThreadsPage(): JSX.Element {
    const { t } = useTranslation();
    const classes = useStyle();
    const { categoryId } = useParams<ThreadsPageParams>();
    const { threads, categories } = ModmailState.useContainer();
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
        const exists = categories.findById(categoryId);
        if (exists) setCategory(exists);
        else {
            categories.fetchOne(categoryId).then((cat) => setCategory(cat));
        }
    }, [categoryId]);

    const onThreadClicked = (evt: React.SyntheticEvent, thread?: MutatedThread) =>
        logger.verbose({
            message: 'Thread Clicked',
            data: {
                id: thread?.id,
                authorId: thread?.author.id,
                category: thread?.category,
            },
        });

    const renderLoading = (
        <LocalizedBackdrop open fadeOut>
            <CircularProgress />
        </LocalizedBackdrop>
    );

    return (
        <Container className={classes.root}>
            {category && (
                <Helmet>
                    <title>
                        {t('guildName', { ns: 'translation' })} | {category.name}
                    </title>
                </Helmet>
            )}
            <Paper className={classes.titlePaper}>
                <Typography variant={'h2'} className={classes.title}>
                    <Trans
                        i18nKey={'category.title'}
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
