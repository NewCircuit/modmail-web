import React, { useEffect } from 'react';
import { Slide } from '@material-ui/core';
import ThreadListItem from '../../ThreadListItem';
import { NavigationState } from '../../../state';

export default function ThreadDrawer() {
    const { threads } = NavigationState.useContainer();
    const thread = threads.items[0];
    useEffect(() => {
        console.log('ThreadsDrawer');
    }, []);
    return (
        <Slide in direction={'right'}>
            <div>
                {threads.items?.map((thread, idx) => (
                    <ThreadListItem replied={idx % 2 === 1} thread={thread} key={idx} />
                ))}
            </div>
        </Slide>
    );
}
