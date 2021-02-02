import React, { RefObject, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageContainer from 'components/MessageContainer';
import { useParams } from 'react-router-dom';
import { Thread } from 'modmail-types';
import { Theme, APPBAR_HEIGHT } from '../../theme';
import { NavigationState } from '../../state';
import Message from '../../components/Message';

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
}));

function ThreadPage() {
    const classes = useStyle();
    const [thread, setThread] = useState<Thread | null>(null);
    const { categoryId, threadId } = useParams<Params>();
    const { threads } = NavigationState.useContainer();
    const pageRef: RefObject<HTMLDivElement> = React.createRef();

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
        console.log(categoryId, threadId, threads);
        const currentThread = threads.findById(categoryId, threadId);
        if (currentThread) {
            if (thread === null || (thread && thread.id !== currentThread.id))
                setThread(currentThread);
        }
    }, [categoryId, threadId, threads.items]);

    return (
        <div ref={pageRef} className={classes.root}>
            <MessageContainer pageRef={pageRef} messages={thread?.messages || []}>
                {(message, index) => <Message key={index} {...message} />}
            </MessageContainer>
        </div>
    );
}

export default ThreadPage;
