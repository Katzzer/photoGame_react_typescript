import React, {useContext, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from "axios";
import TokenContext from "../context/token-context";

// TODO duplicate code, move it somewhere else
interface Photo {
    id?: number,
    photoOwner?: String,
    gpsPositionLatitude: number,
    gpsPositionLongitude: number,
    city?: String,
    region?: String,
    locality?: String,
    country?: String,
    continent?: String
    image?: string | undefined
}

function ShowAllPhotosFroCurrentUser() {
    const [state, _] = useContext(TokenContext);
    const [listOfPhotos, setListOfPhotos] = useState<Photo[]>([]);
    const [listOfPhotosWithImage, setListOfPhotosWithImage] = useState<Photo[]>([]);

    useEffect(() => {
        console.log("inside useEffect")
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

    return (
        <div className="">
            <div className="text-center">
                <button onClick={getListOfPhotosForCurrentUser}>Reload data</button>
                {listOfPhotos && listOfPhotosWithImage.map(photo =>
                    <div>
                        <div>{photo.id}</div>
                        <img src={photo.image} alt={"image" + photo.id}/>
                    </div>
                )}
            </div>
        </div>
    );

}

export default ShowAllPhotosFroCurrentUser;