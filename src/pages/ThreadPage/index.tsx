import React, { RefObject, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageContainer from 'components/MessageContainer';
import { useParams } from 'react-router-dom';
import { VerifiedUser } from '@material-ui/icons';
import { Trans, useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import Async from 'components/Async';
import { Helmet } from 'react-helmet';
import { ModmailState } from '../../state';
import Message from '../../components/Message';
import { MutatedThread } from '../../types';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';
import { getNameFromMemberState, Logger } from '../../util';

const logger = Logger.getLogger('ThreadPage');

type Params = {
    categoryId: string;
    threadId: string;
};

const useStyle = makeStyles(() => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    eof: {
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    eofIcon: {
        height: '4em',
        width: '4em',
        opacity: 0.3,
    },
}));

const Loading = () => (
    <LocalizedBackdrop open>
        <CircularProgress />
    </LocalizedBackdrop>
);

enum FetchState {
    EMPTY,
    LOADING,
    LOADED,
}

function ThreadPage() {
    const { t, i18n } = useTranslation();
    const classes = useStyle();
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [thread, setThread] = useState<MutatedThread | null>(null);
    const { categoryId, threadId } = useParams<Params>();
    const { threads } = ModmailState.useContainer();
    const pageRef: RefObject<HTMLDivElement> = React.createRef();

    useEffect(() => {
        if (fetchState === FetchState.EMPTY) {
            const exists = threads.findById(categoryId, threadId);
            if (exists && exists.messages.length > 1) {
                setThread(exists);
                setFetchState(FetchState.LOADED);
            } else {
                setFetchState(FetchState.LOADING);
                logger.verbose(`fetching thread ${threadId}`);
                threads.fetchOne(categoryId, threadId).then((currentThread) => {
                    setFetchState(FetchState.LOADED);
                    if (currentThread) setThread(currentThread);
                });
            }
        }
    }, [fetchState, threads.items]);

    useEffect(() => {
        setFetchState(FetchState.EMPTY);
        setThread(null);
    }, [categoryId, threadId]);

    return (
        <div ref={pageRef} className={classes.root}>
            {thread && thread.author.data && (
                <Async promise={thread.author.data()}>
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
            {fetchState === FetchState.LOADING && <Loading />}
            <MessageContainer
                author={thread?.author.id}
                category={thread?.category}
                pageRef={pageRef}
                messages={thread?.messages || []}
            >
                {(message, index) => <Message key={index} {...message} />}
            </MessageContainer>
            <div className={classes.eof}>
                <VerifiedUser className={classes.eofIcon} />
                <p>
                    <Trans i18n={i18n} i18nKey={'thread.eof'} />
                </p>
            </div>
        </div>
    );
}

export default ThreadPage;
