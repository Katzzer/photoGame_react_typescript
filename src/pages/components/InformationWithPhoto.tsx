import React from 'react';
import PropTypes from 'prop-types';
import {Photo} from "../../common/types";

interface PropTypes {
    photo: Photo
    showModalWindowWithPhoto: (imageId: number | undefined) => void
}

function InformationWithPhoto(props: PropTypes) {
    return (
        <div className={"information-with-photo__wrapper"} onClick={() => props.showModalWindowWithPhoto(props.photo.id)}>
            <div className={"information-with-photo__photo-wrapper"}>
                <img className={"information-with-photo__photo"} src={props.photo.image} alt={"image" + props.photo.id}/>
            </div>

            <div className={"information-with-photo__data-wrapper"}>
                <div>id: {props.photo.id}</div>
                <div>City: {props.photo.city}</div>
                <div>GPS: {props.photo.gpsPositionLatitude}N, {props.photo.gpsPositionLongitude}E</div>
                <div>Country: {props.photo.country}</div>
            </div>

        </div>
    );
}

export default InformationWithPhoto;