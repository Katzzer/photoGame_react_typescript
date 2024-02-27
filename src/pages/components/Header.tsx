import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {PageName, PageUrl} from "../../tools/RouterEnum";

const Header = () => {
    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <>
            {currentPage !== PageUrl.ROOT &&
            <header>
                <div className="header__container">
                    <div id="header">
                        <h1 className="header__textForDesktop">Photo game - frontend</h1>
                    </div>

                    <div className="header__link-wrapper">
                        <Link to={PageUrl.MENU}>{PageName.MENU}</Link>
                    </div>

                </div>
            </header>
            }
        </>
    )

}

export default Header;
