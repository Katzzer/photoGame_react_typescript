import RightArrow from "../../images/svg/arrow-right.svg?react";
import {PageUrl, PageDescription} from "../../tools/RouterEnum";
import {Link} from "react-router-dom";
import React from "react";

interface footerLinkProps {
    description: PageDescription,
    pageUrl: PageUrl
}

function FooterLink(props: footerLinkProps) {
    return (
        <div className="footer__arrow-and-section-name">
            <RightArrow className="footer__arrow-right"/>
            <div className="footer__section-name">
                <Link to={props.pageUrl}>{props.description}</Link>
            </div>
        </div>
    );
}

export default FooterLink;