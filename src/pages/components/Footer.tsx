import FooterLink from "./FooterLink";
import {PageUrl, PageDescription} from "../../tools/RouterEnum";
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
                            <FooterLink pageUrl={PageUrl.ROOT} description={PageDescription.ROOT}  />
                            <FooterLink pageUrl={PageUrl.MENU} description={PageDescription.MENU}  />
                            <FooterLink pageUrl={PageUrl.LOGIN} description={PageDescription.LOGIN}  />
                            <FooterLink pageUrl={PageUrl.UPLOAD_IMAGE} description={PageDescription.UPLOAD_IMAGE}  />
                            <FooterLink pageUrl={PageUrl.ALL_PHOTOS} description={PageDescription.ALL_PHOTOS}  />
                            <FooterLink pageUrl={PageUrl.FIND_PHOTOS_BY_LOCATION} description={PageDescription.FIND_PHOTOS_BY_LOCATION}  />
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
