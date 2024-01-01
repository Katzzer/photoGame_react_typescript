import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import {Pages} from "../tools/RouterEnum";

function Router() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={Pages.ROOT} element={ <LoginPage /> } />
                <Route path={Pages.ALL_PAGES} element={ <NotFoundPage /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
