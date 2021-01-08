import React, { RefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import './theme/scss/global.scss';
import { Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import theme from './theme';
import LayoutHOC, { Layout } from './components/Layout';
import Pages from './pages';
import { UserState } from './state';

const browserHistory = createBrowserHistory();

function App(props: FG.AppProps): JSX.Element {
    const { onReady } = props;
    const { t } = useTranslation('common');
    const layoutRef: RefObject<Layout> = React.createRef();
    useEffect(onReady, []);
    useEffect(() => {
        console.log(layoutRef);
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserState.Provider>
                <Router history={browserHistory}>
                    <LayoutHOC layoutRef={layoutRef}>
                        <Pages />
                    </LayoutHOC>
                </Router>
            </UserState.Provider>
        </ThemeProvider>
    );
}

export default App;
