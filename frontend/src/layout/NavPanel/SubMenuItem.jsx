import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubMenuItem({ svg, text, url, index, activeNavIndex, setActiveNavIndex, showNavPanel }) {
    const navigate = useNavigate();
    const [showToolTip, setShowToolTip] = useState(false);

    const handleClick = () => {
        setActiveNavIndex(index);
        navigate(url);
    }

    return (

        <div onMouseOver={() => !showNavPanel && setShowToolTip(true)} onMouseOut={() => !showNavPanel && setShowToolTip(false)} className="flex items-center whitespace-nowrap h-9 relative" onClick={handleClick}>
            <div className={`group pl-[2px] mt-1 mb-1 pt-2 pb-2 overflow-x-hidden flex flex-row w-full items-center cursor-pointer ${index === activeNavIndex ? 'bg-navbar-active-bg-color  dark:bg-dark-navbar-hover-bg-color' : 'hover:bg-navbar-hover-bg-color hover:dark:bg-dark-navbar-hover-bg-color'}  rounded-lg transition duration-200`}>
                <div className="pl-1 flex h-full justify-center items-center">
                    {svg}
                </div>
                <div className={`pl-3 flex h-full items-center justify-center text-sm ${index === activeNavIndex && 'dark:text-dark-primary-color'} tracking-wide text-grey-text dark:text-dark-grey-text group-hover:dark:text-dark-primary-color group-hover:text-primary-color transition duration-200`}>
                    {showNavPanel && text}
                </div>
            </div>
            {
                !showNavPanel && (
                    <>
                        {
                            showToolTip && (
                                text === "Logg ut" ? (
                                    <div class="absolute left-12 -top-10 translate-y-1/2 z-[999] items-start gap-2.5 text-sm">
                                        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-2 bg-accent-color dark:bg-dark-accent-color rounded-br-xl rounded-tl-xl rounded-tr-xl">
                                            <div class="flex items-center space-x-2 rtl:space-x-reverse text-secondary-color dark:text-dark-primary-color">
                                                {text}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div class="absolute left-12 top-0 translate-y-1/2 z-[999] items-start gap-2.5 text-sm">
                                        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-2 bg-accent-color dark:bg-dark-accent-color rounded-e-xl rounded-es-xl">
                                            <div class="flex items-center space-x-2 rtl:space-x-reverse text-secondary-color dark:text-dark-primary-color">
                                                {text}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </>
                )
            }

        </div>
    );
}

export default SubMenuItem;