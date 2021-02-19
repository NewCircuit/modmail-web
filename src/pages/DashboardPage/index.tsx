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
import { useHistory } from 'react-router-dom';
import { Category } from '@Floor-Gang/modmail-types';
import { useTranslation } from 'react-i18next';
import { ModmailState } from '../../state';
import PaperCategory from '../../components/PaperCategory';
import LocalizedBackdrop from '../../components/LocalizedBackdrop';
import Alert from '../../components/Alert';

const useStyles = makeStyles((theme) => ({
    categoryRoot: {
        position: 'relative',
        minHeight: 150,
    },
    title: {
        margin: '1rem 1rem 0',
        padding: '.5rem',
    },
    alert: {
        margin: '.5rem 1rem',
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

export default function DashboardPage(): JSX.Element {
    const { t } = useTranslation();
    const { categories } = ModmailState.useContainer();
    const classes = useStyles();
    const history = useHistory();

    const isCategoriesLoaded = typeof categories.items !== 'undefined';
    const isCategoriesEmpty =
        typeof categories.items !== 'undefined' && categories.items.length === 0;

    useEffect(() => {
        console.log('DashboardPage');
    }, []);

    useEffect(() => {
        console.log({ items: categories.items });
        if (typeof categories.items === 'undefined') {
            categories.fetch().then((r) => console.log(r));
        }
    }, [categories]);

    const onCategorySelected = (evt: React.SyntheticEvent, category: Category) => {
        console.log({ evt, category });
        history.push(`/category/${category.id}/users/me/history`);
    };

    const renderGridItems = () => {
        if (isCategoriesLoaded) {
            if (isCategoriesEmpty) {
                return (
                    <Grid xs={12} item>
                        <Alert
                            className={classes.alert}
                            color={'error'}
                            alertTitle={t('dashboard.category.noItemsTitle')}
                            alertDesc={t('dashboard.category.noItemsDesc')}
                        />
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
    };

    return (
        <Container maxWidth={'xl'} disableGutters>
            <div className={classes.categoryRoot}>
                <Grid container>
                    <Grid xs={12} item component={Paper} className={classes.title}>
                        <Typography variant={'h2'}>
                            {t('dashboard.category.title')}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>{renderGridItems()}</Grid>
            </div>
        </Container>
    );
}
