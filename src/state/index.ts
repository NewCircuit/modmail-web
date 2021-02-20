export { useUserState, default as UserState } from './userState';
export { useModmailState, default as ModmailState } from './modmailState';

export enum FetchState {
    EMPTY,
    LOADING,
    LOADED,
}
