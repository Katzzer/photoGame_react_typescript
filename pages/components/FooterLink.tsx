import RightArrow from "../../public/images/svg/arrow-right.svg?react";
import {Page} from "../../tools/RouterEnum";

interface footerLinkProps {
    linkName: string,
    pageUrl: Page
}

function FooterLink(props: footerLinkProps) {
    return (
        <div className="footer__arrow-and-section-name">
            <RightArrow className="footer__arrow-right"/>
            <div className="footer__section-name">{props.linkName}</div>
        </div>
    );
}

export default FooterLink;