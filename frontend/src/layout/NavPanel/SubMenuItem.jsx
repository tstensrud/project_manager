import { Link } from "react-router-dom";

function SubMenuItem({ svg, text, url, index }) {
    return (
        <>
            <Link className="flex items-center" to={url}>
                <div className="group p-[2px] flex flex-row w-full items-center cursor-pointer hover:bg-tertiary-color hover:dark:bg-dark-navbar-hover-bg-color rounded-lg pt-1 pb-1 transition duration-300">
                    <div className="pl-1 flex h-full justify-center items-center">
                        {svg}
                    </div>
                    <div className="pl-3 flex h-full items-center justify-center text-sm tracking-wide text-grey-text dark:text-dark-grey-text group-hover:dark:text-dark-primary-color group-hover:text-primary-color transition duration-300">
                        {text}
                    </div>
                </div>
            </Link>
        </>
    );
}

export default SubMenuItem;