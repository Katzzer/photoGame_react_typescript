import React from 'react';

interface PropTypes{
    title: string,
    errorDetail: string
    closeModal: () => void
}

function ErrorModal (props: PropTypes) {

    return (
        <div className={"error-modal__container"}>
            <div className={"error-modal__title"}>{props.title}</div>
            <div className={"error-modal__error-detail"}>{props.errorDetail}</div>
            <button className={"error-modal__button"} onClick={props.closeModal}>Close</button>
        </div>
    );
}


export default ErrorModal;