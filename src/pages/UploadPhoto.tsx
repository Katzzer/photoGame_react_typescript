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
            <div>Upload image:</div>

            <form onSubmit={handleSubmit}>
                <label>
                    City:
                    <input type="text" name="city" onChange={(inputValue) => setCityToPhoto(inputValue.target.value)}/>
                </label>

                <br/>

                <label>
                    <input type="file" name="inputFile" onChange={handleImageUpload}/>
                </label>

                <br/>

                <input type="submit" value="Submit" disabled={!isSubmitButtonEnabled} className={"uploadImage__submit-button"}/>

                {uploadedImagePreview &&
                    <div className={"uploadPhoto__photo-preview"}>
                        <img src={uploadedImagePreview} alt="image preview"/>
                    </div>
                }

                <div>
                    GPS: {photo?.gpsPositionLatitude} : {photo?.gpsPositionLongitude}
                </div>

            </form>

        </div>


    );
}

export default UploadPhoto;