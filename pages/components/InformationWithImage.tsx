import React from 'react';
import PropTypes from 'prop-types';

interface PropTypes {
    photoId: number | undefined,
    image: string | undefined,
    showImage: (imageId: number | undefined) => void
}

function InformationWithImage({photoId, image, showImage}: PropTypes) {
    return (
        <div className={"informationWithImage__wrapper"} onClick={() => showImage(photoId)}>
            <div className={"informationWithImage__photoId"}>{photoId}</div>
            <img className={"informationWithImage__image"} src={image} alt={"image" + photoId}/>
        </div>
    );
}

export default InformationWithImage;