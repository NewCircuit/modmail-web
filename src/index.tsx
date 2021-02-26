import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { init as initTextHandler } from './i18n';
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
    destroyPreloader();
}

(async function launch() {
    initTextHandler();
    const target = document.getElementById('root');
    if (target) {
        ReactDOM.render(<App onReady={onReady} />, target);
    }
    reportWebVitals();
})();
