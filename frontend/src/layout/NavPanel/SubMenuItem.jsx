import { useNavigate } from "react-router-dom";

function SubMenuItem({ svg, text, url, index, activeNavIndex, setActiveNavIndex, showNavPanel }) {
    const navigate = useNavigate();

    const handleClick = () => {
        setActiveNavIndex(index);
        navigate(url);
    }

    return (

        <div className="flex justify-center items-center whitespace-nowrap h-9 relative" onClick={handleClick}>
            <div className={`group p-2 mt-1 mb-1 overflow-x-hidden flex flex-row w-full items-center cursor-pointer ${index === activeNavIndex ? 'bg-navbar-active-bg-color  dark:bg-dark-navbar-hover-bg-color' : 'hover:bg-navbar-hover-bg-color hover:dark:bg-dark-navbar-hover-bg-color'}  rounded-lg transition duration-200`}>
                <div className="flex pl-[2px] h-full justify-center items-center">
                    {svg}
                </div>
                <div className={`pl-3 flex h-full items-center justify-center text-sm ${index === activeNavIndex && 'dark:text-dark-primary-color'} tracking-wide text-grey-text dark:text-dark-grey-text group-hover:dark:text-dark-primary-color group-hover:text-primary-color transition duration-200`}>
                    {text}
                </div>
            </div>
        </div>
    );
}

export default SubMenuItem;