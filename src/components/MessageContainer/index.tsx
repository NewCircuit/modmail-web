import React, { RefObject, useEffect, useRef } from 'react';
import { makeStyles, darken, lighten } from '@material-ui/core/styles';
import { Timeline } from '@material-ui/lab';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { MessageProps } from '../Message';
import { MutatedMessage } from '../../types';

type Props = {
    messages: MutatedMessage[];
    author?: string;
    pageRef?: RefObject<HTMLDivElement>;
    children: (child: MessageProps, index: number) => JSX.Element;
};

const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 'auto 0 0',
        // justifyContent: 'flex-end',
    },
    person0: { background: darken(theme.palette.background.paper, 0) },
    person1: { background: lighten(theme.palette.background.paper, 0.05) },
    person2: { background: lighten(theme.palette.background.paper, 0.1) },
    // person3: { background: darken('yellow', 0.5) },
    // person4: { background: darken('blue', 0.5) },
    // person5: { background: darken('cyan', 0.5) },
    // person6: { background: darken('orange', 0.5) },
    // person7: { background: darken('purple', 0.5) },
    // person8: { background: darken('pink', 0.5) },
    // person9: { background: darken('teal', 0.5) },
}));

type ColorMap = {
    [s: string]: any;
};

function MessageContainer(props: Props) {
    const { children, messages, pageRef, author } = props;
    const classes = useStyle();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const colorMap = useRef<ColorMap>({});

    useEffect(() => {
        if (pageRef?.current) {
            pageRef.current.scrollBy({
                top: pageRef.current.scrollHeight - window.innerHeight - 20,
            });
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
