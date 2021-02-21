import React, { RefObject, useEffect, useState } from 'react';
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
import { Avatar, Chip, darken, Paper, Tooltip, Typography } from '@material-ui/core';
import { Lock, DeleteForever, Create } from '@material-ui/icons';
import MarkdownView, { ShowdownExtension } from '@demitchell14/react-showdown';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { getNameFromMemberState, getTimestampFromSnowflake, Logger } from '../../util';
import { MemberState, MutatedMessage, Nullable } from '../../types';
import Async from '../Async';
import { useDiscordParser } from '../../hooks';

const logger = Logger.getLogger('Message');

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
}));

function Message(props: Props) {
    const {
        internal,
        content,
        isDeleted,
        modmailID,
        sender,
        isDesktop,
        isLastMessage,
        bodyStyle,
        isCreator,
        category,
    } = props;
    const { t, i18n } = useTranslation();
    const classes = useStyle();
    const [memberPromise, setMemberPromise] = useState<
        Nullable<Promise<Nullable<MemberState>>>
    >(null);
    const discordParser = useDiscordParser({
        components: ['DiscordRole', 'DiscordChannel', 'DiscordUser'],
        extensions: [
            {
                type: 'lang',
                regex: /<@&(\d+)>/,
                replace: `<DiscordRole category="${category}" id="$1" />`,
            },
            {
                type: 'lang',
                regex: /<#(\d+)>/,
                replace: `<DiscordChannel category="${category}" id="$1" />`,
            },
            {
                type: 'lang',
                regex: /<@!?(\d+)>/,
                replace: `<DiscordUser category="${category}" id="$1" />`,
            },
            {
                type: 'lang',
                regex: /<:[a-z0-9]+:(\d+)>/i,
                replace: `<img src="https://cdn.discordapp.com/emojis/$1.png" height="32" />`,
            },
        ],
    });
    const currentRef: RefObject<HTMLDivElement> = React.createRef();

    const dateSent = getTimestampFromSnowflake(modmailID);
    const date = dateSent?.toFormat('MM/dd/yyyy');
    const time = dateSent?.toFormat('hh:mm a');

    useEffect(() => {
        if (sender && sender.data && memberPromise === null) {
            setMemberPromise(sender.data());
        }
    }, [sender, memberPromise]);

    useEffect(() => {
        if (isLastMessage && currentRef.current) {
            // hack to scroll to last message
            const container = document.querySelector('#main-container');
            if (container) {
                container.scrollTo({
                    top:
                        currentRef.current.getBoundingClientRect().top -
                        window.innerHeight +
                        300,
                });
            }
        }
    }, []);

    const onGoToHistory = (id) => logger.verbose(`redirecting to user history ${id}`);

    return (
        <Async promise={memberPromise}>
            {(member: Nullable<MemberState>) => (
                <TimelineItem
                    ref={currentRef}
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
                                                i18nKey={'tooltips.message.name'}
                                            />
                                        }
                                    >
                                        <Link
                                            onClick={() => onGoToHistory(member.id)}
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
                                            label={t('chips.internal')}
                                        />
                                    )}
                                    {isDeleted && (
                                        <Chip
                                            avatar={<DeleteForever />}
                                            className={classes.deletedChip}
                                            size={'small'}
                                            label={t('chips.deleted')}
                                        />
                                    )}
                                    {isCreator && (
                                        <Chip
                                            avatar={<Create />}
                                            className={classes.creatorChip}
                                            size={'small'}
                                            label={t('chips.creator')}
                                        />
                                    )}
                                </div>
                            </div>
                            <MarkdownView
                                extensions={discordParser.extensions}
                                components={discordParser.components}
                                markdown={content}
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
