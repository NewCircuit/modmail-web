import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Action = {
    render: JSX.Element | string;
    onClick?: (evt: React.SyntheticEvent<HTMLButtonElement>) => unknown;
    href?: string;
    className?: string;
};

type Props = {
    actions?: Action[];
    className?: string;
};

const useStyle = makeStyles(() => ({
    title: {
        padding: '.5rem 1rem',
    },
    action: {
        justifyContent: 'start',
    },
}));

function UserHistoryActions(props: Props) {
    const { actions } = props;
    const { t } = useTranslation();
    const classes = useStyle();
    const history = useHistory();

    function onClick(this: Action, evt: React.SyntheticEvent<HTMLButtonElement>) {
        if (this.onClick) this.onClick(evt);
        else {
            evt.preventDefault();
            if (this.href) {
                history.push(this.href);
            }
        }
    }

    return (
        <Paper className={props.className}>
            <Typography className={classes.title} variant={'h2'}>
                {t('userHistory.actions.title')}
            </Typography>
            <ButtonGroup fullWidth orientation={'vertical'}>
                {actions?.map((action, idx) => (
                    <Button
                        key={idx}
                        className={clsx(classes.action, action.className)}
                        href={action.href}
                        onClick={onClick.bind(action)}
                    >
                        {action.render}
                    </Button>
                ))}
            </ButtonGroup>
        </Paper>
    );
}

export type UserHistoryActionsProps = Props;
export type UserHistoryAction = Action;
export default UserHistoryActions;
