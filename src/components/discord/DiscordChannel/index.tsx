import React, { useEffect, useState } from 'react';
import { fade } from '@material-ui/core/styles';
import { Tooltip, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ParserProps } from '../../../hooks/useDiscordParser';
import { ChannelTag } from '../../../types';
import { FetchState, ModmailState } from '../../../state';
import { commonPopperProps } from '../index';
import { Logger } from '../../../util';

const logger = Logger.getLogger('Parser.DiscordChannel');

type Props = ParserProps;

type ChannelExists = {
    status: FetchState.LOADED;
    data: ChannelTag;
};

type ChannelUndefined = {
    status: FetchState.EMPTY | FetchState.LOADING;
};

type ChannelState = ChannelExists | ChannelUndefined;

function DiscordChannel(props: Props) {
    const { id, category } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const {
        channels: { get },
    } = ModmailState.useContainer();
    const [channel, setChannel] = useState<ChannelState>({
        status: FetchState.EMPTY,
    });

    useEffect(() => {
        setChannel({ status: FetchState.LOADING });
        get(category, id).then((response) => {
            setChannel({
                status: response.exists ? FetchState.LOADED : FetchState.EMPTY,
                data: response,
            });
            if (!response.exists) {
                logger.warn(`Message Parser failed to parse user id ${id}`);
            }
        });
    }, [id]);

    if (channel.status === FetchState.LOADED) {
        return (
            <Tooltip
                PopperProps={commonPopperProps}
                arrow
                placement={'bottom-start'}
                title={t('tooltips.discord.foundChannel', { id }) as string}
            >
                <span
                    style={{
                        color: theme.palette.secondary.light,
                        fontWeight: 'bold',
                        padding: '0.05rem .1rem',
                    }}
                >
                    @{channel.data.name}
                </span>
            </Tooltip>
        );
    }

    return (
        <Tooltip
            PopperProps={commonPopperProps}
            arrow
            placement={'bottom-start'}
            title={t('tooltips.discord.emptyChannel', { id }) as string}
        >
            <span
                style={{
                    fontWeight: 'bold',
                    color: fade(theme.palette.primary.main, 0.75),
                }}
            >
                &lt;Channel #{id}&gt;
            </span>
        </Tooltip>
    );
}

export type DiscordChannelProps = Props;
export default DiscordChannel;
