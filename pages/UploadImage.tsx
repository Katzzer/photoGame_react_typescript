import React, {useContext, useState} from 'react';
import {Photo} from "../common/types";
import axios from "axios";
import TokenContext from "../context/token-context";
import exifr from 'exifr'

function UploadImage() {
    const [state, _] = useContext(TokenContext);
    const [uploadedImage, setUploadedImage] = useState(new Blob());
    const [uploadedImagePreview, setUploadedImagePreview] = useState("");
    const [photo, setPhoto] = useState<Photo>({
        gpsPositionLatitude: undefined,
        gpsPositionLongitude: undefined,
        city: undefined
    });

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

        axios.post('http://localhost:8080/api/v1/data',
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
        <>
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

                <input type="submit" value="Submit"/>


                {uploadedImagePreview &&
                    <div className={"uploadImage__image-preview"}>
                        <img src={uploadedImagePreview} alt="image preview"/>
                    </div>
                }

                <div>
                    GPS: {photo?.gpsPositionLatitude} : {photo?.gpsPositionLongitude}
                </div>

            </form>

        </>


    );
}

export default UploadImage;