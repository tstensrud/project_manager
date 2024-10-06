import { Link } from "react-router-dom";

function SubMenuItem({ svg, text, url, index }) {
    return (
        <>
            <Link className="text-grey-text flex items-center dark:text-dark-grey-text group-hover:text-primary-color group-hover:dark:text-dark-primary-color transition duration-300" to={url}>
                <div className="group p-[2px] flex flex-row w-full items-center cursor-pointer hover:bg-secondary-color hover:dark:bg-dark-navbar-active-bg-color rounded-lg pt-1 pb-1">
                    <div className="pl-1 flex h-full justify-center items-center">
                        {svg}
                    </div>
                    <div className="pl-3 flex h-full items-center justify-center text-sm tracking-wide">
                        {text}
                    </div>
                </div>
            </Link>
        </>
    );
}

export default SubMenuItem;