import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@material-ui/lab';
import { Avatar, Paper, Typography } from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { Message as ModmailMessage } from 'modmail-types';
import MarkdownView from 'react-showdown';
import { getTimestampFromSnowflake } from '../../util';

type Props = ModmailMessage & {
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
        marginBottom: '1rem',
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
    } = props;
    const classes = useStyle();

    const dateSent = getTimestampFromSnowflake(modmailID);
    const date = dateSent?.toFormat('MM/dd/yyyy');
    const time = dateSent?.toFormat('hh:mm a');

    console.log(props);
    return (
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
                    <Avatar className={classes.avatar}>
                        {sender.substr(0, 2).toUpperCase()}
                    </Avatar>
                </TimelineDot>
                {!isLastMessage && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent className={classes.content}>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant={'body2'} className={classes.sender}>
                        {sender}
                    </Typography>
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
    );
}

export type MessageProps = Props;
export default Message;
