import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import Breadcrumbs from '../Breadcrumbs';
import DrawerMenuSelector from '../DrawerMenuSelector';
import LocalizedBackdrop from '../../LocalizedBackdrop';
import DrawerFooter from '../DrawerFooter';

const CategoriesDrawer = React.lazy(() => import('../CategoriesDrawer'));
const ThreadsDrawer = React.lazy(() => import('../ThreadsDrawer'));

const drawers = [CategoriesDrawer, ThreadsDrawer];

const fallback = (
    <LocalizedBackdrop open>
        <CircularProgress />
    </LocalizedBackdrop>
);

export default function CommonDrawerItems() {
    const [tab, setTab] = React.useState(0);
    const { t } = useTranslation();
    const onChangeTab = (nextTab: number) => setTab(nextTab);
    const DrawerContainer = drawers[tab];

    return (
        <React.Fragment>
            <Breadcrumbs />
            <DrawerMenuSelector
                tab={tab}
                tabs={[t('drawer.tabs.categories'), t('drawer.tabs.threads')]}
                onChange={onChangeTab}
            />
            <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <React.Suspense fallback={fallback}>
                    <DrawerContainer />
                </React.Suspense>
            </div>
            <DrawerFooter />
        </React.Fragment>
    );
}
