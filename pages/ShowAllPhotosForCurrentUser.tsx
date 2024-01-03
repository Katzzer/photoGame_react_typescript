import React, {useReducer} from 'react';
import {Link} from "react-router-dom";
import axios, {AxiosRequestConfig} from "axios";
import {Pages} from "../tools/RouterEnum";

const ShowAllPhotosFroCurrentUser = () => {

    async function getListOfPhotosForCurrentUser() {
        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${"idToken"}` // TODO: make dynamic
            },
        };
        const response = await axios.get("http://localhost:8080/api/v1/data/images", config);
    }

    return (
        <div className="">
            <div className="text-center">
                <button onClick={getListOfPhotosForCurrentUser}>Reload data</button>
                <div className="mainPage__link-wrapper">
                    <div className="link-wrapper">
                        <Link className="button" to={Pages.ALL_PHOTOS}>Go to main page</Link>
                    </div>
                </div>
            </div>
        </div>
    );

};
export default ShowAllPhotosFroCurrentUser;