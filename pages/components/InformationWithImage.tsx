import React from 'react';
import PropTypes from 'prop-types';

interface PropTypes {
    photoId: number | undefined,
    image: string | undefined,
    city: string | undefined,
    showModalWindowWithImage: (imageId: number | undefined) => void
}

function InformationWithImage({photoId, image, showModalWindowWithImage, city}: PropTypes) {
    return (
        <div className={"informationWithImage__wrapper"} onClick={() => showModalWindowWithImage(photoId)}>
            <div className={"informationWithImage__image-wrapper"}>
                <img className={"informationWithImage__image"} src={image} alt={"image" + photoId}/>
            </div>


            <div className={"informationWithImage__data-wrapper"}>
                <div className={"informationWithImage__photoId"}>id: {photoId}</div>
                <div className={"informationWithImage__city-name"}>City: {city}</div>
            </div>

        </div>
    );
}

export default InformationWithImage;