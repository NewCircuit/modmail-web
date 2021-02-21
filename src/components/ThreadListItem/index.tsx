import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar,
    darken,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import LockedIcon from '@material-ui/icons/Https';
import UnlockedIcon from '@material-ui/icons/NoEncryption';
import LoopIcon from '@material-ui/icons/Loop';
import CompleteIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@material-ui/lab';
import { getNameFromMemberState, getTimestampFromSnowflake } from '../../util';
import { MemberState, MutatedThread } from '../../types';
import Async from '../Async';

type DivElem = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

type Props = Omit<DivElem, 'onClick'> & {
    thread?: MutatedThread;
    full?: boolean;
    replied?: boolean;
    onClick?: (evt: React.SyntheticEvent<HTMLDivElement>, thread?: MutatedThread) => void;
};

const avatarDimensions = {
    mobile: 40,
    desktop: 65,
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        cursor: 'pointer',
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.5)}`,
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        padding: '.5rem',
        alignItems: 'center',
        flexGrow: 1,
        [theme.breakpoints.up('sm')]: {
            justifyContent: 'center',
        },
    },
    rightPanel: {
        padding: '.5rem .25rem',
        width: 200,
    },
    fullLeftPanel: {
        display: 'flex',
        flexDirection: 'column',
        padding: '.5rem',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {},
    },
    fullRightPanel: {
        padding: '.5rem',
        flexGrow: 1,
    },
    avatar: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.main}`,
        width: avatarDimensions.mobile,
        height: avatarDimensions.mobile,
        marginBottom: '.25rem',
    },
    fullAvatar: {
        [theme.breakpoints.up('sm')]: {
            marginTop: '.5rem',
            width: avatarDimensions.desktop,
            height: avatarDimensions.desktop,
            borderWidth: 4,
            fontSize: '2.5em',
        },
    },
    modifiers: {
        display: 'flex',
    },
    modifier: {
        opacity: 0.2,
        fontSize: '1.75em',
    },
    fullModifier: {
        opacity: 0.2,
        fontSize: '2em',
        marginRight: '.25rem',
    },
    active: {
        opacity: 1,
    },
    panelContainer: {
        marginBottom: '.25rem',
    },
    flex: {
        display: 'flex',
    },
    name: {
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: '1.3em',
        overflow: 'hidden',
        color: theme.palette.text.primary,
    },
    fullName: {
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.75em',
            margin: '.25rem 0',
        },
    },
    newModifier: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: theme.palette.success.dark,
    },
    label: {
        fontWeight: 'bold',
        fontSize: '.9em',
        lineHeight: '.9em',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden show',
        color: theme.palette.text.secondary,
    },
    value: {
        fontStyle: 'italic',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden show',
    },
    highlight: {
        opacity: 1,
        color: theme.palette.secondary.main,
    },
    spin: {
        animation: 'spin 2000ms infinite linear',
    },
}));

function ThreadListItem(props: Props) {
    const { replied, thread, full, onClick, ...otherProps } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const [authorState, setAuthorState] = useState<Promise<MemberState | null> | null>(
        null
    );
    const [
        lastResponseState,
        setLastResponseState,
    ] = useState<Promise<MemberState | null> | null>(null);

    const timestamp =
        getTimestampFromSnowflake(thread?.id)?.toFormat('MM/dd/yyyy hh:mm a') || 'N/A';

    const onHandleClick = (evt: React.SyntheticEvent<HTMLDivElement>) => {
        if (onClick) onClick(evt, thread);
    };

    useEffect(() => {
        if (thread && thread.author.data && authorState === null) {
            setAuthorState(thread.author.data());
        }
    }, [thread, thread?.author.data, authorState]);

    useEffect(() => {
        if (thread && thread.messages.length > 0 && lastResponseState === null) {
            setLastResponseState(thread.messages[0].sender.data());
        }
    }, [thread, thread?.messages, lastResponseState]);

    const modifiersBlock = (
        <div className={classes.modifiers}>
            <Tooltip
                title={
                    t(
                        `tooltips.thread.${thread?.isActive ? 'active' : 'inactive'}`
                    ) as string
                }
            >
                {thread?.isActive ? (
                    <LoopIcon
                        className={clsx(
                            classes.modifier,
                            classes.spin,
                            classes.highlight
                        )}
                    />
                ) : (
                    <CompleteIcon className={classes.modifier} />
                )}
            </Tooltip>

            <Tooltip
                title={
                    t(
                        `tooltips.thread.${thread?.isAdminOnly ? 'locked' : 'unlocked'}`
                    ) as string
                }
            >
                {thread?.isAdminOnly ? (
                    <LockedIcon className={classes.modifier} />
                ) : (
                    <UnlockedIcon className={classes.modifier} />
                )}
            </Tooltip>
        </div>
    );

    return (
        <div className={classes.root} onClick={onHandleClick} {...otherProps}>
            <div
                className={clsx({
                    [classes.leftPanel]: !full,
                    [classes.fullLeftPanel]: full,
                })}
            >
                <Async promise={authorState}>
                    {(author: MemberState | null) => (
                        <Avatar
                            className={clsx(classes.avatar, {
                                [classes.fullAvatar]: full,
                            })}
                            variant={'circular'}
                            src={author?.avatarURL}
                            title={getNameFromMemberState(author)}
                        >
                            {!author && (
                                <Skeleton
                                    variant={'circle'}
                                    height={
                                        avatarDimensions[
                                            isDesktop && full ? 'desktop' : 'mobile'
                                        ]
                                    }
                                    width={
                                        avatarDimensions[
                                            isDesktop && full ? 'desktop' : 'mobile'
                                        ]
                                    }
                                />
                            )}
                        </Avatar>
                    )}
                </Async>
                {!full && isDesktop && modifiersBlock}
            </div>
            <div
                className={clsx({
                    [classes.rightPanel]: !full,
                    [classes.fullRightPanel]: full,
                })}
            >
                <div className={clsx(classes.panelContainer, classes.flex)}>
                    <Async promise={authorState}>
                        {(author: MemberState | null) =>
                            author ? (
                                <Typography
                                    className={clsx(classes.name, {
                                        [classes.fullName]: full,
                                    })}
                                >
                                    {getNameFromMemberState(author)}
                                </Typography>
                            ) : (
                                <Skeleton
                                    height={isDesktop && full ? 29 : 24}
                                    width={'100%'}
                                />
                            )
                        }
                    </Async>
                </div>
                <div className={classes.panelContainer}>
                    <Typography className={classes.label}>
                        {t('threadListItem.respondedByLabel') as string}
                    </Typography>
                    <Async promise={lastResponseState}>
                        {(member) =>
                            member ? (
                                <Typography className={classes.value}>
                                    {getNameFromMemberState(member)}
                                </Typography>
                            ) : (
                                <Skeleton height={21} width={'100%'} />
                            )
                        }
                    </Async>
                </div>
                <div className={classes.panelContainer}>
                    <Typography className={classes.label}>
                        {t('threadListItem.createdDateLabel') as string}
                    </Typography>
                    <Typography className={classes.value}>{timestamp}</Typography>
                </div>
                {full && modifiersBlock}
            </div>
        </div>
    );
}

ThreadListItem.defaultProps = {
    replied: false,
    full: false,
    thread: {},
} as never;

export default ThreadListItem;
