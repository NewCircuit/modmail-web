import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { Thread } from '@Floor-Gang/modmail-types';
import { useTranslation } from 'react-i18next';
import { useAxios } from './index';
import { FG, MutatedThread, Nullable, Optional } from '../types';

type MembersState = FG.State.MembersState;

type Props = {
    members: MembersState;
};
export default function useThreads(props?: Props) {
    const { members } = props || {};
    const { t } = useTranslation();
    const [threads, setThreads] = useState<Optional<MutatedThread[]>>(undefined);
    const { axios } = useAxios();

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    function empty(...noop) {
        return () => Promise.resolve(null);
    }

    function cacheThreads(threadsToAdd: MutatedThread[]) {
        // TODO handle this better..
        setThreads(threadsToAdd);
    }

    function resetThreads() {
        setThreads([]);
    }

    function parseThread(thread: Thread): MutatedThread {
        const fn = members?.get || empty;
        return {
            ...thread,
            author: {
                id: thread.author.id,
                data: fn(thread.category, thread.author.id),
            },
            messages: thread.messages.map((message) => ({
                ...message,
                sender: {
                    id: message.sender,
                    data: fn(thread.category, message.sender),
                },
            })),
        };
    }

    function parseThreads(unparsed: Thread[]): MutatedThread[] {
        return unparsed.map(parseThread);
    }

    function fetchThreads(category: string): Promise<MutatedThread[]> {
        console.log('Fetch Threads Now!');
        return axios
            .get(t('urls.threads', { category }))
            .then((response: AxiosResponse<FG.Api.ThreadsResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    const mutated = parseThreads(response.data.threads);
                    if (members) members.cache(response.data.users);
                    cacheThreads(mutated);
                    return mutated;
                }
                resetThreads();
                return [];
            })
            .catch((err) => {
                console.error(err);
                resetThreads();
                return [];
            });
    }

    function fetchOneThread(
        category: string,
        thread: string
    ): Promise<Nullable<MutatedThread>> {
        return axios
            .get(t('urls.threadsOne', { category, thread }))
            .then((response: AxiosResponse<FG.Api.ThreadsOneResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    if (members) members.cache(response.data.users);
                    return parseThread(response.data);
                }
                return null;
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }

    function fetchThreadsByUserId(
        category: string,
        user: string,
        cache = false
    ): Promise<MutatedThread[]> {
        return axios
            .get<FG.Api.UserHistoryResponse>(
                t('urls.fetchThreadsByUser', { category, user })
            )
            .then((response) => {
                if (response.status === 200) {
                    const mutated = parseThreads(response.data.threads);
                    if (members) members.cache(response.data.users);
                    if (cache) cacheThreads(mutated);
                    return mutated;
                }
                return [];
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    function findThreadById(categoryId: string, threadId: string) {
        if (threads instanceof Array) {
            return (
                threads.find(
                    (thread) => thread.category === categoryId && thread.id === threadId
                ) || null
            );
        }
        return null;
    }

    return {
        items: threads,
        fetch: fetchThreads,
        fetchOne: fetchOneThread,
        findById: findThreadById,
        fetchByUserId: fetchThreadsByUserId,
        reset: resetThreads,
    };
}
