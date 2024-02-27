import React from 'react';
import LinkToPage from "./components/LinkToPage";
import {PageUrl, PageDescription} from "../tools/RouterEnum";

function Menu() {
    return (
        <div className={"menu__container"}>
            <div className={"menu__heading"}>Menu:</div>
            <LinkToPage pageUrl={PageUrl.ROOT} description={PageDescription.ROOT}  />
            <LinkToPage pageUrl={PageUrl.LOGIN} description={PageDescription.LOGIN}  />
            <LinkToPage pageUrl={PageUrl.UPLOAD_IMAGE} description={PageDescription.UPLOAD_IMAGE}  />
            <LinkToPage pageUrl={PageUrl.ALL_PHOTOS} description={PageDescription.ALL_PHOTOS}  />
            <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} description={PageDescription.FIND_PHOTOS_BY_LOCATION}  />
        </div>
    );
}

export default Menu;