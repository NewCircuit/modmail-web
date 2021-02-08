import React, { useEffect } from 'react';
import { Slide } from '@material-ui/core';
import { Thread } from 'modmail-types';
import { useHistory } from 'react-router-dom';
import ThreadListItem from '../../ThreadListItem';
import { MembersState, NavigationState } from '../../../state';
import { MemberState, MutatedThread, Nullable } from '../../../types';

export default function ThreadDrawer() {
    const history = useHistory();
    const { threads } = NavigationState.useContainer();
    const { getMember } = MembersState.useContainer();
    useEffect(() => {
        console.log('ThreadsDrawer');
    }, []);

    const onThreadClicked = (evt: React.SyntheticEvent, thread?: MutatedThread) => {
        if (thread) {
            history.push(`/category/${thread.category}/${thread.id}`);
        }
    };

    const handleFetchMember = (category: string) => (
        id?: string
    ): Promise<Nullable<MemberState>> => getMember.call(null, category, id || '');

    return (
        <Slide in direction={'right'}>
            <div>
                {threads.items?.map((thread, idx) => (
                    <ThreadListItem
                        fetchMember={handleFetchMember(thread.category)}
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
