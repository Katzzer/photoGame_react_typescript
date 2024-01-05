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
}

function ShowAllPhotosFroCurrentUser() {
    const [state, _] = useContext(TokenContext);
    const [listOfPhotos, setListOfPhotos] = useState<Photo[]>([]);
    const [listOfImageBlobs, setListOfImageBlobs] = useState<(string | undefined)[]>([]);

    useEffect(() => {
        getListOfPhotosForCurrentUser();
    }, []);

    useEffect(() => {
        async function fetchPhotos() {
            try {
                // const fetchedImages = await Promise.all(listOfPhotos.map(photo => getImageThumbnailFromBackend(photo.id)));
                listOfPhotos.map(photo => getImageThumbnailFromBackend(photo.id));
            } catch (error) {
                console.log(error);
            }
        }

        fetchPhotos();
    }, [listOfPhotos]);

    async function getImageThumbnailFromBackend(id:number | undefined): Promise<string | undefined> {
        const config: AxiosRequestConfig = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        const response = await axios.get("http://localhost:8080/api/v1/data/image/thumbnail/" + id, config);
        if (response.data) {
            const image = URL.createObjectURL(response.data);
            setListOfImageBlobs(prevState => [...prevState, image])
        }

        return undefined;

    }

    async function getListOfPhotosForCurrentUser() {
        setListOfImageBlobs([]);
        const config:AxiosRequestConfig  = {
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };
        const response = await axios.get("http://localhost:8080/api/v1/data/images", config);
        setListOfPhotos(response.data);
    }

    return (
        <div className="">
            <div className="text-center">
                <button onClick={getListOfPhotosForCurrentUser}>Reload data</button>
                {listOfPhotos && listOfPhotos.map(photo => <div key={photo.id}>{photo.id}</div>)}
                {listOfPhotos && listOfImageBlobs.map(image => <img src={image} alt={"aaa"}/>)}
            </div>
        </div>
    );

}

export default ShowAllPhotosFroCurrentUser;