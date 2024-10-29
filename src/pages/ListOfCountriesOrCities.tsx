import React, {useContext, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from "axios";
import TokenContext from "../context/token-context";
import LinkToPage from "./components/LinkToPage";
import {PageUrl} from "../tools/RouterEnum";
import {BACKEND_URL} from "../tools/constants";
import {useParams} from "react-router-dom";

function ListOfCountriesOrCities() {
    const [state, _] = useContext(TokenContext);
    const [listOfCountriesOrCities, setListOfCountriesOrCities] = useState([]);
    const params = useParams();

    useEffect(() => {
        getListOfCountriesOrCities();
    }, [params]);

    function getListOfCountriesOrCities() {
        let url = "";

        if (params.country) {
            url = `/${params.country}`;
        }

        if (params.country && params.city) {
            url = `/${params.country}/${params.city}`;
        }

        setListOfCountriesOrCities([]);

        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        axios.get(`${BACKEND_URL}/find-photos-by-location${url}`, config)
            .then(response => {
                setListOfCountriesOrCities(response.data);
            })
    }

    return (
        <div id={"page_wrapper"}>
            <div>List of cities:</div>

            {/* show at page with list of countries */}
            {!params.country && listOfCountriesOrCities && listOfCountriesOrCities.map(countryOrCity =>
                <div key={countryOrCity}>
                    <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} pageName={countryOrCity} dynamicValue={countryOrCity}/>
                </div>
            )}

            {/* show at page with list of cities */}
            {params.country && listOfCountriesOrCities && listOfCountriesOrCities.map(countryOrCity =>
                <div key={countryOrCity}>
                    <LinkToPage pageUrl={PageUrl.ALL_PHOTOS} pageName={countryOrCity} dynamicValue={params.country + "/" + countryOrCity}/>
                </div>
            )}

            {/* show at page with list of cities */}
            {params.country &&
                <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} pageName={"Back to list of countries"} />
            }

        </div>

    );
}

export default ListOfCountriesOrCities;