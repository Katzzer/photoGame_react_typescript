import {ActionType, State} from "../model/token.model";

export function tokenReducer(state: State, action: { type: ActionType; payload: State }) {

    switch (action.type) {
        case ActionType.SET_ID_TOKEN:
            return {
                ...state,
                idToken: action.payload.idToken,
                refreshToken: action.payload.refreshToken,
            };
        case ActionType.SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload.accessToken,
            };
        case ActionType.SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload.refreshToken,
            };
        case ActionType.SET_IS_USER_LOGGED:
            return {
                ...state,
                isUserLogged: action.payload.isUserLogged
        };
        case ActionType.SET_USER_USERNAME: {
            return {
                ...state,
                loggedUserUsername: action.payload.loggedUserUsername
            };
        }
        default:
            return state;
    }
}