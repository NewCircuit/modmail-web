import { useRef } from 'react';
import { Semaphore } from 'async-mutex';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { NC, MemberState, Nullable, UserMap } from '../types';
import { Logger } from '../util';
import { useAxios } from './index';
import { UserState } from '../state';

const logger = Logger.getLogger('useMembers');

type Members = NC.State.MemberMap;

export default function useMembers(): NC.State.MembersState {
    const { t } = useTranslation();
    const { logout } = UserState.useContainer();
    const { axios } = useAxios();
    const userIndex = useRef(0);
    const { current: semaphore } = useRef<Semaphore>(
        new Semaphore(t('maxConcurrentRequests') as never)
    );
    const { current: members } = useRef<Members>({});

    const fetchMember = (category: string, id: string) => {
        logger.verbose(`fetching member ${id}`);
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

                semaphore
                    .runExclusive(() => {
                        return axios.get<NC.Api.MemberResponse>(
                            t('urls.fetchMember', { member: id, category })
                        );
                    })
                    .then(({ data, status }) => resolve(status === 200 ? data : null))
                    .catch((err: AxiosError) => {
                        if (err.response && err.response.status === 401) {
                            logger.info('user got 401. no longer authenticated');
                            logout();
                        }
                        return null;
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
        logger.verbose(`get member ${id}`);
        return () =>
            new Promise((resolveMember, reject) => {
                if (members[id] && members[id].promise) {
                    members[id].promise
                        ?.then((r) => resolveMember(r))
                        .catch((err) => reject(err));
                    return;
                }

                fetchMember(category, id)
                    .then((response) => resolveMember(response))
                    .catch((err) => reject(err));
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
    }

    return {
        members,
        cache: addMembers,
        fetch: fetchMember,
        get: getMember,
    };
}
