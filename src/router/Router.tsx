import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import {PageUrl} from "../tools/RouterEnum";
import ShowAllPhotosForCurrentUser from "../pages/ListOfPhotos";
import {useContext, useEffect, useReducer} from "react";
import {tokenReducer} from "../reducer/tokenReducer";
import {ActionType, initialState, State} from "../model/token.model";
import TokenContext from "../context/token-context";
import getSessionAndVerify from "../security/auth";
import Welcome from "../pages/Welcome";
import UploadPhoto from "../pages/UploadPhoto";
import Login from "../pages/Login";
import ListOfCountriesOrCities from "../pages/ListOfCountriesOrCities";
import Footer from "../pages/components/Footer";
import Menu from "../pages/Menu";

interface ProtectedRouteProps {
    children: JSX.Element;
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
                setToken(ActionType.SET_ID_TOKEN, {idToken: null})
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
                <div id={"content_and_footer_wrapper"}>

                    <Header/>
                    <Routes>

                        <Route path={PageUrl.ROOT} element={<Welcome/>}/>

                        <Route path={PageUrl.LOGIN}
                               element={
                                   <Login
                                       setIsUserLogged={setIsUserLogged}
                                       setLoggedUserUsername={setLoggedUserUsername}
                                       setToken={setToken}
                                   />}
                        />

                        <Route path={PageUrl.MENU}
                               element={
                                   <ProtectedRoute>
                                       <Menu/>
                                   </ProtectedRoute>
                               }
                        />

                        <Route path={PageUrl.FIND_PHOTOS_BY_LOCATION} element={
                            <ProtectedRoute>
                                <ListOfCountriesOrCities/>
                            </ProtectedRoute>
                        }/>

                        <Route path={PageUrl.FIND_PHOTOS_BY_LOCATION + "/:country"} element={
                            <ProtectedRoute>
                                <ListOfCountriesOrCities/>
                            </ProtectedRoute>
                        }/>

                        <Route path={PageUrl.UPLOAD_IMAGE} element={
                            <ProtectedRoute>
                                <UploadPhoto/>
                            </ProtectedRoute>
                        }/>

                        <Route path={PageUrl.ALL_PHOTOS} element={
                            <ProtectedRoute>
                                <ShowAllPhotosForCurrentUser/>
                            </ProtectedRoute>
                        }/>

                        <Route path={PageUrl.ALL_PHOTOS + "/:country" + "/:city"} element={
                            <ProtectedRoute>
                                <ShowAllPhotosForCurrentUser/>
                            </ProtectedRoute>
                        }/>

                        <Route path={PageUrl.ALL_OTHER_PAGES} element={<NotFoundPage/>}/>

                    </Routes>
                    <Footer/>
                </div>
            </BrowserRouter>
        </TokenContext.Provider>
    );
}

function ProtectedRoute({children}: ProtectedRouteProps): JSX.Element {
    const [state, _] = useContext(TokenContext);

    if (state.isUserLogged === null) {
        return <div>Loading...</div>
    }

    if (state.isUserLogged) {
        return children;
    } else {
        return <Navigate to={PageUrl.ROOT} replace/>;
    }

}

export default Router;
