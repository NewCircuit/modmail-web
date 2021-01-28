import { DateTime } from 'luxon';

export function getTimestampFromSnowflake(snowflake = '0'): DateTime | undefined {
    const snowflakeAsNumber = Number.parseInt(snowflake, 10) || 0;
    return DateTime.fromMillis(snowflakeAsNumber / 4194304 + 1420070400000);
}
