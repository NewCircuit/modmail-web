import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Skeleton,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@material-ui/lab';
import { Avatar, Paper, Typography } from '@material-ui/core';
import MarkdownView from 'react-showdown';
import { getNameFromMemberState, getTimestampFromSnowflake } from '../../util';
import { MemberState, MutatedMessage, Nullable } from '../../types';
import Async from '../Async';

type Props = MutatedMessage & {
    fetchMember?: (id?: string) => Promise<Nullable<MemberState>>;
    isDesktop?: boolean;
    isLastMessage?: boolean;
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
        flexGrow: 1,
        padding: '.5rem 1rem',

        '& p': {
            marginTop: 0,
            marginBottom: '.5rem',
        },
    },
    sender: {
        marginBottom: '.5rem',
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
        fetchMember,
    } = props;
    const classes = useStyle();
    const [fetching, setFetching] = useState(false);
    const [memberPromise, setMemberPromise] = useState<
        Nullable<Promise<Nullable<MemberState>>>
    >(null);

    const dateSent = getTimestampFromSnowflake(modmailID);
    const date = dateSent?.toFormat('MM/dd/yyyy');
    const time = dateSent?.toFormat('hh:mm a');

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
                    <TimelineContent className={classes.content}>
                        <Paper elevation={3} className={classes.paper}>
                            <div className={classes.sender}>
                                {member ? (
                                    <Typography variant={'body2'} style={{ margin: 0 }}>
                                        {getNameFromMemberState(member)}
                                    </Typography>
                                ) : (
                                    <Skeleton width={250} height={18} />
                                )}
                            </div>
                            <MarkdownView
                                flavor={'vanilla'}
                                markdown={content}
                                dangerouslySetInnerHTML
                                options={{
                                    emoji: true,
                                }}
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
