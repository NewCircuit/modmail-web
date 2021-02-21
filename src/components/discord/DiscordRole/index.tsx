import React, { useEffect, useState } from 'react';
import { fade } from '@material-ui/core/styles';
import { Tooltip, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ParserProps } from '../../../hooks/useDiscordParser';
import { RoleTag } from '../../../types';
import { FetchState, ModmailState } from '../../../state';
import { commonPopperProps } from '../index';

type Props = ParserProps;

type RoleExists = {
    status: FetchState.LOADED;
    data: RoleTag;
};

type RoleUndefined = {
    status: FetchState.EMPTY | FetchState.LOADING;
};

type RoleState = RoleExists | RoleUndefined;

function DiscordRole(props: Props) {
    const { id, category } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const {
        roles: { get },
    } = ModmailState.useContainer();
    const [role, setRole] = useState<RoleState>({
        status: FetchState.EMPTY,
    });

    useEffect(() => {
        setRole({ status: FetchState.LOADING });
        get(category, id).then((response) => {
            setRole({
                status: response.exists ? FetchState.LOADED : FetchState.EMPTY,
                data: response,
            });
        });
    }, [id]);

    if (role.status === FetchState.LOADED) {
        return (
            <Tooltip
                PopperProps={commonPopperProps}
                arrow
                title={t('tooltips.discord.foundRol', { id }) as string}
            >
                <span
                    style={{
                        color: role.data.color,
                    }}
                >
                    @{role.data.name}
                </span>
            </Tooltip>
        );
    }

    return (
        <Tooltip
            PopperProps={commonPopperProps}
            arrow
            title={t('tooltips.discord.emptyRole', { id }) as string}
        >
            <span
                style={{
                    fontWeight: 'bold',
                    color: fade(theme.palette.primary.main, 0.75),
                }}
            >
                &lt;Role #{id}&gt;
            </span>
        </Tooltip>
    );
}

export type DiscordRoleProps = Props;
export default DiscordRole;
