import React, { useEffect } from 'react';
import { useLocation, Switch, Route, useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { UserState } from '../state';
import LocalizedBackdrop from '../components/LocalizedBackdrop';

const DashboardPage = React.lazy(() => import('./DashboardPage'));
const UnauthorizedPage = React.lazy(() => import('./UnauthorizedPage'));
const OAuthPage = React.lazy(() => import('./OAuthPage'));
const ThreadsPage = React.lazy(() => import('./ThreadsPage'));
const ThreadPage = React.lazy(() => import('./ThreadPage'));

export default function Pages(): JSX.Element {
    const { authenticated } = UserState.useContainer();
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        console.log('Path Changed! ', location.pathname);
        if (typeof authenticated === 'boolean' && !authenticated)
            history.push('/unauthorized');
    }, [location.pathname]);

    const fallback = (
        <LocalizedBackdrop open>
            <CircularProgress variant={'indeterminate'} />
        </LocalizedBackdrop>
    );

    return (
        <Switch>
            <React.Suspense fallback={fallback}>
                <Route exact path={'/unauthorized'} component={UnauthorizedPage} />
                <Route exact path={'/oauth/callback'} component={OAuthPage} />
                {authenticated && (
                    <React.Fragment>
                        <Route exact path={'/'} component={DashboardPage} />
                        <Route
                            exact
                            path={`/category/:categoryId`}
                            component={ThreadsPage}
                        />
                        <Route
                            exact
                            path={`/category/:categoryId/:threadId`}
                            component={ThreadPage}
                        />
                    </React.Fragment>
                )}
            </React.Suspense>
        </Switch>
    );
}
