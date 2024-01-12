import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import {Page} from "../tools/RouterEnum";
import ShowAllPhotosForCurrentUser from "../pages/ShowAllPhotosForCurrentUser";
import {useContext, useEffect, useReducer} from "react";
import {tokenReducer} from "../reducer/tokenReducer";
import {ActionType, initialState, State} from "../model/token.model";
import TokenContext from "../context/token-context";
import getSessionAndVerify from "../security/auth";
import Home from "../pages/Home";
import UploadImage from "../pages/UploadImage";

interface ProtectedRouteProps {
    children:  JSX.Element;
}

function Router() {
    const [state, dispatch] = useReducer(tokenReducer, initialState);

    useEffect(() => {
        checkIfUserIsLogged();
    }, []);

    function checkIfUserIsLogged() {
        getSessionAndVerify().then(session => {
            if (session) {
                setIsUserLogged(true);
                setLoggedUserUsername(session.getAccessToken().payload.username);
                setToken(ActionType.SET_ID_TOKEN, {idToken: session.getIdToken().getJwtToken()});
                setToken(ActionType.SET_ACCESS_TOKEN, {accessToken: session.getAccessToken().getJwtToken()});
                setToken(ActionType.SET_REFRESH_TOKEN, {refreshToken: session.getRefreshToken().getToken()});
            } else {
                console.log("user is not logged");
                setIsUserLogged(false);
                setLoggedUserUsername("");
                setToken(ActionType.SET_ID_TOKEN,{idToken: null})
                setToken(ActionType.SET_ACCESS_TOKEN, {accessToken: null})
                setToken(ActionType.SET_REFRESH_TOKEN, {refreshToken: null})
            }
        })

    }

    function setToken(type: ActionType, tokens: Partial<State>) {
        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: type,
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

                <Route path={Page.ROOT} element={ <Home />} />

                <Route path={Page.LOGIN}
                       element={
                           <LoginPage
                               setIsUserLogged={setIsUserLogged}
                               setLoggedUserUsername={setLoggedUserUsername}
                               setToken={setToken}
                           />}
                />

                <Route path={Page.UPLOAD_IMAGE} element={
                    <ProtectedRoute>
                        <UploadImage />
                    </ProtectedRoute>
                }/>

                <Route path={Page.ALL_PHOTOS} element={
                    <ProtectedRoute>
                        <ShowAllPhotosForCurrentUser
                            checkIfUserIsLogged={checkIfUserIsLogged}
                        />
                    </ProtectedRoute>
                }/>

                <Route path={Page.ALL_OTHER_PAGES} element={ <NotFoundPage /> } />

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
        return <Navigate to={Page.ROOT} replace />;
    }

}

export default Router;
