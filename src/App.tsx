import React, { RefObject, useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { CircularProgress, CssBaseline } from '@material-ui/core';
import Authenticator from 'components/Authenticator';
import { GlobalConfiguration } from '@demitchell14/react-showdown';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import theme from './theme';
import LayoutHOC, { Layout } from './components/Layout';
import Pages from './pages';
import { UserState, ModmailState } from './state';
import LocalizedBackdrop from './components/LocalizedBackdrop';
import { NC } from './types';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';

const browserHistory = createBrowserHistory();

function App(props: NC.AppProps): JSX.Element {
    const { t } = useTranslation(undefined, { useSuspense: false });
    const [ready, _setReady] = useState(false);
    const { onReady } = props;
    const layoutRef: RefObject<Layout> = React.createRef();
    useEffect(() => {
        GlobalConfiguration.setOption('emoji', true);
        GlobalConfiguration.setOption('openLinksInNewWindow', true);
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
            <Helmet>
                <title>{t('appName')}</title>
            </Helmet>
            <React.Suspense fallback={fallback}>
                <UserState.Provider>
                    <Router history={browserHistory}>
                        <ServiceWorkerWrapper initialize />
                        <ModmailState.Provider>
                            <Authenticator setReady={setReady}>
                                <React.Suspense fallback={fallback}>
                                    <LayoutHOC layoutRef={layoutRef}>
                                        <Pages />
                                    </LayoutHOC>
                                </React.Suspense>
                            </Authenticator>
                        </ModmailState.Provider>
                    </Router>
                </UserState.Provider>
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
