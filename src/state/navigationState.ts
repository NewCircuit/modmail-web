import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Thread } from 'modmail-types';
import { FG } from '../types';

type State = FG.State.NavigationState;

const testData: Thread[] = [
    {
        id: '0000000',
        author: {
            id: '00000',
        },
        category: 'modmail',
        channel: 'XInfinite_#3113',
        isActive: true,
        messages: [
            {
                content: 'content here',
                clientID: '0000',
                edits: [],
                files: [],
                internal: false,
                isDeleted: false,
                modmailID: '00000',
                sender: 'XInfinite_#3113',
                threadID: '000000',
            },
        ],
    },
];

function navigationState(): State {
    const [threads, setThreads] = useState(testData);
    return {
        threads: {
            items: threads,
        },
    };
}

export function useNavigationState() {
    return createContainer(navigationState);
}

export default useNavigationState();
