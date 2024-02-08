import FooterLink from "./FooterLink";
import {Page} from "../../tools/RouterEnum";

const Footer = () => {

    return (
        <>
            <footer>
                <div className="footer__wrapper">

                    <FooterLink linkName={"Home page"} pageUrl={Page.ROOT} />
                    <FooterLink linkName={"Login"} pageUrl={Page.LOGIN} />
                    <FooterLink linkName={"Upload image"} pageUrl={Page.UPLOAD_IMAGE} />
                    <FooterLink linkName={"All user photos"} pageUrl={Page.ALL_PHOTOS} />
                    <FooterLink linkName={"Find photos by location"} pageUrl={Page.FIND_PHOTOS_BY_LOCATION} />

                    <div className="footer__created-by">
                        <p>Created by <a href="https://www.pavelkostal.com" target="_blank">Pavel Kostal</a></p>
                    </div>

                </div>
            </footer>
        </>
    )

};

export default Footer;
