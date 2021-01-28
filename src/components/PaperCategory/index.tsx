import React from 'react';
import { Avatar, lighten, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Category } from 'modmail-types';
import clsx from 'clsx';

type Props = {
    category: Category;
    className?: string;
    elevation?: number;
    onClick?: (evt: React.SyntheticEvent, category: Category) => void;
};

const useStyles = makeStyles((theme) => ({
    categoryRoot: {
        '&:hover,&:focus': {
            backgroundColor: lighten(theme.palette.background.paper, 0.05),
        },
        cursor: 'pointer',
        backgroundColor: lighten(theme.palette.background.paper, 0.2),
        transition: 'background-color .25s ease',
        padding: '1rem',
        display: 'flex',
    },
    left: {
        marginRight: '1rem',
    },
    avatar: {
        backgroundColor: lighten(theme.palette.background.paper, 0.3),
    },
    name: {
        marginBottom: 0,
    },
    p: {
        margin: 0,
    },
    active: {},
}));

function PaperCategory(props: Props) {
    const { category, className, onClick, elevation } = props;
    const classes = useStyles();

    const handleClick = (evt: React.SyntheticEvent<HTMLDivElement>) => {
        if (onClick) {
            onClick(evt, category);
        }
    };

    return (
        <Paper
            onClick={handleClick}
            elevation={elevation}
            className={clsx(classes.categoryRoot, className)}
        >
            <div className={classes.left}>
                <Avatar className={classes.avatar}>{category.emojiID}</Avatar>
            </div>
            <div>
                <Typography className={classes.name} variant={'h3'}>
                    {category.name}
                </Typography>
                <Typography
                    className={clsx({
                        [classes.active]: category.isActive,
                    })}
                    variant={'subtitle2'}
                >
                    This category is currently{' '}
                    <b>{category.isActive ? 'active' : 'inactive'}</b>
                </Typography>
            </div>
        </Paper>
    );
}

PaperCategory.defaultProps = {
    elevation: 2,
};

export default PaperCategory;
