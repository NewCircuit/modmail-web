import React, { useEffect } from 'react';
import { Slide } from '@material-ui/core';
import { Thread } from 'modmail-types';
import { useHistory } from 'react-router-dom';
import ThreadListItem from '../../ThreadListItem';
import { NavigationState } from '../../../state';

export default function ThreadDrawer() {
    const history = useHistory();
    const { threads } = NavigationState.useContainer();
    useEffect(() => {
        console.log('ThreadsDrawer');
    }, []);

    const onThreadClicked = (evt: React.SyntheticEvent, thread?: Thread) => {
        if (thread) {
            history.push(`/category/${thread.category}/${thread.id}`);
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
