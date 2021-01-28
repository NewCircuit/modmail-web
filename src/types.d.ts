import { Thread, ModmailUser, Category } from 'modmail-types';

type TempModmailUser = ModmailUser & {
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: bolean;
};

declare namespace FG {
    type AppProps = {
        onReady?: () => void;
    };

    type SplashArgs = {
        selector: string;
        isReturning: boolean;
    };
}

declare namespace FG.Api {
    type SelfResponse = TempModmailUser;

    type CategoriesResponse = Category[];

    type ThreadsResponse = Thread[];
}

declare namespace FG.State {
    type UserState = {
        authenticated?: boolean;
        processing: boolean;
        authenticate: () => Promise<boolean>;
        redirect: () => void;
        logout: () => void;
    };
    type NavigationState = {
        threads: {
            items?: Array<Thread>;
            fetch: (category: string) => Promise<Thread[]>;
        };
        categories: {
            items?: Array<Category>;
            fetch: () => Promise<Category[]>;
        };
    };
}
