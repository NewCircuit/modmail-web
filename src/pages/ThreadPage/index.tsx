import React, { RefObject, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageContainer from 'components/MessageContainer';
import { useParams } from 'react-router-dom';
import { VerifiedUser } from '@material-ui/icons';
import { Trans } from 'react-i18next';
import { Theme, APPBAR_HEIGHT } from '../../theme';
import { MembersState, NavigationState } from '../../state';
import Message from '../../components/Message';
import { MutatedThread } from '../../types';

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

function ThreadPage() {
    const classes = useStyle();
    const [thread, setThread] = useState<MutatedThread | null>(null);
    const { categoryId, threadId } = useParams<Params>();
    const { threads } = NavigationState.useContainer();
    const { getMember, members, fetchMembers } = MembersState.useContainer();
    const pageRef: RefObject<HTMLDivElement> = React.createRef();

    // useEffect(() => {
    //     if (members === null) {
    //         fetchMembers(categoryId);
    //     } else {
    //         console.log(members);
    //     }
    // }, [members]);

    // This is a failsafe to load the specific thread if this is a direct load or a refresh
    useEffect(() => {
        if (typeof threads.items === 'undefined') {
            threads.fetchOne(categoryId, threadId).then((currentThread) => {
                if (currentThread) setThread(currentThread);
            });
        }
    }, [threads.items]);

    // Sets the current thread to view based on URL parameters
    useEffect(() => {
        const currentThread = threads.findById(categoryId, threadId);
        if (currentThread) {
            if (thread === null || (thread && thread.id !== currentThread.id))
                setThread(currentThread);
        }
    }, [categoryId, threadId, threads.items]);

    const handleFetchMember = (id?: string) => getMember.call(null, categoryId, id || '');

    return (
        <div ref={pageRef} className={classes.root}>
            <MessageContainer
                author={thread?.author.id}
                pageRef={pageRef}
                messages={thread?.messages || []}
            >
                {(message, index) => <Message key={index} {...message} />}
            </MessageContainer>
            <div className={classes.eof}>
                <VerifiedUser className={classes.eofIcon} />
                <p>
                    <Trans i18nKey={'thread.eof'} ns={'pages'} />
                </p>
            </div>
        </div>
    );
}

export default ThreadPage;
