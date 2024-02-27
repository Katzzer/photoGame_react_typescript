import React, {useContext, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from "axios";
import TokenContext from "../context/token-context";
import {Photo} from "../common/types";
import {redirect, useParams} from "react-router-dom";
import {PageUrl} from "../tools/RouterEnum";
import InformationWithImage from "./components/InformationWithImage";
import LinkToPage from "./components/LinkToPage";
import {BACKEND_URL} from "../tools/constants";

// TODO: implement on backend last changes and here upload new photo when there are some changes

function ListOfPhotos() {
    const [state, _] = useContext(TokenContext);
    const [listOfPhotos, setListOfPhotos] = useState<Photo[]>([]);
    const [listOfPhotosWithImage, setListOfPhotosWithImage] = useState<Photo[]>([]);
    const [isModalWindowForImageOpen, setIsModalWindowForImageOpen] = useState(false);
    const [image, setImage] = useState("");
    const params = useParams();
    const header = params.country ? `List of photos by country: ${params.country} and city: ${params.city}` : "All users photos"

    useEffect(() => {
        if (!state.isUserLogged) {
            redirect(PageUrl.ROOT);
        }
    }, [listOfPhotos, listOfPhotosWithImage, image]);

    useEffect(() => {
        getListOfPhotos();
    }, []);

    useEffect(() => {
        function fetchPhotos() {
            try {
                listOfPhotos.map(photo => getImageThumbnailFromBackend(photo));
            } catch (error) {
                console.log(error);
            }
        }

        fetchPhotos();
    }, [listOfPhotos]);

    async function getImageThumbnailFromBackend(photo:Photo): Promise<string | undefined> {
        const config: AxiosRequestConfig = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        const response = await axios.get(`${BACKEND_URL.LOCALHOST}/photo/thumbnail/${photo.id}`, config);
        if (response.data) {
            photo.image = URL.createObjectURL(response.data);
            setListOfPhotosWithImage(prevState => {
                // Check if photo with same id already exists in the prevState
                const doesExist = prevState.some(existingPhoto => existingPhoto.id === photo.id);

                if (!doesExist) {
                    // If the photo doesn't exist, add it to the prevState
                    return [...prevState, photo];
                } else {
                    // If the photo does exist, return the prevState as is
                    return prevState;
                }
            });
        }

        return undefined;
    }

    function getListOfPhotos() {
        const url = params.country ? `${BACKEND_URL.LOCALHOST}/find-photos-by-location/${params.country}/${params.city}` : `${BACKEND_URL.LOCALHOST}/photos/all-photos-for-current-user`

        setListOfPhotos([]);
        setListOfPhotosWithImage([]);
        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };
        axios.get(url, config).then(response => {
            setListOfPhotos(response.data);
        })
    }

    async function showModalWindowWithImage(imageId: number | undefined) {
        setIsModalWindowForImageOpen(true);
        const config:AxiosRequestConfig  = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        if (imageId) {
            const response = await axios.get(`${BACKEND_URL.LOCALHOST}/photo/${imageId}`, config);
            console.log(response.data);
            setImage(URL.createObjectURL(response.data));
        }

    }

    function closeImage() {
        setImage("");
        setIsModalWindowForImageOpen(false);
    }

    return (
        <div className="">
            <div className={"all-photos__container"}>
                <button className={"all-photos-for-current-user__reload-button"} onClick={getListOfPhotos}>Reload data</button>
                <h1>{header}</h1>

                {listOfPhotos && listOfPhotosWithImage.map(photo =>
                  <InformationWithImage
                      key={photo.id}
                      photo={photo}
                      showModalWindowWithImage={showModalWindowWithImage}/>
                )}

                {isModalWindowForImageOpen && image &&
                    <div className={"all-photos__image-wrapper"}>
                        <div className={"all-photos__layer"}/>
                        <button className={"all-photos__button"} onClick={closeImage}>Close image</button>
                        <img className={"all-photos__image"} src={image} alt={"image"}/>
                    </div>
                }

                {isModalWindowForImageOpen && !image &&
                    <div className={"all-photos__image-wrapper"}>
                        <div className={"all-photos__layer"}/>
                        <button className={"all-photos__button-with-bottom-margin"} onClick={closeImage}>Close image</button>
                        <div className={"all-photos__loading-state"}>
                            <div className={"all-photos__loading"}></div>
                        </div>
                    </div>
                }

                {/* show at page where is list of photos by country and city */}
                {params.city &&
                    <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} dynamicValue={params.country} pageName={"Go back to list of cities"}/>
                }

                {/* show at page with All users photos */}
                {!params.city &&
                    <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} pageName={"Find photo by location"}/>
                }

            </div>
        </div>
    );

}

export default ListOfPhotos;