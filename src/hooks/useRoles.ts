import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { AxiosError } from 'axios';
import { useAxios } from './index';
import { DiscordTagMap, NC, RoleTag } from '../types';
import { Logger } from '../util';
import { UserState } from '../state';

const logger = Logger.getLogger('useRoles');

type Props = {
    cache?: boolean;
};

const defaultProps = {
    cache: true,
};

export default function useRoles(props: Props = defaultProps): NC.State.RolesState {
    const { cache: universalCache } = props;
    const { t } = useTranslation();
    const { logout } = UserState.useContainer();
    const { axios } = useAxios();
    const { current: tags } = useRef<DiscordTagMap>({});

    function fetchRole(
        category: string,
        role: string,
        cache = universalCache as boolean
    ): Promise<RoleTag> {
        logger.verbose(`fetch role ${role}`);
        const promise = axios
            .get<NC.Api.RoleResponse>(t('urls.fetchRole', { category, role }))
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
            })
            .catch((err: AxiosError) => {
                if (err.response && err.response.status === 401) {
                    logger.info('user got 401. no longer authenticated');
                    logout();
                }
                return { exists: false, id: role };
            });
        if (cache) tags[role] = promise;
        return promise;
    }

    /**
     * Checks the local Role store, if it exists, it returns it, otherwise,
     * we fetch it with fetchRole(category, role)
     * @param {string} category
     * @param {string} role
     * @param {boolean} cache whether or not to store retrieved data or not for subsequent requests
     *                  if cache is false, we completely skip checking cache as well
     * @returns Promise<RoleTag>
     */
    function getRole(
        category: string,
        role: string,
        cache = universalCache as boolean
    ): Promise<RoleTag> {
        return new Promise((resolve, reject) => {
            if (cache && typeof tags[role] !== 'undefined') {
                tags[role].then((response) => {
                    resolve(response as RoleTag);
                });
                return;
            }
            const promise = fetchRole(category, role);
            if (cache) tags[role] = promise;
            promise
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => reject(err));
        });
    }

    return {
        roles: tags,
        fetch: fetchRole,
        get: getRole,
    };
}
