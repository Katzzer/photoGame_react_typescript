import {Navigate} from "react-router-dom";
import {PageUrl} from "../tools/RouterEnum";
import React from "react";

function Welcome() {
    return (
        <Navigate to={PageUrl.LOGIN} />
    );
}

export default Welcome;