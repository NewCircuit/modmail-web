import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar,
    darken,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import NotRepliedToIcon from '@material-ui/icons/AssignmentLateOutlined';
import RepliedToIcon from '@material-ui/icons/AssignmentTurnedIn';
import ExclamationIcon from '@material-ui/icons/ErrorOutline';
import QuestionIcon from '@material-ui/icons/HelpOutlineOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Thread } from 'modmail-types';
import { getTimestampFromSnowflake } from '../../util';

type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    thread?: Thread;
    full?: boolean;
    replied?: boolean;
    onClick?: (evt: React.SyntheticEvent<HTMLDivElement>, thread?: Thread) => never;
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
        marginBottom: '.25rem',
    },
    fullAvatar: {
        [theme.breakpoints.up('sm')]: {
            marginTop: '.5rem',
            width: 65,
            height: 65,
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
}));

function ThreadListItem(props: Props) {
    const { replied, thread, full, onClick, ...otherProps } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const RepliedIcon = replied ? RepliedToIcon : NotRepliedToIcon;
    const latestMessage =
        thread && thread?.messages?.length > 0 ? thread.messages[0] : undefined;
    const timestamp =
        getTimestampFromSnowflake(thread?.id)?.toFormat('MM/dd/yyyy hh:mm a') || 'N/A';

    const onHandleClick = (evt: React.SyntheticEvent<HTMLDivElement>) => {
        if (onClick) onClick(evt, thread);
    };

    return (
        <div className={classes.root} onClick={onHandleClick} {...otherProps}>
            <div
                className={clsx({
                    [classes.leftPanel]: !full,
                    [classes.fullLeftPanel]: full,
                })}
            >
                <Avatar
                    className={clsx(classes.avatar, {
                        [classes.fullAvatar]: full,
                    })}
                    variant={'circular'}
                    title={latestMessage?.sender}
                >
                    {latestMessage?.sender.substr(0, 2).toUpperCase()}
                </Avatar>
                {!full && isDesktop && (
                    <div className={classes.modifiers}>
                        <Tooltip
                            title={
                                t(
                                    `drawer.threadListItem.${replied ? 'replied' : 'new'}`
                                ) as string
                            }
                        >
                            <RepliedIcon
                                className={clsx(classes.modifier, {
                                    [classes.active]: !replied,
                                })}
                            />
                        </Tooltip>
                        <Tooltip title={t('drawer.threadListItem.important') as string}>
                            <ExclamationIcon className={clsx(classes.modifier)} />
                        </Tooltip>
                        <Tooltip title={t('drawer.threadListItem.question') as string}>
                            <QuestionIcon className={clsx(classes.modifier)} />
                        </Tooltip>
                    </div>
                )}
            </div>
            <div
                className={clsx({
                    [classes.rightPanel]: !full,
                    [classes.fullRightPanel]: full,
                })}
            >
                <div className={clsx(classes.panelContainer, classes.flex)}>
                    <Typography
                        className={clsx(classes.name, {
                            [classes.fullName]: full,
                        })}
                    >
                        {thread?.channel}
                    </Typography>
                    {!replied && (
                        <div className={classes.newModifier}>
                            <MailIcon />
                            <span style={{ marginLeft: '.25rem' }}>
                                {t('drawer.threadListItem.newLabel') as string}
                            </span>
                        </div>
                    )}
                </div>
                <div className={classes.panelContainer}>
                    <Typography className={classes.label}>
                        {t('drawer.threadListItem.respondedByLabel') as string}
                    </Typography>
                    <Typography className={classes.value}>
                        {latestMessage?.sender}
                    </Typography>
                </div>
                <div className={classes.panelContainer}>
                    <Typography className={classes.label}>
                        {t('drawer.threadListItem.createdDateLabel') as string}
                    </Typography>
                    <Typography className={classes.value}>{timestamp}</Typography>
                </div>
                {full && (
                    <div className={classes.panelContainer}>
                        <Tooltip
                            title={
                                t(
                                    `drawer.threadListItem.${replied ? 'replied' : 'new'}`
                                ) as string
                            }
                        >
                            <RepliedIcon
                                className={clsx(classes.fullModifier, {
                                    [classes.active]: !replied,
                                })}
                            />
                        </Tooltip>
                        <Tooltip title={t('drawer.threadListItem.important') as string}>
                            <ExclamationIcon className={clsx(classes.fullModifier)} />
                        </Tooltip>
                        <Tooltip title={t('drawer.threadListItem.question') as string}>
                            <QuestionIcon className={clsx(classes.fullModifier)} />
                        </Tooltip>
                    </div>
                )}
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
