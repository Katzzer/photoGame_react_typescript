import React from 'react';
import {Link} from "react-router-dom";
import {PageName, PageUrl} from "../../tools/RouterEnum";

interface Props {
    pageUrl: PageUrl,
    pageName: PageName | string,
    dynamicValue?: string
}

function LinkToPage(props: Props) {
    const link = props.dynamicValue ? `${props.pageUrl}/${props.dynamicValue}` : props.pageUrl

    return (
        <div className="mainPage__link-wrapper">
            <div className="link-wrapper">
                <Link className="button" to={link}>{props.pageName}</Link>
            </div>
        </div>
    );
}

export default LinkToPage;