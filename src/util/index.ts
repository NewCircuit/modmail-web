import { DateTime } from 'luxon';
import { MemberState } from '../types';
import * as DiscordParser from './DiscordParser';

export function getTimestampFromSnowflake(snowflake = '0'): DateTime | undefined {
    const snowflakeAsNumber = Number.parseInt(snowflake, 10) || 0;
    return DateTime.fromMillis(snowflakeAsNumber / 4194304 + 1420070400000);
}

export function getNameFromMemberState(member?: MemberState | null) {
    if (member) {
        return `${member.username}#${member.discriminator}`;
    }
    return '';
}

export const { useDiscordParser } = DiscordParser;
export const discord = {
    getExtensions: DiscordParser.getExtensions,
    extensions: DiscordParser.extensions,
};
