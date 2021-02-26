import React, { RefObject, useEffect, useRef } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { Timeline } from '@material-ui/lab';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { MessageProps } from '../Message';
import { MutatedMessage } from '../../types';

type Props = {
    messages: MutatedMessage[];
    category?: string;
    author?: string;
    pageRef?: RefObject<HTMLDivElement>;
    children: (child: MessageProps, index: number) => JSX.Element;
};

const useStyle = makeStyles(() => ({
    root: {
        flexGrow: 1,
        margin: 'auto 0 0',
    },
}));

type ColorMap = {
    [s: string]: any;
};

function MessageContainer(props: Props) {
    const { children, messages, pageRef, author, category } = props;
    const classes = useStyle();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const colorMap = useRef<ColorMap>({});

    useEffect(() => {
        if (pageRef?.current) {
            colorMap.current = {};
        }
    }, [messages]);

    return (
        <Timeline className={classes.root} align={'left'}>
            {messages.map((message, index) => {
                const style = (() => {
                    if (colorMap.current[message.sender.id])
                        return colorMap.current[message.sender.id];
                    const total = Object.keys(colorMap.current).length;
                    colorMap.current[message.sender.id] = {
                        background: lighten(
                            theme.palette.background.paper,
                            total > 3 ? total * 0.025 : total * 0.05
                        ),
                    };
                    return colorMap.current[message.sender.id];
                })();
                return children(
                    {
                        ...message,
                        category,
                        isDesktop,
                        bodyStyle: style,
                        isCreator: message.sender.id === author,
                        isLastMessage: messages.length - 1 === index,
                    },
                    index
                );
            })}
        </Timeline>
    );
}

export type MessageContainerProps = Props;
export default MessageContainer;
