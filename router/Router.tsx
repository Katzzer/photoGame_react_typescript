import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import {Pages} from "../tools/RouterEnum";
import ShowAllPhotosForCurrentUser from "../pages/ShowAllPhotosForCurrentUser";
import {useContext, useEffect, useReducer, useState} from "react";
import {tokenReducer} from "../reducer/tokenReducer";
import {initialState} from "../model/token.model";
import TokenContext from "../context/token-context";

interface ProtectedRouteProps {
    children:  JSX.Element;
}

function Router() {
    const [state, dispatch] = useReducer(tokenReducer, initialState);

    return (
        <TokenContext.Provider value={[state, dispatch]}>
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={Pages.ROOT} element={ <LoginPage /> } />
                <Route path={Pages.ALL_PHOTOS} element={
                    <ProtectedRoute>
                        <ShowAllPhotosForCurrentUser />
                    </ProtectedRoute>
                }/>
                <Route path={Pages.ALL_PAGES} element={ <NotFoundPage /> } />
            </Routes>
        </BrowserRouter>
        </TokenContext.Provider>
    );
}

function ProtectedRoute ({ children }: ProtectedRouteProps): JSX.Element {
    const [state, _] = useContext(TokenContext);
    const [isUserLogged, setIsUserLogged] = useState<boolean | null>(null)

    useEffect(() => {
        debugger;
        setIsUserLogged(state.isUserLogged);
    }, [state]);

    if (isUserLogged === null) {
        return <div>Loading...</div>
    }

    if (isUserLogged) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }

}

export default Router;
