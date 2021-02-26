import React, { useEffect, useState } from 'react';
import { fade } from '@material-ui/core/styles';
import { Tooltip, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ParserProps } from '../../../hooks/useDiscordParser';
import { MemberState } from '../../../types';
import { FetchState, ModmailState } from '../../../state';
import { getNameFromMemberState, Logger } from '../../../util';
import { commonPopperProps } from '../index';

const logger = Logger.getLogger('Parser.DiscordUser');

type Props = ParserProps;

type UserExists = {
    status: FetchState.LOADED;
    data: MemberState;
};

type UserUndefined = {
    status: FetchState.EMPTY | FetchState.LOADING;
};

type UserState = UserExists | UserUndefined;

function DiscordUser(props: Props) {
    const { id, category } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const {
        members: { get },
    } = ModmailState.useContainer();
    const [user, setUser] = useState<UserState>({
        status: FetchState.EMPTY,
    });

    useEffect(() => {
        setUser({ status: FetchState.LOADING });
        get(category, id)().then((response) => {
            if (response) {
                setUser({
                    status: FetchState.LOADED,
                    data: response,
                });
            } else {
                logger.warn(`Message Parser failed to parse user id ${id}`);
                setUser({ status: FetchState.EMPTY });
            }
        });
    }, [id]);

    if (user.status === FetchState.LOADED) {
        return (
            <Tooltip
                PopperProps={commonPopperProps}
                arrow
                placement={'bottom-start'}
                title={t('tooltips.discord.foundUser', { id }) as string}
            >
                <span
                    style={{
                        cursor: 'pointer',
                        color: theme.palette.secondary.light,
                        fontWeight: 'bold',
                        padding: '0.05rem .1rem',
                    }}
                >
                    @{getNameFromMemberState(user.data)}
                </span>
            </Tooltip>
        );
    }

    return (
        <Tooltip
            PopperProps={commonPopperProps}
            arrow
            placement={'bottom-start'}
            title={t('tooltips.discord.emptyUser', { id }) as string}
        >
            <span
                style={{
                    fontWeight: 'bold',
                    color: fade(theme.palette.secondary.main, 0.75),
                }}
            >
                &lt;User #{id}&gt;
            </span>
        </Tooltip>
    );
}

export type DiscordUserProps = Props;
export default DiscordUser;
