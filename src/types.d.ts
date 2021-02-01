import { Thread, ModmailUser, Category } from 'modmail-types';
import { Canceler } from 'axios';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequiredArgs<T = {}> = {
    [s: string]: any;
} & T;

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

    type CategoryOneResponse = Category;
    type CategoriesResponse = Category[];

    type ThreadsOneResponse = Thread;
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
            fetchOne: (category: string, thread: string) => Promise<Nullable<Thread>>;
            cancel?: Canceler;
        };
        categories: {
            items?: Array<Category>;
            fetch: () => Promise<Category[]>;
            fetchOne: (category: string) => Promise<Nullable<Category>>;
            cancel?: Canceler;
            findById: (category: string) => Nullable<Category>;
        };
    };
}
