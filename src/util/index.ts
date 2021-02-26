import { DateTime } from 'luxon';
import { MemberState } from '../types';

export { Logger as LoggerInstance, default as Logger } from './Logger';

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

export function handleQuerystring(path: string): { [s: string]: string } {
    const query = {};
    if (path.charAt(0) === '?') {
        path.substr(1)
            .split('&')
            .forEach((kvp) => {
                const parts = kvp.split('=');
                query[parts[0]] = typeof parts[1] === 'undefined' ? true : parts[1];
            });
    }
    return query;
}
