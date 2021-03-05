import { createContainer } from 'unstated-next';
import { NC } from '../types';
import { useMembers, useCategories, useThreads, useRoles, useChannels } from '../hooks';

type State = NC.State.ModmailState;

function modmailState(): State {
    const members = useMembers();
    const categories = useCategories();
    const threads = useThreads({ members });
    const roles = useRoles();
    const channels = useChannels();

    return {
        threads,
        categories,
        roles,
        channels,
        members,
    };
}

export function useModmailState() {
    return createContainer(modmailState);
}

export default useModmailState();
