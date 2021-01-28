import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { init as initTextHandler } from './i18n';
import * as serviceWorker from './serviceWorker';
import executeSplash from './components/Splash';
import reportWebVitals from './reportWebVitals';

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
    executeSplash({
        selector: '#splash-container',
        isReturning: sessionStorage.getItem('returning') !== null,
    })
        .then((splashed) => {
            if (splashed) {
                sessionStorage.setItem('returning', '1');
            }
            destroyPreloader();
        })
        .catch(alert);
}

// TODO add service worker registration
// TODO Still need to fully implement though
// serviceWorker.register({
//     onSuccess: onServiceworkerSuccess,
//     onUpdate: onServiceworkerUpdate,
// });
// function onServiceworkerSuccess(args: ServiceWorkerRegistration) {
//     console.log('onServiceworkerSuccess', args);
// }
// function onServiceworkerUpdate(args: ServiceWorkerRegistration) {
//     console.log('onServiceworkerUpdate', args);
// }

(async function launch() {
    initTextHandler();
    serviceWorker.unregister();
    const target = document.getElementById('root');
    if (target) {
        ReactDOM.render(<App onReady={onReady} />, target);
    }
    reportWebVitals();
})();
