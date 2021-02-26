import React from 'react';
import { Avatar, Chip, lighten, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Category } from '@Floor-Gang/modmail-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type Props = {
    category: Category;
    className?: string;
    elevation?: number;
    onClick?: (evt: React.SyntheticEvent, category: Category) => void;
};

const useStyles = makeStyles((theme) => ({
    rootLink: {
        textDecoration: 'none',
    },
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
        marginBottom: '-.25rem',
    },
    description: {
        marginBottom: 0,
        fontSize: '1.25em',
    },
    p: {
        margin: 0,
    },
    chipContainer: {
        marginTop: '.5rem',
    },
    chip: {
        '&:not(:last-child)': {
            marginRight: '.25rem',
        },
        padding: '.25rem',
        boxShadow: theme.shadows[2],
    },
    chipActive: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
    },
    chipPrivate: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
    },
}));

function PaperCategory(props: Props) {
    const { t } = useTranslation();
    const { category, className, onClick, elevation } = props;
    const classes = useStyles();

    const handleClick = (evt: React.SyntheticEvent<HTMLLinkElement>) => {
        if (onClick) {
            onClick(evt, category);
        }
    };

    return (
        <Link
            className={classes.rootLink}
            onClick={handleClick as any}
            to={`/category/${category.id}/users/me/history`}
        >
            <Paper
                onClick={handleClick as any}
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
                    <Typography className={classes.description} variant={'subtitle1'}>
                        {category.description}
                    </Typography>
                    <div className={classes.chipContainer}>
                        <Tooltip
                            title={
                                t('tooltips.category.status', {
                                    category: category.name,
                                    status: category.isActive ? 'active' : 'inactive',
                                }) as string
                            }
                        >
                            <Chip
                                size={'small'}
                                className={clsx(classes.chip, {
                                    [classes.chipActive]: category.isActive,
                                })}
                                label={t(
                                    category.isActive ? 'chips.active' : 'chips.inactive'
                                )}
                            />
                        </Tooltip>
                        <Tooltip
                            title={
                                t(
                                    `tooltips.category.${
                                        category.isPrivate ? 'private' : 'public'
                                    }`,
                                    { category: category.name }
                                ) as string
                            }
                        >
                            <Chip
                                size={'small'}
                                className={clsx(classes.chip, {
                                    [classes.chipPrivate]: category.isPrivate,
                                })}
                                label={t(
                                    category.isPrivate ? 'chips.private' : 'chips.public'
                                )}
                            />
                        </Tooltip>
                    </div>
                </div>
            </Paper>
        </Link>
    );
}

PaperCategory.defaultProps = {
    elevation: 2,
};

export default PaperCategory;
