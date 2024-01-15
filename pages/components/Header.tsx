import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {Page} from "../../tools/RouterEnum";

const Header = () => {
    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <>
            {currentPage !== Page.ROOT &&
            <header>
                <div className="header__wrapper">
                    <div id="header">
                        <h1 className="header__textForDesktop">Photo game - frontend</h1>
                    </div>

                    {currentPage === Page.UPLOAD_IMAGE &&
                    <div className="link-wrapper">
                        <Link to={Page.ALL_PHOTOS}>Show all images</Link>
                    </div>
                    }

                    {currentPage === Page.ALL_PHOTOS &&
                        <div className="link-wrapper">
                            <Link to={Page.UPLOAD_IMAGE}>Upload image</Link>
                        </div>
                    }

                </div>
            </header>
            }
        </>
    )

}

export default Header;
