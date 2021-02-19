/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { FG, DiscordTag } from '../types';
import { useMembers, useCategories, useThreads, useRoles, useChannels } from './index';

type State = FG.State.ModmailState;

type DiscordTagHandlers = {
    [s: string]: Promise<DiscordTag>;
};

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
