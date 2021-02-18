/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Category, ChannelState, RoleState, Thread } from '@Floor-Gang/modmail-types';
import axiosRaw, { AxiosInstance, AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import {
    FG,
    Nullable,
    Optional,
    MutatedThread,
    DiscordTag,
    RoleTag,
    ChannelTag,
} from '../types';
import { MembersState } from './index';

type State = FG.State.NavigationState;

type DiscordTagHandlers = {
    [s: string]: Promise<DiscordTag>;
};
// TODO Rename to ModmailState since this isn't actually navigation state at all anymore
function navigationState(defaultProps: any): State {
    const { t } = useTranslation();
    const { getMember, addMembers } = MembersState.useContainer();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const [threads, setThreads] = useState<Optional<MutatedThread[]>>(undefined);
    const { current: discordTagPromises } = useRef<DiscordTagHandlers>({});

    const { current: axios } = useRef<AxiosInstance>(
        axiosRaw.create({
            validateStatus: () => true,
        })
    );

    useEffect(() => {
        console.log({ defaultProps });
    });

    function parseThread(thread: Thread): MutatedThread {
        return {
            ...thread,
            author: {
                id: thread.author.id,
                data: getMember(thread.category, thread.author.id),
            },
            messages: thread.messages.map((message) => ({
                ...message,
                sender: {
                    id: message.sender,
                    data: getMember(thread.category, message.sender),
                },
            })),
        };
    }
    function parseThreads(unparsed: Thread[]): MutatedThread[] {
        return unparsed.map(parseThread);
    }

    function cacheThreads(threadsToAdd: MutatedThread[]) {
        // TODO handle this better..
        setThreads(threadsToAdd);
    }

    function findCategoryById(id: string): Nullable<Category> {
        if (categories instanceof Array) {
            return categories.find((cat) => cat.id === id) || null;
        }
        return null;
    }

    function fetchCategories(): Promise<Category[]> {
        console.log('Fetch Categories Now!');
        return axios
            .get(t('urls.categories'))
            .then((response: AxiosResponse<FG.Api.CategoriesResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    setCategories(response.data);
                    return response.data;
                }
                setCategories([]);
                return [];
            })
            .catch((err) => {
                console.error(err);
                setCategories([]);
                return [];
            });
    }

    function fetchOneCategory(category: string): Promise<Nullable<Category>> {
        return axios
            .get(t('urls.categoryOne', { category }))
            .then((response: AxiosResponse<FG.Api.CategoryOneResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    return response.data;
                }
                return null;
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }

    function fetchThreads(category: string): Promise<MutatedThread[]> {
        console.log('Fetch Threads Now!');
        return axios
            .get(t('urls.threads', { category }))
            .then((response: AxiosResponse<FG.Api.ThreadsResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    const mutated = parseThreads(response.data.threads);
                    addMembers(response.data.users);
                    setThreads(mutated);
                    return mutated;
                }
                setThreads([]);
                return [];
            })
            .catch((err) => {
                console.error(err);
                setThreads([]);
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
                    addMembers(response.data.users);
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
        return new Promise((resolve, reject) => {
            return axios
                .get<FG.Api.UserHistoryResponse>(
                    t('urls.fetchThreadsByUser', { category, user })
                )
                .then((response) => {
                    if (response.status === 200) {
                        const mutated = parseThreads(response.data.threads);
                        addMembers(response.data.users);
                        if (cache) cacheThreads(mutated);
                        return mutated;
                    }
                    return [];
                })
                .catch((err) => {
                    console.error(err);
                    return [];
                });
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

    function fetchRole(category: string, role: string): Promise<RoleTag> {
        const promise = axios
            .get<FG.Api.RoleResponse>(t('urls.fetchRole', { category, role }))
            .then((response) => {
                if (response.status === 200 && response.data) {
                    return {
                        ...response.data,
                        color: response.data.color.toString(16),
                        exists: true,
                    };
                }
                return {
                    exists: false,
                    id: role,
                };
            });
        discordTagPromises[`role-${role}`] = promise;
        return promise;
    }

    function fetchChannel(category: string, channel: string): Promise<ChannelTag> {
        const promise = axios
            .get<FG.Api.ChannelResponse>(t('urls.fetchChannel', { category, channel }))
            .then((response) => {
                if (response.status === 200 && response.data) {
                    return {
                        ...response.data,
                        exists: true,
                    };
                }
                return {
                    exists: false,
                    id: channel,
                };
            });
        discordTagPromises[`channel-${channel}`] = promise;
        return promise;
    }

    /**
     * Checks the local Role store, if it exists, it returns it, otherwise,
     * we fetch it with fetchRole(category, role)
     * @param {string} category
     * @param {string} role
     * @returns Promise<RoleTag>
     */
    function getRole(category: string, role: string): Promise<RoleTag> {
        return new Promise((resolve) => {
            if (typeof discordTagPromises[`role-${role}`] !== 'undefined') {
                discordTagPromises[`role-${role}`].then((response) => {
                    resolve(response as RoleTag);
                });
                return;
            }
            const promise = fetchRole(category, role);
            discordTagPromises[`role-${role}`] = promise;
            promise.then((response) => {
                resolve(response);
            });
        });
    }

    /**
     * Checks the local Channel store, if it exists, it returns it, otherwise,
     * we fetch it with fetchChannel(category, channel)
     * @param {string} category
     * @param {string} channel
     * @returns Promise<ChannelTag>
     */
    function getChannel(category: string, channel: string): Promise<ChannelTag> {
        return new Promise((resolve) => {
            if (typeof discordTagPromises[`channel-${channel}`] !== 'undefined') {
                discordTagPromises[`channel-${channel}`].then((response) => {
                    resolve(response as ChannelTag);
                });
                return;
            }
            const promise = fetchChannel(category, channel);
            discordTagPromises[`channel-${channel}`] = promise;
            promise.then((response) => {
                resolve(response);
            });
        });
    }

    function resetThreads() {
        setThreads([]);
    }

    function resetCategories() {
        setCategories([]);
    }

    return {
        threads: {
            items: threads,
            fetch: fetchThreads,
            fetchOne: fetchOneThread,
            findById: findThreadById,
            fetchByUserId: fetchThreadsByUserId,
            reset: resetThreads,
        },
        categories: {
            items: categories,
            fetch: fetchCategories,
            fetchOne: fetchOneCategory,
            findById: findCategoryById,
            reset: resetCategories,
        },
        roles: {
            fetch: fetchRole,
            get: getRole,
        },
        channels: {
            fetch: fetchChannel,
            get: getChannel,
        },
    };
}

export function useNavigationState() {
    return createContainer(navigationState);
}

export default useNavigationState();
