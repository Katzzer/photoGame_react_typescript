export enum ActionType {
    SET_ID_TOKEN = "SET_ID_TOKEN",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
    SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN",
    SET_IS_USER_LOGGED = "SET_IS_USER_LOGGED",
    SET_USER_USERNAME = "SET_USER_USERNAME"
}

export interface State {
    idToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    isUserLogged: boolean | null,
    loggedUserUsername: string | null
}

export const initialState: State = {
    idToken: null,
    accessToken: null,
    refreshToken: null,
    isUserLogged: null,
    loggedUserUsername: null
}