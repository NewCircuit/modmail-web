import axios from 'axios';
import { useRef } from 'react';
import { Semaphore } from 'async-mutex';
import { useTranslation } from 'react-i18next';
import { FG, MemberState, Nullable, UserMap } from '../types';

type Members = FG.State.MemberMap;

export default function useMembers(): FG.State.MembersState {
    const { t } = useTranslation();
    const userIndex = useRef(0);
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
                        index: ++userIndex.current,
                    };
                }
                console.log('Promise Executed');

                semaphore
                    .runExclusive(async () => {
                        const data = await axios.get<FG.Api.MemberResponse>(
                            t('urls.fetchMember', { member: id, category })
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

                fetchMember(category, id).then((response) => resolveMember(response));
            });
    }

    function addMembers(users: UserMap) {
        Object.keys(users).forEach((user) => {
            if (typeof members[user] === 'undefined') {
                members[user] = {
                    promise: Promise.resolve(users[user]),
                    id: users[user].id,
                    // eslint-disable-next-line no-plusplus
                    index: ++userIndex.current,
                };
            }
        });

        console.log(members);
    }

    return {
        members,
        cache: addMembers,
        fetch: fetchMember,
        get: getMember,
    };
}
