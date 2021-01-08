import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { init as initTextHandler } from './i18n';
import * as serviceWorker from './serviceWorker';
import executeSplash from './components/Splash';

function destroyPreloader() {
    const preloader = document.getElementById('splash-container');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.parentElement?.removeChild(preloader);
        }, 1500);
    }
}
function onReady(): void {
    destroyPreloader();
}

(async function launch() {
    await initTextHandler();
    serviceWorker.unregister();
    const target = document.getElementById('root');
    if (target) {
        const splashed = await executeSplash({
            selector: '#splash-container',
            isReturning: sessionStorage.getItem('returning') !== null,
        }).catch(alert);
        if (splashed) {
            sessionStorage.setItem('returning', '1');
            ReactDOM.render(<App onReady={onReady} />, target);
        }
    }
})();
