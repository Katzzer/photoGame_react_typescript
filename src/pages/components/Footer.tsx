import FooterLink from "./FooterLink";
import {PageUrl, PageName} from "../../tools/RouterEnum";
import React, {useContext} from "react";
import TokenContext from "../../context/token-context";

const Footer = () => {
    const [state, _] = useContext(TokenContext);

    return (
        <>
            <footer>
                <div className="footer__wrapper">

                    {state.isUserLogged &&
                        <>
                            <FooterLink pageUrl={PageUrl.ROOT} description={PageName.ROOT}  />
                            <FooterLink pageUrl={PageUrl.MENU} description={PageName.MENU}  />
                            <FooterLink pageUrl={PageUrl.LOGIN} description={PageName.LOGIN}  />
                            <FooterLink pageUrl={PageUrl.UPLOAD_IMAGE} description={PageName.UPLOAD_IMAGE}  />
                            <FooterLink pageUrl={PageUrl.ALL_PHOTOS} description={PageName.ALL_PHOTOS}  />
                            <FooterLink pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} description={PageName.FIND_PHOTOS_BY_LOCATION}  />
                        </>
                    }

                    <div className="footer__created-by">
                        <p>Created by <a href="https://www.pavelkostal.com" target="_blank">Pavel Kostal</a></p>
                    </div>

                </div>
            </footer>
        </>
    )

};

export default Footer;
