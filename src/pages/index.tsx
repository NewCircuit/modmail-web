import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { UserState } from '../state';
import LocalizedBackdrop from '../components/LocalizedBackdrop';

const DashboardPage = React.lazy(() => import('./DashboardPage'));
const UnauthorizedPage = React.lazy(() => import('./UnauthorizedPage'));
const ThreadsPage = React.lazy(() => import('./ThreadsPage'));
const ThreadPage = React.lazy(() => import('./ThreadPage'));
const UserHistoryPage = React.lazy(() => import('./UserHistoryPage'));

export default function Pages(): JSX.Element {
    const { authenticated } = UserState.useContainer();

    const fallback = (
        <LocalizedBackdrop open>
            <CircularProgress variant={'indeterminate'} />
        </LocalizedBackdrop>
    );

    return (
        <Switch>
            <React.Suspense fallback={fallback}>
                <Route path={'/unauthorized'} component={UnauthorizedPage} />
                {authenticated && (
                    <React.Fragment>
                        <Route exact path={'/'} component={DashboardPage} />
                        <Route
                            exact
                            path={`/category/:categoryId/threads`}
                            component={ThreadsPage}
                        />
                        <Route
                            exact
                            path={`/category/:categoryId/threads/:threadId`}
                            component={ThreadPage}
                        />
                        <Route
                            exact
                            path={`/category/:categoryId/users/:userId/history`}
                            component={UserHistoryPage}
                        />
                    </React.Fragment>
                )}
            </React.Suspense>
        </Switch>
    );
}
