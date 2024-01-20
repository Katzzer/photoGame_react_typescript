import React from 'react';
import {Link} from "react-router-dom";
import {Page} from "../../tools/RouterEnum";

interface Props {
    linkTo: Page,
    description: string,
    dynamicValue?: string
}

function LinkToPage(props: Props) {
    const link = props.dynamicValue ? `${props.linkTo}/${props.dynamicValue}` : props.linkTo

    return (
        <div className="mainPage__link-wrapper">
            <div className="link-wrapper">
                <Link className="button" to={link}>{props.description}</Link>
            </div>
        </div>
    );
}

export default LinkToPage;