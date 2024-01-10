import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {Page} from "../../tools/RouterEnum";

const Header = () => {
    const location = useLocation();

    return (
        <>
            <header>
                <div className="header__wrapper">
                    <div id="header">
                        <h1 className="header__textForDesktop">Photo game - frontend</h1>
                    </div>

                    {location.pathname !== "/" &&
                        <div className="link-wrapper">
                            <Link to={Page.ROOT}>Go to main page</Link>
                        </div>
                    }

                </div>
            </header>
        </>
    )

}

export default Header;
