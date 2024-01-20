import React, {useContext, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from "axios";
import TokenContext from "../context/token-context";
import LinkToPage from "./components/LinkToPage";
import {Page} from "../tools/RouterEnum";

function ListOfCities() {
    const [state, _] = useContext(TokenContext);
    const [listOfCities, setListOfCities] = useState([]);

    useEffect(() => {
        getListOfCities();
    }, []);

    function getListOfCities() {
        setListOfCities([]);
        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };
        axios.get("http://localhost:8080/api/v1/data/list-of-cities", config)
            .then(response => {
                setListOfCities(response.data);
            })
    }

    return (
        <>
            <div>List of cities:</div>

            {listOfCities && listOfCities.map(city =>
                <div key={city}>
                    <LinkToPage linkTo={Page.ALL_PHOTOS} description={city} dynamicValue={city}/>
                </div>

            )}

        </>

    );
}

export default ListOfCities;