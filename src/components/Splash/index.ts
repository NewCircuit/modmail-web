import anime from 'animejs';
import i18next from 'i18next';

export default function executeSplash(args?: FG.SplashArgs): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (
            typeof args === 'undefined' ||
            typeof args.selector === 'undefined' ||
            args.selector === ''
        ) {
            reject(new Error('You must specify a selector to use splash'));
        } else {
            const { selector, isReturning } = args;
            const target: HTMLElement | null = document.querySelector(selector);
            if (target === null) {
                reject(new Error('The selector you entered could not be found in DOM'));
                return;
            }
            const splash = target.querySelector('.splash');
            const preloader = target.querySelector('.preloader');

            if (!isReturning && splash && splash.classList.contains('d-none')) {
                splash.classList.remove('d-none');
            }

            if (preloader) {
                anime({
                    targets: preloader,
                    easing: 'easeInOutExpo',
                    duration: 1500,
                    opacity: 0, // [1, 0]
                });
            }

            if (!isReturning) {
                const backgroundTimeline = anime.timeline();

                backgroundTimeline
                    .add({
                        targets: '.splash .circle-white',
                        scale: [0, 3],
                        opacity: [1, 0],
                        easing: 'easeInOutExpo',
                        rotateZ: 360,
                        duration: 1100,
                        delay: 500,
                    })
                    .add(
                        {
                            targets: '.splash .circle-container',
                            scale: [0, 1],
                            duration: 1100,
                            easing: 'easeInOutExpo',
                        },
                        1600
                    )
                    .add(
                        {
                            targets: '.splash .circle-dark',
                            scale: [0, 1],
                            duration: 1100,
                            easing: 'easeOutExpo',
                        },
                        2200
                    )
                    .add(
                        {
                            targets: '.splash .letters-left',
                            scale: [0, 1],
                            duration: 1200,
                        },
                        3000
                    )
                    .add(
                        {
                            targets: '.splash .bang',
                            scale: [0, 1],
                            rotateZ: [45, 15],
                            duration: 1200,
                        },
                        3500
                    )
                    .add(
                        {
                            targets: '.splash',
                            opacity: 0,
                            duration: 1000,
                            easing: 'easeOutExpo',
                            delay: 2000,
                        },
                        4000
                    );

                anime({
                    targets: '.splash .circle-dark-dashed',
                    borderColor: 'green',
                    rotateZ: -360,
                    duration: 5000,
                    easing: 'linear',
                    loop: true,
                });

                anime({
                    targets: target,
                    delay: 4000,
                    opacity: 0,
                    easing: 'easeOutExpo',
                    duration: 1000,
                    complete: (anim) => {
                        target.style.pointerEvents = 'none';
                        resolve(true);
                    },
                });
            } else {
                anime({
                    targets: target,
                    opacity: 0,
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: 500,
                });
                setTimeout(() => {
                    target.style.pointerEvents = 'none';
                    resolve(true);
                }, 250);
            }
        }
    });
}
