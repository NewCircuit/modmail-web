import React, { RefObject, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageContainer from 'components/MessageContainer';
import { useParams } from 'react-router-dom';
import { VerifiedUser } from '@material-ui/icons';
import { Trans, useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { Theme, APPBAR_HEIGHT } from '../../theme';
import { NavigationState } from '../../state';
import Message from '../../components/Message';
import { MutatedThread } from '../../types';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';

type Params = {
    categoryId: string;
    threadId: string;
};

const useStyle = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    eof: {
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '5rem',
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
    const { i18n } = useTranslation('pages');
    const classes = useStyle();
    const [fetchState, setFetchState] = useState<FetchState>(FetchState.EMPTY);
    const [thread, setThread] = useState<MutatedThread | null>(null);
    const { categoryId, threadId } = useParams<Params>();
    const { threads } = NavigationState.useContainer();
    const pageRef: RefObject<HTMLDivElement> = React.createRef();

    useEffect(() => {
        if (fetchState === FetchState.EMPTY) {
            setFetchState(FetchState.LOADING);
            console.log('Fetching thread');
            threads.fetchOne(categoryId, threadId).then((currentThread) => {
                setFetchState(FetchState.LOADED);
                if (currentThread) setThread(currentThread);
            });
        }
    }, [fetchState]);

    // This is a failsafe to load the specific thread if this is a direct load or a refresh
    useEffect(() => {
        if (typeof threads.items === 'undefined') {
            threads.fetchOne(categoryId, threadId).then((currentThread) => {
                if (currentThread) setThread(currentThread);
            });
        }
    }, [threads.items]);

    useEffect(() => {
        setFetchState(FetchState.EMPTY);
        setThread(null);
    }, [categoryId, threadId]);

    return (
        <div ref={pageRef} className={classes.root}>
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
                    <Trans i18n={i18n} i18nKey={'thread.eof'} ns={'pages'} />
                </p>
            </div>
        </div>
    );
}

export default ThreadPage;
