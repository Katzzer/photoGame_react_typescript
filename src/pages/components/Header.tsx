import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {PageUrl} from "../../tools/RouterEnum";

const Header = () => {
    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <>
            {currentPage !== PageUrl.ROOT &&
            <header>
                <div className="header__wrapper">
                    <div id="header">
                        <h1 className="header__textForDesktop">Photo game - frontend</h1>
                    </div>

                    {currentPage === PageUrl.UPLOAD_IMAGE &&
                    <div className="link-wrapper">
                        <Link to={PageUrl.ALL_PHOTOS}>Show all images</Link>
                    </div>
                    }

                    {currentPage === PageUrl.ALL_PHOTOS &&
                        <div className="link-wrapper">
                            <Link to={PageUrl.UPLOAD_IMAGE}>Upload image</Link>
                        </div>
                    }

                </div>
            </header>
            }
        </>
    )

}

export default Header;
