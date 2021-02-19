import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, lighten, fade } from '@material-ui/core/styles';
import {
    Skeleton,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@material-ui/lab';
import { Avatar, Chip, darken, Paper, Tooltip, Typography } from '@material-ui/core';
import { Lock, DeleteForever, Create } from '@material-ui/icons';
import MarkdownView, { ShowdownExtension } from 'react-showdown';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChannelState, RoleState } from '@Floor-Gang/modmail-types';
import { Trans, useTranslation } from 'react-i18next';
import { getNameFromMemberState, getTimestampFromSnowflake } from '../../util';
import {
    ChannelTag,
    DiscordTag,
    MemberState,
    MutatedMessage,
    Nullable,
    RoleTag,
} from '../../types';
import Async from '../Async';
import { useDiscordParser } from '../../util/DiscordParser';
import { MembersState, ModmailState } from '../../state';

type Props = MutatedMessage & {
    category?: string;
    extensions?: ShowdownExtension[];
    isDesktop?: boolean;
    isLastMessage?: boolean;
    isCreator?: boolean;
    bodyStyle?: any;
};

const useStyle = makeStyles((theme) => ({
    paper: {
        padding: '.5rem',
    },
    missingOppositeContent: {
        '&:before': {
            padding: 0,
            flex: 0,
        },
    },
    oppositeContent: {
        flexGrow: 0.15,
        padding: '.5rem 1rem',
    },
    content: {
        wordBreak: 'break-word',
        flexGrow: 1,
        padding: '.5rem 1rem',

        '& p': {
            marginTop: 0,
            marginBottom: '.5rem',
        },
    },
    sender: {
        '& a': { textDecoration: 'none' },
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '.5rem',
        },
    },
    badges: {
        '&:not(:empty)': {
            marginTop: '.5rem',
            [theme.breakpoints.up('sm')]: {
                marginTop: 0,
                marginLeft: 'auto',
            },
            '& div': {
                margin: '.15rem .25rem',
            },
        },
    },
    internalChip: {
        background: lighten(theme.palette.background.paper, 0.6),
        '& svg, & span': {
            fill: lighten(theme.palette.background.paper, 0.1),
            color: lighten(theme.palette.background.paper, 0.1),
        },
    },
    deletedChip: {
        background: darken(theme.palette.error.dark, 0.3),
        '& svg, & span': {
            fill: lighten(theme.palette.background.paper, 0.9),
            color: lighten(theme.palette.background.paper, 0.9),
        },
    },
    creatorChip: {
        background: lighten(theme.palette.background.paper, 0.15),
        '& svg, & span': {
            fill: lighten(theme.palette.background.paper, 0.9),
            color: lighten(theme.palette.background.paper, 0.9),
        },
    },
    mobileDate: {
        margin: '0 !important',
        textAlign: 'right',
    },
    timelineDot: {
        padding: 0,
        background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
    },
    avatar: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.main}`,
        boxShadow: theme.shadows[3],
    },
    mdUser: {
        background: 'grey',
        fontWeight: 'bold',
        padding: '0.05rem .1rem',
    },
    mdRole: {
        fontWeight: 'bold',
        padding: '0.05rem .1rem',
    },
    mdChannel: {
        color: '#7289da',
        fontWeight: 'bold',
        padding: '0.05rem .1rem',
    },
    mdNotExists: {
        color: fade('#f00', 0.5),
    },
}));

function Message(props: Props) {
    const {
        internal,
        clientID,
        content,
        edits,
        files,
        isDeleted,
        modmailID,
        sender,
        threadID,
        isDesktop,
        isLastMessage,
        bodyStyle,
        isCreator,
        category,
    } = props;
    const { t, i18n } = useTranslation();
    const classes = useStyle();
    const {
        roles: { get: fetchRole },
        channels: { get: fetchChannel },
        members: { get: getMember },
    } = ModmailState.useContainer();
    const [memberPromise, setMemberPromise] = useState<
        Nullable<Promise<Nullable<MemberState>>>
    >(null);
    const attachedMemberPromises = useRef<{
        [s: string]: Nullable<MemberState>;
    }>({});
    const attachedDiscordPromises = useRef<{
        [s: string]: DiscordTag;
    }>({});
    const [hack, setHack] = useState(0);
    const discordParser = useDiscordParser();

    const dateSent = getTimestampFromSnowflake(modmailID);
    const date = dateSent?.toFormat('MM/dd/yyyy');
    const time = dateSent?.toFormat('hh:mm a');

    const imageParser = React.useCallback((matched) => {
        const parts = /<:[a-z0-9]+:(\d+)>/gim.exec(matched);
        if (parts) {
            const url = `https://cdn.discordapp.com/emojis/${parts[1]}.png`;
            const size = 32;
            return `<img src="${url}?size=${size}" height="${size}" />`;
        }
        return matched;
    }, []);

    const memberParser = React.useCallback(
        (matched) => {
            const parts = /<@!?(\d+)>/gim.exec(matched);
            if (parts) {
                const currentMember = attachedMemberPromises.current[parts[1]];
                if (currentMember) {
                    return `<span data-id="${currentMember.id}" class="${classes.mdUser}">${currentMember.username}#${currentMember.discriminator}</span>`;
                }

                const promise = getMember(category || '', parts[1])();
                if (promise) {
                    promise.then((member) => {
                        setHack((n) => n + 1);
                        attachedMemberPromises.current[parts[1]] = member;
                    });
                }
                return matched;
            }
            return matched;
        },
        [attachedMemberPromises, category, getMember, hack]
    );

    const roleParser = React.useCallback(
        (matched) => {
            const parts = /<@&(\d+)>/gim.exec(matched);
            if (parts) {
                const currentRole = attachedDiscordPromises.current[parts[1]] as RoleTag;
                console.log({ currentRole });
                if (currentRole) {
                    let body = t('message.unknownRole', { role: currentRole.id });
                    let style = '';
                    if (currentRole.exists) {
                        style = `color: #${currentRole.color}`;
                        body = `@${currentRole.name}`;
                    }
                    return `<span style="${style}" class="${clsx(classes.mdRole, {
                        [classes.mdNotExists]: !currentRole.exists,
                    })}" data-id="${currentRole.id}">${body}</span>`;
                }
                if (category) {
                    const promise = fetchRole(category, parts[1]);
                    if (promise) {
                        promise.then((role) => {
                            attachedDiscordPromises.current[parts[1]] = role;
                            setHack((n) => n + 1);
                        });
                    }
                }
            }
            return matched;
        },
        [attachedDiscordPromises, category, getMember, hack]
    );

    const channelParser = React.useCallback(
        (matched) => {
            const parts = /<#(\d+)>/gim.exec(matched);
            if (parts) {
                const currentChannel = attachedDiscordPromises.current[
                    parts[1]
                ] as ChannelTag;
                console.log({ currentChannel });
                if (currentChannel) {
                    let body = t('message.unknownChannel', {
                        channel: currentChannel.id,
                    });
                    if (currentChannel.exists) {
                        body = `#${currentChannel.name}`;
                    }
                    return `<span class="${clsx(classes.mdChannel, {
                        [classes.mdNotExists]: !currentChannel.exists,
                    })}" data-id="${currentChannel.id}">${body}</span>`;
                }
                if (category) {
                    const promise = fetchChannel(category, parts[1]);
                    if (promise) {
                        promise.then((channel) => {
                            attachedDiscordPromises.current[parts[1]] = channel;
                            setHack((n) => n + 1);
                        });
                    }
                }
            }
            return matched;
        },
        [attachedDiscordPromises, category, getMember, hack]
    );

    useEffect(() => {
        discordParser.attachExtensions([
            {
                pattern: /<:[a-z0-9]+:\d+>/gim,
                callback: imageParser,
            },
            {
                pattern: /<@!?\d+>/gim,
                callback: memberParser,
            },
            {
                pattern: /<@&\d+>/gim,
                callback: roleParser,
            },
            {
                pattern: /<#\d+>/gim,
                callback: channelParser,
            },
        ]);
    }, []);

    useEffect(() => {
        if (sender && sender.data && memberPromise === null) {
            setMemberPromise(sender.data());
        }
    }, [sender, memberPromise]);

    return (
        <Async promise={memberPromise}>
            {(member: Nullable<MemberState>) => (
                <TimelineItem
                    classes={{
                        missingOppositeContent: classes.missingOppositeContent,
                    }}
                >
                    {isDesktop && (
                        <TimelineOppositeContent className={classes.oppositeContent}>
                            <Typography variant="body2" color="textSecondary">
                                {date}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {time}
                            </Typography>
                        </TimelineOppositeContent>
                    )}
                    <TimelineSeparator>
                        <TimelineDot className={classes.timelineDot}>
                            <Avatar className={classes.avatar} src={member?.avatarURL}>
                                {!member && (
                                    <Skeleton variant={'circle'} height={40} width={40} />
                                )}
                            </Avatar>
                        </TimelineDot>
                        {!isLastMessage && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent className={clsx(classes.content)}>
                        <Paper
                            elevation={3}
                            className={clsx(classes.paper)}
                            style={bodyStyle}
                        >
                            <div className={classes.sender}>
                                {member ? (
                                    <Tooltip
                                        arrow
                                        placement={'right'}
                                        title={
                                            <Trans
                                                i18n={i18n}
                                                tOptions={{
                                                    user: getNameFromMemberState(member),
                                                }}
                                                i18nKey={'message.nameTooltip'}
                                            />
                                        }
                                    >
                                        <Link
                                            to={`/category/${category}/users/${member.id}/history`}
                                        >
                                            <Typography
                                                variant={'body2'}
                                                style={{ margin: 0 }}
                                            >
                                                {getNameFromMemberState(member)}
                                            </Typography>
                                        </Link>
                                    </Tooltip>
                                ) : (
                                    <Skeleton width={250} height={18} />
                                )}
                                <div className={classes.badges}>
                                    {internal && (
                                        <Chip
                                            avatar={<Lock />}
                                            className={classes.internalChip}
                                            size={'small'}
                                            label={t('message.chips.internal')}
                                        />
                                    )}
                                    {isDeleted && (
                                        <Chip
                                            avatar={<DeleteForever />}
                                            className={classes.deletedChip}
                                            size={'small'}
                                            label={t('message.chips.deleted')}
                                        />
                                    )}
                                    {isCreator && (
                                        <Chip
                                            avatar={<Create />}
                                            className={classes.creatorChip}
                                            size={'small'}
                                            label={t('message.chips.creator')}
                                        />
                                    )}
                                </div>
                            </div>
                            <MarkdownView
                                extensions={discordParser.extensions}
                                // extensions={discord.getExtensions()}
                                markdown={content}
                                dangerouslySetInnerHTML
                            />

                            {!isDesktop && (
                                <Typography
                                    className={classes.mobileDate}
                                    variant={'body2'}
                                    color={'textSecondary'}
                                >
                                    {date} {time}
                                </Typography>
                            )}
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            )}
        </Async>
    );
}

export type MessageProps = Props;
export default Message;
