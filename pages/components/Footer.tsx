import FooterLink from "./FooterLink";
import {Page} from "../../tools/RouterEnum";

const Footer = () => {

    return (
        <>
            <footer>
                <div className="footer__wrapper">

                    <FooterLink linkName={"Test"} pageUrl={Page.LIST_OF_CITIES} />

                    <div className="created-by">
                        <p>Created by <a href="https://www.pavelkostal.com">Pavel Kostal</a></p>
                    </div>

                </div>
            </footer>
        </>
    )

};

export default Footer;
