import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import {
    Skeleton,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@material-ui/lab';
import { Avatar, Chip, darken, Paper, Typography } from '@material-ui/core';
import { Lock, DeleteForever, Create } from '@material-ui/icons';
import MarkdownView, { ShowdownExtension } from 'react-showdown';
import clsx from 'clsx';
import { getNameFromMemberState, getTimestampFromSnowflake } from '../../util';
import { MemberState, MutatedMessage, Nullable } from '../../types';
import Async from '../Async';
import { useDiscordParser } from '../../util/DiscordParser';
import { MembersState } from '../../state';

type Props = MutatedMessage & {
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
        overflowWrap: 'anywhere',
        flexGrow: 1,
        padding: '.5rem 1rem',

        '& p': {
            marginTop: 0,
            marginBottom: '.5rem',
        },
    },
    sender: {
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
    } = props;
    const classes = useStyle();
    const { getMember } = MembersState.useContainer();
    const [memberPromise, setMemberPromise] = useState<
        Nullable<Promise<Nullable<MemberState>>>
    >(null);
    const attachedMemberPromises = useRef<{
        [s: string]: Nullable<MemberState>;
    }>({});
    const discordParser = useDiscordParser();

    const dateSent = getTimestampFromSnowflake(modmailID);
    const date = dateSent?.toFormat('MM/dd/yyyy');
    const time = dateSent?.toFormat('hh:mm a');

    useEffect(() => {
        discordParser.attachExtensions([
            {
                pattern: /<:[a-z0-9]+:\d+>/gim,
                callback: (matched) => {
                    const parts = /<:[a-z0-9]+:(\d+)>/gim.exec(matched);
                    if (parts) {
                        const url = `https://cdn.discordapp.com/emojis/${parts[1]}.png`;
                        const size = 32;
                        return `<img src="${url}?size=${size}" height="${size}" />`;
                    }
                    return matched;
                },
            },
            {
                pattern: /<@!\d+>/gim,
                callback: (matched) => {
                    const parts = /<@!(\d+)>/gim.exec(matched);
                    if (parts) {
                        const member = attachedMemberPromises.current[parts[1]];
                        if (member) {
                            return `<span data-md-react data-id="${member.id}" class="${classes.mdUser}">${member.username}#${member.discriminator}</span>`;
                        }

                        const promise = getMember('cat', parts[1])();
                        if (promise) {
                            promise.then((message) => {
                                attachedMemberPromises.current[parts[1]] = message;
                                // setUpdater(updater + 1);
                            });
                        }
                        return matched;
                    }
                    return matched;
                },
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
            {(member) => (
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
                                    <Typography variant={'body2'} style={{ margin: 0 }}>
                                        {getNameFromMemberState(member)}
                                    </Typography>
                                ) : (
                                    <Skeleton width={250} height={18} />
                                )}
                                <div className={classes.badges}>
                                    {internal && (
                                        <Chip
                                            avatar={<Lock />}
                                            className={classes.internalChip}
                                            size={'small'}
                                            label={'Internal Message'}
                                        />
                                    )}
                                    {isDeleted && (
                                        <Chip
                                            avatar={<DeleteForever />}
                                            className={classes.deletedChip}
                                            size={'small'}
                                            label={'Deleted'}
                                        />
                                    )}
                                    {isCreator && (
                                        <Chip
                                            avatar={<Create />}
                                            className={classes.creatorChip}
                                            size={'small'}
                                            label={'Creator'}
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
