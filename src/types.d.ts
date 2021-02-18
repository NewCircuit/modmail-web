import { Thread, ModmailUser, Category, Message, RoleState, ChannelState } from '@Floor-Gang/modmail-types';

type Role = 'admin' | 'mod' | '';

export type MemberState = {
    avatarURL: string;
    discriminator: string;
    id: string;
    username: string;
    // role: Role;
    // nickname: string;
};

export type RoleTag = Partial<Omit<RoleState, 'color'>> & {
    id: string;
    exists: boolean;
    color?: string;
};

export type ChannelTag = Partial<ChannelState> & {
    id: string;
    exists: boolean;
};

export type DiscordTag = RoleTag | ChannelTag;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequiredArgs<T = {}> = {
    [s: string]: any;
} & T;

export type MutatedThread = Omit<Thread, 'author' | 'messages'> & {
    author: ModmailUser & {
        data: () => Promise<Nullable<MemberState>>;
    };
    messages: MutatedMessage[];
};

type MutatedMessage = Omit<Message, 'sender'> & {
    sender: {
        id: string;
        data: () => Promise<Nullable<MemberState>>;
    };
};

type TempModmailUser = ModmailUser & {
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    token: string;
    mfa_enabled: bolean;
};

export type UserMap = {
    [s: string]: MemberState;
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

    type ThreadsOneResponse = Thread & {
        users: UserMap;
    };
    type ThreadsResponse = {
        threads: Thread[];
        users: UserMap;
    };

    type MemberResponse = MemberState;
    type MembersResponse = MemberState[];

    type RoleResponse = Nullable<RoleState>;
    type ChannelResponse = Nullable<ChannelState>;
}

declare namespace FG.State {
    type MemberMap = {
        [s: string]: {
            index: number;
            category?: string;
            id: string;
            promise?: Promise<Nullable<MemberState>>;
        };
    };

    type MembersState = {
        members: MemberMap;
        addMembers: (members: UserMap) => void;
        fetchMember: (id: string, category: string) => Promise<Nullable<MemberState>>;
        getMember: (
            id: string,
            category?: string
        ) => () => Promise<Nullable<MemberState>>;
    };

    type UserState = {
        token: ReadOnly<Nullable<string>>;
        authenticated?: boolean;
        processing: boolean;
        authenticate: () => Promise<boolean>;
        redirect: () => void;
        logout: () => void;
    };

    type NavigationState = {
        threads: {
            items?: Array<MutatedThread>;
            fetch: (category: string) => Promise<MutatedThread[]>;
            fetchOne: (
                category: string,
                thread: string
            ) => Promise<Nullable<MutatedThread>>;
            findById: (category: string, thread: string) => Nullable<MutatedThread>;
            reset: () => void;
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
            reset: () => void;
        };
        roles: {
            fetch: (category: string, role: string) => Promise<RoleTag>;
            get: (category: string, role: string) => Promise<RoleTag>;
        };
        channels: {
            fetch: (category: string, channel: string) => Promise<ChannelTag>;
            get: (category: string, channel: string) => Promise<ChannelTag>;
        };
    };
}
