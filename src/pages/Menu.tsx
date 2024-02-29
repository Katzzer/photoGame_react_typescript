import React from 'react';
import LinkToPage from "./components/LinkToPage";
import {PageUrl, PageName} from "../tools/RouterEnum";

function Menu() {
    return (
        <div className={"menu__container"}>
            <div className={"menu__heading"}>Menu:</div>
            <LinkToPage pageUrl={PageUrl.ROOT} pageName={PageName.ROOT}  />
            <LinkToPage pageUrl={PageUrl.LOGIN} pageName={PageName.LOGIN}  />
            <LinkToPage pageUrl={PageUrl.UPLOAD_IMAGE} pageName={PageName.UPLOAD_PHOTO}  />
            <LinkToPage pageUrl={PageUrl.ALL_PHOTOS} pageName={PageName.ALL_PHOTOS}  />
            <LinkToPage pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} pageName={PageName.FIND_PHOTOS_BY_LOCATION}  />
        </div>
    );
}

export default Menu;