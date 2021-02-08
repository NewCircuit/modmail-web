import React, { ComponentType, RefObject, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Timeline } from '@material-ui/lab';
import { Message as ModmailMessage } from 'modmail-types';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { MessageProps } from '../Message';
import { MutatedMessage } from '../../types';

type Props = {
    messages: MutatedMessage[];
    pageRef?: RefObject<HTMLDivElement>;
    children: (child: MessageProps, index: number) => JSX.Element;
};

const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 'auto 0 0',
        justifyContent: 'flex-end',
    },
}));

function MessageContainer(props: Props) {
    const { children, messages, pageRef } = props;
    const classes = useStyle();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    useEffect(() => {
        if (pageRef?.current) {
            pageRef.current.scrollBy({ top: pageRef.current.scrollHeight });
        }
    }, [messages]);

    return (
        <Timeline className={classes.root} align={'left'}>
            {messages.map((message, index) =>
                children(
                    {
                        ...message,
                        isDesktop,
                        isLastMessage: messages.length - 1 === index,
                    },
                    index
                )
            )}
        </Timeline>
    );
}

export type MessageContainerProps = Props;
export default MessageContainer;
