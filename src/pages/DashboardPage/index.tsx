import React, { useEffect } from 'react';
import {
    CircularProgress,
    Container,
    Grid,
    lighten,
    Paper,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Category } from 'modmail-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { NavigationState } from '../../state';
import PaperCategory from '../../components/PaperCategory';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';

const useStyles = makeStyles((theme) => ({
    categoryRoot: {
        position: 'relative',
        minHeight: 150,
    },
    alert: {
        margin: '1rem 1rem',
        padding: '.5rem',
    },
    colorPrimary: {
        backgroundColor: theme.palette.primary.dark,
    },
    link: {
        margin: '1rem 1rem 0 1rem',
    },
    divider: {
        // borderStyle: 'solid',
        borderColor: lighten(theme.palette.divider, 0),
        margin: '.15rem 1rem',
    },
}));

export default function DashboardPage() {
    const { t } = useTranslation('pages');
    const classes = useStyles();
    const { categories, threads } = NavigationState.useContainer();

    const isCategoriesLoaded = typeof categories.items !== 'undefined';
    const isCategoriesEmpty =
        typeof categories.items !== 'undefined' && categories.items.length === 0;

    useEffect(() => {
        console.log('DashboardPage');
    }, []);

    useEffect(() => {
        if (typeof categories.items === 'undefined') {
            categories.fetch();
        }
    }, [categories.items]);

    const onCategorySelected = (evt: React.SyntheticEvent, category: Category) => {
        console.log({ evt, category });
        threads.fetch(category.id);
    };

    const renderBody = () => {
        if (isCategoriesLoaded) {
            if (isCategoriesEmpty) {
                return (
                    <Grid xs={12} item>
                        <Paper className={clsx(classes.alert, classes.colorPrimary)}>
                            <Typography variant={'h2'}>
                                {t('dashboard.category.noItemsTitle')}
                            </Typography>
                            <Typography variant={'subtitle1'}>
                                {t('dashboard.category.noItemsDesc')}
                            </Typography>
                        </Paper>
                    </Grid>
                );
            }
            return categories.items?.map((category) => (
                <Grid key={category.id} item xs={12} md={6}>
                    <PaperCategory
                        onClick={onCategorySelected}
                        className={classes.link}
                        category={category}
                    />
                </Grid>
            ));
        }

        return (
            <div>
                <LocalizedBackdrop open>
                    <CircularProgress />
                </LocalizedBackdrop>
            </div>
        );
        return (
            <Grid item sm={12}>
                Loading...
            </Grid>
        );
    };

    return (
        <Container maxWidth={'xl'} disableGutters>
            <div className={classes.categoryRoot}>
                <Grid container>
                    <Grid xs={12} item component={Paper} className={classes.alert}>
                        <Typography variant={'h2'}>
                            {t('dashboard.category.title')}
                        </Typography>
                    </Grid>
                </Grid>
                <hr className={classes.divider} />
                <Grid container>{renderBody()}</Grid>
            </div>
        </Container>
    );
}
