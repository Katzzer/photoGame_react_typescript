import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "../components/Header";
import NotFoundPage from "../components/NotFoundPage";
import LoginPage from "../components/LoginPage";

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
