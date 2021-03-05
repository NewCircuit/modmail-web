import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChannelTag, DiscordTagMap, NC } from '../types';
import { useAxios } from './index';
import { Logger } from '../util';
import { UserState } from '../state';

const logger = Logger.getLogger('useChannels');

type Props = {
    cache?: boolean;
};

const defaultProps = {
    cache: true,
};

export default function useChannels(props: Props = defaultProps): NC.State.ChannelsState {
    const { cache: universalCache } = props;
    const { t } = useTranslation();
    const { logout } = UserState.useContainer();
    const { axios } = useAxios();
    const { current: tags } = useRef<DiscordTagMap>({});

    function fetchChannel(
        category: string,
        channel: string,
        cache = universalCache as boolean
    ): Promise<ChannelTag> {
        logger.verbose(`fetch channel ${channel}`);
        const promise = axios
            .get<NC.Api.ChannelResponse>(t('urls.fetchChannel', { category, channel }))
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
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    logger.info('user got 401. no longer authenticated');
                    logout();
                }
                return {
                    exists: false,
                    id: channel,
                };
            });
        if (cache) tags[channel] = promise;
        return promise;
    }

    /**
     * Checks the local Channel store, if it exists, it returns it, otherwise,
     * we fetch it with fetchChannel(category, channel, cache
     * @param {string} category
     * @param {string} channel
     * @param {boolean} cache whether or not to store retrieved data or not for subsequent requests
     *                  if cache is false, we completely skip checking cache as well
     * @returns Promise<ChannelTag>
     */
    function getChannel(
        category: string,
        channel: string,
        cache = universalCache as boolean
    ): Promise<ChannelTag> {
        return new Promise((resolve) => {
            if (cache && typeof tags[channel] !== 'undefined') {
                tags[channel].then((response) => {
                    resolve(response as ChannelTag);
                });
                return;
            }
            const promise = fetchChannel(category, channel, cache);
            if (cache) tags[channel] = promise;
            promise.then((response) => {
                resolve(response);
            });
        });
    }

    return {
        channels: tags,
        fetch: fetchChannel,
        get: getChannel,
    };
}
