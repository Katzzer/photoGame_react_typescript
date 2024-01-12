import {Navigate} from "react-router-dom";
import {Page} from "../tools/RouterEnum";
import React from "react";

function Home() {
    return (
        <Navigate to={Page.LOGIN} />
    );
}

export default Home;