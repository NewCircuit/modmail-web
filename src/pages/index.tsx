import React, { useEffect, useState } from 'react';
import { useLocation, Redirect, Switch, Route, useHistory } from 'react-router-dom';
import { UserState } from '../state';
import { unauthorizedRoutes } from './routes';
import UnauthorizedPage from './UnauthorizedPage';

export default function Pages() {
    const { authenticated } = UserState.useContainer();
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        console.log('Path Changed! ', location.pathname);
        if (authenticated) {
            // TODO
        } else if (
            unauthorizedRoutes.findIndex((k) => location.pathname?.indexOf(k) >= 0) === -1
        ) {
            history.push('/unauthorized');
        }
    }, [location.pathname]);

    return (
        <Switch>
            <Route exact path={'/unauthorized'} component={UnauthorizedPage} />
        </Switch>
    );
}
