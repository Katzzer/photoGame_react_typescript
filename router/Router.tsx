import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../pages/components/Header";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";

function Router() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={ <LoginPage /> } />
                <Route path="*" element={ <NotFoundPage /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
