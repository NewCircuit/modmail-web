import { useState, useRef } from 'react';
import { FG, MemberState, Nullable, UserMap } from 'types';
import { createContainer } from 'unstated-next';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { Semaphore } from 'async-mutex';
import { UserState } from './index';

type State = FG.State.MembersState;

type Members = FG.State.MemberMap;

let num = 0;
function membersState(): State {
    const { t } = useTranslation();
    const { token } = UserState.useContainer();
    const { current: semaphore } = useRef<Semaphore>(new Semaphore(1));
    const { current: members } = useRef<Members>({});

    const fetchMember = (category: string, id: string) => {
        let promise: Promise<Nullable<MemberState>>;
        if (typeof members[id] !== 'undefined' && members[id].promise) {
            promise = members[id].promise as Promise<Nullable<MemberState>>;
        } else {
            promise = new Promise((resolve) => {
                if (typeof members[id] === 'undefined') {
                    members[id] = {
                        id,
                        category,
                        // eslint-disable-next-line no-plusplus
                        index: ++num,
                    };
                }
                console.log('Promise Executed');

                semaphore
                    .runExclusive(async () => {
                        const data = await axios.get<FG.Api.MemberResponse>(
                            t('urls.fetchMember', { member: id, category }),
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        return data;
                    })
                    .then((response) => {
                        resolve(response.data);
                    });
            });
            members[id].promise = promise;
        }
        return promise;
    };

    function getMember(
        category: string,
        id: string
    ): () => Promise<Nullable<MemberState>> {
        return () =>
            new Promise((resolveMember) => {
                if (members[id] && members[id].promise) {
                    members[id].promise?.then((r) => resolveMember(r));
                    return;
                }

                fetchMember(id, category).then((response) => resolveMember(response));
            });
    }

    function addMembers(users: UserMap) {
        Object.keys(users).forEach((user) => {
            if (typeof members[user] === 'undefined') {
                members[user] = {
                    promise: Promise.resolve(users[user]),
                    id: users[user].id,
                    // eslint-disable-next-line no-plusplus
                    index: ++num,
                };
            }
        });

        console.log(members);
    }

    return {
        members,
        getMember,
        fetchMember,
        addMembers,
    };
}

export function useMembersState() {
    return createContainer(membersState);
}

export default useMembersState();
