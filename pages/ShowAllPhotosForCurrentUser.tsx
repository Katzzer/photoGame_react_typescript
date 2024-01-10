import React, {useContext, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from "axios";
import TokenContext from "../context/token-context";
import {Photo} from "../common/types";
import {redirect} from "react-router-dom";
import {Page} from "../tools/RouterEnum";

interface PropsType {
    checkIfUserIsLogged: () => void
}

// TODO: implement on backend last changes and here upload new photo when there are some changes

function ShowAllPhotosFroCurrentUser(props: PropsType) {
    const [state, _] = useContext(TokenContext);
    const [listOfPhotos, setListOfPhotos] = useState<Photo[]>([]);
    const [listOfPhotosWithImage, setListOfPhotosWithImage] = useState<Photo[]>([]);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!state.isUserLogged) {
            redirect(Page.ROOT);
        }
        props.checkIfUserIsLogged();
    }, [listOfPhotos, listOfPhotosWithImage, image]);

    useEffect(() => {
        getListOfPhotosForCurrentUser();
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

        const response = await axios.get("http://localhost:8080/api/v1/data/image/thumbnail/" + photo.id, config);
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

    function getListOfPhotosForCurrentUser() {
        setListOfPhotos([]);
        setListOfPhotosWithImage([]);
        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };
        axios.get("http://localhost:8080/api/v1/data/images", config).then(response => {
            setListOfPhotos(response.data);
        })
    }

    async function showImage(imageId: number | undefined) {
        const config:AxiosRequestConfig  = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        if (imageId) {
            const response = await axios.get("http://localhost:8080/api/v1/data/image/" + imageId, config);
            console.log(response.data);
            setImage(URL.createObjectURL(response.data));
        }

    }

    function closeImage() {
        setImage("");
    }

    return (
        <div className="">
            <div className="text-center">
                <button onClick={getListOfPhotosForCurrentUser}>Reload data</button>
                {listOfPhotos && listOfPhotosWithImage.map(photo =>
                    <div onClick={() => showImage(photo.id)}>
                        <div>{photo.id}</div>
                        <img src={photo.image} alt={"image" + photo.id}/>
                    </div>
                )}

                <button onClick={closeImage}>Close image</button>
                {image &&
                    <div>
                        <img src={image} alt={"image"}/>
                    </div>
                }

            </div>
        </div>
    );

}

export default ShowAllPhotosFroCurrentUser;