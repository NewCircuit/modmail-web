import { Thread, ModmailUser, Category } from 'modmail-types';

type Role = 'admin' | 'mod' | '';

export type MemberState = {
    avatarURL: string;
    discriminator: string;
    id: string;
    username: string;
    // role: Role;
    // nickname: string;
};

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

    type MemberResponse = MemberState;
    type MembersResponse = MemberState[];
}

declare namespace FG.State {
    type MembersState = {
        members: MemberState[] | null;
        fetchMember: (category: string, id: string) => Promise<Nullable<MemberState>>;
        fetchMembers: (category: string) => Promise<MemberState[]>;
    };

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
            findById: (category: string, thread: string) => Nullable<Thread>;
            // TODO add ability to cancel fetch requests
            // cancel?: (message: string) => void;
        };
        categories: {
            items?: Array<Category>;
            fetch: () => Promise<Category[]>;
            fetchOne: (category: string) => Promise<Nullable<Category>>;
            // TODO add ability to cancel fetch requests
            // cancel?: (message: string) => void;
            findById: (category: string) => Nullable<Category>;
        };
    };
}
