import {Link} from "react-router-dom";


function MainPage() {
    return (
        <>
            <div className="container">

                <div className="mainPage__link-wrapper">
                    <div className="link-wrapper">
                        <Link to={"/todo"}>To do - simple To Do list (create / delete)</Link>
                    </div>
                </div>


            </div>

        </>
    );
}

export default MainPage;
