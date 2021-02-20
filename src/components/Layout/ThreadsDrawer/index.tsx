import React from 'react';
import { Slide } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ThreadListItem from '../../ThreadListItem';
import { ModmailState } from '../../../state';
import { MutatedThread } from '../../../types';
import { Logger } from '../../../util';

const logger = Logger.getLogger('ThreadsDrawer');

export default function ThreadDrawer() {
    const history = useHistory();
    const { threads } = ModmailState.useContainer();

    const onThreadClicked = (evt: React.SyntheticEvent, thread?: MutatedThread) => {
        if (thread) {
            logger.verbose({
                message: 'Thread Clicked',
                data: {
                    id: thread.id,
                    authorId: thread.author.id,
                    category: thread.category,
                },
            });
            history.push(`/category/${thread.category}/threads/${thread.id}`);
        }
    };

    return (
        <Slide in direction={'right'}>
            <div>
                {threads.items?.map((thread, idx) => (
                    <ThreadListItem
                        onClick={onThreadClicked}
                        replied={idx % 2 === 1}
                        thread={thread}
                        key={idx}
                    />
                ))}
            </div>
        </Slide>
    );
}
