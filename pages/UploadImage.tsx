import React, {useContext, useState} from 'react';
import {Photo} from "../common/types";
import axios from "axios";
import TokenContext from "../context/token-context";

function UploadImage() {
    const [state, _] = useContext(TokenContext);
    const [uploadedImage, setUploadedImage] = useState(new Blob());
    const [uploadedImagePreview, setUploadedImagePreview] = useState("");

    function handleSubmit(e:React.FormEvent) {
        e.preventDefault();

        const photo:Photo = {
            gpsPositionLatitude: 50,
            gpsPositionLongitude: 15,
            city: 'Hradec Kralove'
        }

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
    }

    return (
        <>
            <div>Upload image:</div>

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="photo"/>
                </label>

                <br/>

                {uploadedImagePreview &&
                    <div className={"image_preview"}>
                        <img src={uploadedImagePreview} alt="image preview"/>
                    </div>
                }

                <br/>

                <label>
                    Name:
                    <input type="file" name="inputFile" onChange={handleImageUpload}/>
                </label>

                <br/>

                <input type="submit" value="Submit"/>

            </form>

        </>


    );
}

export default UploadImage;