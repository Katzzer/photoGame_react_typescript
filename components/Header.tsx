import React from 'react';
import {Link, useLocation} from "react-router-dom";

const Header = () => {
    const location = useLocation();

    return (
        <>
            <header>
                <div className="header__wrapper">
                    <div id="header">
                        <h1 className="header__textForDesktop">React demo testing application</h1>
                    </div>

                    {location.pathname !== "/" &&
                        <div className="link-wrapper">
                            <Link to={"/"}>Go to main page</Link>
                        </div>
                    }

                </div>

            </header>


        </>
    )

}

export default Header;
