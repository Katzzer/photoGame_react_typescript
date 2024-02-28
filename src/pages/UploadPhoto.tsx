import React, {useContext, useEffect, useState} from 'react';
import {Photo} from "../common/types";
import axios from "axios";
import TokenContext from "../context/token-context";
import exifr from 'exifr'
import {BACKEND_URL} from "../tools/constants";

function UploadPhoto() {
    const [state, _] = useContext(TokenContext);
    const [uploadedImage, setUploadedImage] = useState(new Blob());
    const [uploadedImagePreview, setUploadedImagePreview] = useState("");
    const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);
    const [photo, setPhoto] = useState<Photo>({
        gpsPositionLatitude: undefined,
        gpsPositionLongitude: undefined,
        city: undefined
    });

    useEffect(() => {
        if (uploadedImage.size > 0 && ((photo.gpsPositionLongitude && photo.gpsPositionLatitude) || photo.city)) {
            setIsSubmitButtonEnabled(true);
        } else {
            setIsSubmitButtonEnabled(false);
        }

    }, [photo, uploadedImage]);

    function setCityToPhoto(city: string) {

        setPhoto(prevState => ({
            ...prevState,
            city: city,
        }))
    }

    function handleSubmit(e:React.FormEvent) {
        e.preventDefault();

        const photoAsJson = JSON.stringify(photo);
        const blob = new Blob([photoAsJson], {
            type: 'application/json'
        });

        let formData = new FormData();
        formData.append('imageFile', uploadedImage);
        formData.append('photo', blob);

        axios.post(BACKEND_URL.LOCALHOST + "/save-photo",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${state.idToken}`,
                    "Content-type": "multipart/form-data",
                },
            }
        )
            .then(res => {
                console.log(`Success` + res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    function handleImageUpload(e:any) {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_file = e.target.files[0];
        setUploadedImage(image_as_file)
        setUploadedImagePreview(image_as_base64);

         exifr.gps(image_as_file).then(response => {
             if (response.longitude && response.latitude) {

                 setPhoto(prevState => ({
                     ...prevState,
                     gpsPositionLatitude: response.latitude,
                     gpsPositionLongitude: response.longitude,
                 }))
             } else {
                 setPhoto(prevState => ({
                     ...prevState,
                     gpsPositionLatitude: undefined,
                     gpsPositionLongitude: undefined,
                 }))
             }

         })
    }

    return (
        <div className={"uploadPhoto__container"}>
            <div className={"uploadPhoto__wrapper"}>
                <div className={"uploadPhoto__box"}>
                    <div className={"uploadPhoto__name"}>Upload a photo</div>
                    <div className={"uploadPhoto__text"}>Select a photo to upload from your computer or device.</div>

                    <form onSubmit={handleSubmit}>

                        <div className={"uploadPhoto__chooseFileWrapper"}>
                            <button className={"uploadPhoto__button"}>Choose Photo
                                <input type="file" name="inputFile" onChange={handleImageUpload}/>
                            </button>
                        </div>

                        {uploadedImagePreview &&
                            <div className={"uploadPhoto__photo-preview"}>
                                <img src={uploadedImagePreview} alt="image preview"/>
                            </div>
                        }


                        {uploadedImagePreview && !photo.gpsPositionLatitude &&
                            <div className={"uploadPhoto__city-wrapper"}>
                                <span>City:</span>
                                <input
                                    type="text"
                                    name="city"
                                    onChange={(inputValue) => setCityToPhoto(inputValue.target.value)}
                                    placeholder={"Please enter city"}
                                    className={photo.city ? "" : "warning"}
                                />
                            </div>
                        }


                        {photo.gpsPositionLatitude &&
                            <div className={"uploadPhoto__gps-wrapper"}>
                                GPS: {photo?.gpsPositionLatitude} : {photo?.gpsPositionLongitude}
                            </div>
                        }

                        {uploadedImagePreview &&
                            <div className={"uploadPhoto__submit-button-wrapper"}>
                                <input type="submit" value="Submit" disabled={!isSubmitButtonEnabled} className={"uploadPhoto__submit-button"}/>
                            </div>
                        }


                    </form>
                </div>
            </div>
        </div>


    );
}

export default UploadPhoto;