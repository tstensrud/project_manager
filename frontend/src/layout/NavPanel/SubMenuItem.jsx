import { useNavigate } from "react-router-dom";

function SubMenuItem({ svg, text, url, index, activeNavIndex, setActiveNavIndex }) {
    const navigate = useNavigate();

    const handleClick = () => {

        setActiveNavIndex(index)
        navigate(url)
    }
    return (
        <>
            <div className="flex items-center" onClick={handleClick}>
                <div className={`group pl-[2x] mt-1 mb-1 pt-2 pb-2 flex flex-row w-full items-center cursor-pointer ${index === activeNavIndex ? 'bg-navbar-active-bg-color dark:bg-dark-navbar-hover-bg-color' : 'hover:bg-navbar-hover-bg-color hover:dark:bg-dark-navbar-hover-bg-color'}  rounded-lg transition duration-300`}>
                    <div className="pl-1 flex h-full justify-center items-center">
                        {svg}
                    </div>
                    <div className="pl-3 flex h-full items-center justify-center text-sm tracking-wide text-grey-text dark:text-dark-grey-text group-hover:dark:text-dark-primary-color group-hover:text-primary-color transition duration-300">
                        {text}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubMenuItem;