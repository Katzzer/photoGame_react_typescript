import React from 'react';
import PropTypes from 'prop-types';
import {Photo} from "../../common/types";

interface PropTypes {
    photo: Photo
    showModalWindowWithImage: (imageId: number | undefined) => void
}

function InformationWithImage(props: PropTypes) {
    return (
        <div className={"informationWithImage__wrapper"}>
            <div className={"informationWithImage__image-wrapper"} onClick={() => props.showModalWindowWithImage(props.photo.id)}>
                <img className={"informationWithImage__image"} src={props.photo.image} alt={"image" + props.photo.id}/>
            </div>

            <div className={"informationWithImage__data-wrapper"}>
                <div className={"informationWithImage__photoId"}>id: {props.photo.id}</div>
                <div className={"informationWithImage__city-name"}>City: {props.photo.city}</div>
                <div className={"informationWithImage__city-gps"}>GPS: {props.photo.gpsPositionLatitude}N, {props.photo.gpsPositionLongitude}E</div>
                <div className={"informationWithImage__country-gps"}>Country: {props.photo.country}</div>
            </div>

        </div>
    );
}

export default InformationWithImage;