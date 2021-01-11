declare namespace FG {
    type AppProps = {
        onReady?: () => void;
    };

    type SplashArgs = {
        selector: string;
        isReturning: boolean;
    };
}

declare namespace FG.State {
    type UserState = {
        authenticated: boolean;
        authenticate: () => void;
        logout: () => void;
    };
}
