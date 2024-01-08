import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import {Pages} from "../tools/RouterEnum";
import ShowAllPhotosForCurrentUser from "../pages/ShowAllPhotosForCurrentUser";
import {useContext, useEffect, useReducer} from "react";
import {tokenReducer} from "../reducer/tokenReducer";
import {ActionType, initialState, State} from "../model/token.model";
import TokenContext from "../context/token-context";
import getSessionAndVerify from "../security/auth";

interface ProtectedRouteProps {
    children:  JSX.Element;
}

function Router() {
    const [state, dispatch] = useReducer(tokenReducer, initialState);

    useEffect(() => {
        checkLoggedUser();
    }, []);

    function checkLoggedUser() {
        getSessionAndVerify().then(session => {
            if (session) {
                setIsUserLogged(true);
                setLoggedUserUsername(session.getAccessToken().payload.username);
                setIdToken({idToken: session.getIdToken().getJwtToken()});
                setAccessToken({accessToken: session.getAccessToken().getJwtToken()});
                setRefreshToken({refreshToken: session.getRefreshToken().getToken()});
            } else {
                console.log("user is not logged");
                setIsUserLogged(false);
                setLoggedUserUsername("");
                setIdToken({idToken: null})
                setAccessToken({accessToken: null})
                setRefreshToken({refreshToken: null})
            }
        })

    }

    // TODO: refactor, don´t use Partial<State> but use String
    function setIdToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_ID_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setAccessToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_ACCESS_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setRefreshToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_REFRESH_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setLoggedUserUsername(loggedUserUsername: string | null) {
        dispatch({
            type: ActionType.SET_USER_USERNAME,
            payload: {
                ...state,
                loggedUserUsername: loggedUserUsername
            }
        });
    }

    function setIsUserLogged(isUserLogged: boolean) {
        dispatch({
            type: ActionType.SET_IS_USER_LOGGED,
            payload: {
                ...state,
                isUserLogged: isUserLogged
            }
        });
    }

    return (
        <TokenContext.Provider value={[state, dispatch]}>
        <BrowserRouter>
            <Header/>
            <Routes>

                <Route path={Pages.ALL_OTHER_PAGES}
                       element={
                           <LoginPage
                               setIsUserLogged={setIsUserLogged}
                               setLoggedUserUsername={setLoggedUserUsername}
                               setIdToken={setIdToken}
                               setAccessToken={setAccessToken}
                               setRefreshToken={setRefreshToken}
                           />}
                />

                <Route path={Pages.ALL_PHOTOS} element={
                    <ProtectedRoute>
                        <ShowAllPhotosForCurrentUser />
                    </ProtectedRoute>
                }/>

                <Route path={Pages.ALL_OTHER_PAGES} element={ <NotFoundPage /> } />

            </Routes>
        </BrowserRouter>
        </TokenContext.Provider>
    );
}

function ProtectedRoute ({ children }: ProtectedRouteProps): JSX.Element {
    const [state, _] = useContext(TokenContext);

    if (state.isUserLogged === null) {
        return <div>Loading...</div>
    }

    if (state.isUserLogged) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }

}

export default Router;
