import React, { RefObject, useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import './theme/scss/global.scss';
import { Router } from 'react-router-dom';
import { CircularProgress, CssBaseline } from '@material-ui/core';
import Authenticator from 'components/Authenticator';
import { GlobalConfiguration } from 'react-showdown';
import theme from './theme';
import LayoutHOC, { Layout } from './components/Layout';
import Pages from './pages';
import { UserState, NavigationState, MembersState } from './state';
import LocalizedBackdrop from './components/LocalizedBackdrop';
import { FG } from './types';

const browserHistory = createBrowserHistory();

function App(props: FG.AppProps): JSX.Element {
    const [ready, _setReady] = useState(false);
    const { onReady } = props;
    const layoutRef: RefObject<Layout> = React.createRef();
    useEffect(() => {
        GlobalConfiguration.setOption('emoji', true);
        GlobalConfiguration.setOption('openLinksInNewWindow', true);
        // if (onReady) onReady();
    }, []);

    const setReady = () => {
        if (!ready) {
            if (onReady) onReady();
            _setReady(true);
        }
    };

    const fallback = (
        <LocalizedBackdrop open>
            <CircularProgress variant={'indeterminate'} />
        </LocalizedBackdrop>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <React.Suspense fallback={fallback}>
                <UserState.Provider>
                    <Router history={browserHistory}>
                        <MembersState.Provider>
                            <NavigationState.Provider>
                                <Authenticator setReady={setReady}>
                                    <React.Suspense fallback={fallback}>
                                        <LayoutHOC layoutRef={layoutRef}>
                                            <Pages />
                                        </LayoutHOC>
                                    </React.Suspense>
                                </Authenticator>
                            </NavigationState.Provider>
                        </MembersState.Provider>
                    </Router>
                </UserState.Provider>
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
